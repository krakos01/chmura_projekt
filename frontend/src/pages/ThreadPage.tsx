import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Lock as LockIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useCallback, useMemo, useState } from 'react';
import {
  Link as RouterLink,
  useLocation,
  useParams,
} from 'react-router-dom';
import { categoriesApi } from '../api/categories';
import { threadsApi } from '../api/threads';
import { postsApi } from '../api/posts';
import { useApi } from '../hooks/useApi';
import { useAttachmentFiles } from '../hooks/useAttachmentFiles';
import { usePostAttachmentsBatch } from '../hooks/usePostAttachmentsBatch';
import { useAuth } from '../hooks/useAuth';
import type { Post } from '../types';
import AttachmentFilePicker from '../components/AttachmentFilePicker';
import PageHeader from '../components/PageHeader';
import PostCard from '../components/PostCard';
import {
  CenteredSpinner,
  EmptyState,
  ErrorView,
} from '../components/StateViews';
import {
  formatUploadFailures,
  uploadAttachmentsToPost,
} from '../utils/attachmentUpload';
import { timeAgo } from '../utils/format';
import { isThreadLocked, threadTagNames } from '../utils/thread';

interface ThreadLocationState {
  notice?: string;
}

export default function ThreadPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const notice = (location.state as ThreadLocationState | null)?.notice;
  const { isAuthenticated } = useAuth();

  const threadFetcher = useCallback(() => threadsApi.get(id!), [id]);
  const postsFetcher = useCallback(() => threadsApi.posts(id!), [id]);

  const thread = useApi(threadFetcher, [id]);
  const posts = useApi(postsFetcher, [id]);

  const category = useApi(
    () =>
      thread.data?.categoryId
        ? categoriesApi.get(thread.data.categoryId)
        : Promise.resolve(null),
    [thread.data?.categoryId],
  );

  const orderedPosts = useMemo<Post[]>(() => {
    if (!posts.data) return [];
    return [...posts.data].sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return ta - tb;
    });
  }, [posts.data]);

  const postIds = useMemo(
    () => orderedPosts.map((p) => p.id),
    [orderedPosts],
  );
  const { attachmentsByPostId, loading: attachmentsLoading } =
    usePostAttachmentsBatch(postIds);

  const locked = thread.data ? isThreadLocked(thread.data) : false;
  const replyCount =
    thread.data?.postCount ??
    (!posts.loading && !posts.error ? orderedPosts.length : undefined);
  const categoryLabel =
    category.data?.name ?? thread.data?.categoryName ?? 'Category';

  return (
    <Container maxWidth="md">
      <PageHeader
        eyebrow="Thread"
        title={thread.data?.title ?? (thread.loading ? 'Loading…' : 'Thread')}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Categories', to: '/categories' },
          ...(thread.data?.categoryId
            ? [
                {
                  label: categoryLabel,
                  to: `/categories/${thread.data.categoryId}`,
                },
              ]
            : []),
          { label: thread.data?.title ?? 'Thread' },
        ]}
      />

      {notice && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 3 }}>
          {notice}
        </Alert>
      )}

      {thread.data && (
        <Stack
          direction="row"
          spacing={1.5}
          useFlexGap
          sx={{
            alignItems: 'center',
            flexWrap: 'wrap',
            mb: 3,
            color: 'text.secondary',
            fontSize: 14,
          }}
        >
          {thread.data.author && (
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              by {thread.data.author}
            </Typography>
          )}
          {thread.data.createdAt && (
            <>
              <Box component="span">·</Box>
              <span>{timeAgo(thread.data.createdAt)}</span>
            </>
          )}
          {replyCount != null && replyCount > 0 && (
            <>
              <Box component="span">·</Box>
              <span>
                {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
              </span>
            </>
          )}
          {locked && (
            <Chip
              size="small"
              icon={<LockIcon sx={{ fontSize: 14 }} />}
              label="Locked"
              variant="outlined"
            />
          )}
          {threadTagNames(thread.data).map((t) => (
            <Chip
              key={t}
              size="small"
              label={`#${t}`}
              variant="outlined"
              component={RouterLink}
              to={`/search?q=${encodeURIComponent(t)}`}
              clickable
            />
          ))}
        </Stack>
      )}

      {thread.error && (
        <ErrorView error={thread.error} onRetry={thread.refresh} />
      )}

      {posts.loading && <CenteredSpinner label="Loading posts…" />}
      {posts.error && (
        <ErrorView error={posts.error} onRetry={posts.refresh} />
      )}
      {!posts.loading &&
        !posts.error &&
        orderedPosts.length === 0 &&
        !locked && (
          <EmptyState
            title="No posts in this thread yet"
            description={
              isAuthenticated
                ? 'Be the first to add a reply.'
                : 'Sign in to add the first reply.'
            }
          />
        )}

      <Stack spacing={2}>
        {orderedPosts.map((p, idx) => (
          <PostCard
            key={p.id}
            post={p}
            index={idx}
            highlightOp
            attachments={attachmentsByPostId[String(p.id)]}
            attachmentsLoading={attachmentsLoading}
          />
        ))}
      </Stack>

      <Box sx={{ mt: 4 }}>
        {locked ? (
          <Alert
            severity="info"
            icon={<LockIcon fontSize="small" />}
            sx={{ borderRadius: 3 }}
          >
            This thread is locked. No new replies or attachments can be added.
          </Alert>
        ) : isAuthenticated ? (
          <ReplyForm
            threadId={id!}
            onPosted={() => posts.refresh()}
            allowAttachments
          />
        ) : (
          <Card>
            <CardContent
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { sm: 'center' },
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h6">Join the conversation</Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in or create an account to post a reply.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/login"
                  state={{ from: `/threads/${id}` }}
                >
                  Sign in
                </Button>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/register"
                >
                  Create account
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
}

interface ReplyFormProps {
  threadId: string;
  onPosted: () => void;
  disabled?: boolean;
  allowAttachments?: boolean;
}

function ReplyForm({
  threadId,
  onPosted,
  disabled = false,
  allowAttachments = false,
}: ReplyFormProps) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const {
    files,
    validationError,
    addFiles,
    removeFile,
    clearFiles,
    accept,
  } = useAttachmentFiles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || !content.trim()) return;
    setSubmitting(true);
    setError(null);
    setWarning(null);
    try {
      const created = await postsApi.create({
        threadId,
        content: content.trim(),
      });

      if (!created?.id) {
        throw new Error('Post was created but no post ID was returned.');
      }

      if (allowAttachments && files.length > 0) {
        const { failures } = await uploadAttachmentsToPost(
          created.id,
          files,
        );
        if (failures.length > 0) {
          setWarning(
            `Your reply was posted, but some files failed to upload: ${formatUploadFailures(failures)}`,
          );
        }
      }

      setContent('');
      clearFiles();
      onPosted();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (disabled) {
    return null;
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Reply
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {warning && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {warning}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, gear tips, or a fishing story…"
            multiline
            minRows={4}
            disabled={submitting || disabled}
            required
          />

          {allowAttachments && (
            <Box sx={{ mt: 1.5 }}>
              <AttachmentFilePicker
                files={files}
                onAdd={addFiles}
                onRemove={removeFile}
                accept={accept}
                disabled={submitting || disabled}
                validationError={validationError}
              />
            </Box>
          )}

          <Stack
            direction="row"
            sx={{ justifyContent: 'flex-end', mt: 2 }}
          >
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              disabled={submitting || disabled || !content.trim()}
            >
              {submitting ? 'Posting…' : 'Post reply'}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
