import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { categoriesApi } from '../api/categories';
import { threadsApi } from '../api/threads';
import { postsApi } from '../api/posts';
import { useApi } from '../hooks/useApi';
import { useAttachmentFiles } from '../hooks/useAttachmentFiles';
import AttachmentFilePicker from '../components/AttachmentFilePicker';
import PageHeader from '../components/PageHeader';
import {
  formatUploadFailures,
  uploadAttachmentsToPost,
} from '../utils/attachmentUpload';

export default function NewThreadPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialCategoryId = params.get('categoryId') ?? '';

  const categories = useApi(() => categoriesApi.list(), []);

  const [title, setTitle] = useState('');
  const [chosenCategoryId, setChosenCategoryId] =
    useState<string>(initialCategoryId);
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    files,
    validationError,
    addFiles,
    removeFile,
    clearFiles,
    accept,
  } = useAttachmentFiles();

  const categoryId =
    chosenCategoryId || String(categories.data?.[0]?.id ?? '');

  const parsedTags = useMemo(
    () =>
      tagsInput
        .split(/[\s,]+/)
        .map((t) => t.replace(/^#/, '').trim())
        .filter(Boolean),
    [tagsInput],
  );

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !content.trim() || !categoryId) return;
      setSubmitting(true);
      setError(null);
      try {
        const created = await threadsApi.create({
          title: title.trim(),
          categoryId,
          tagNames: parsedTags.length ? parsedTags : undefined,
        });

        if (!created?.id) {
          navigate('/categories');
          return;
        }

        let postError: string | null = null;
        let newPostId: number | string | undefined;

        try {
          const newPost = await postsApi.create({
            threadId: created.id,
            content: content.trim(),
          });
          newPostId = newPost?.id;
        } catch (err) {
          postError =
            (err as Error).message ||
            'The first post could not be saved.';
        }

        if (postError) {
          navigate(`/threads/${created.id}`, {
            replace: true,
            state: {
              notice: `Your thread "${title.trim()}" was created, but the opening post could not be saved (${postError}). Please add your content as a reply on the thread page.`,
            },
          });
          return;
        }

        let attachmentNotice: string | null = null;
        if (files.length > 0 && newPostId) {
          const { failures } = await uploadAttachmentsToPost(
            newPostId,
            files,
          );
          if (failures.length > 0) {
            attachmentNotice = `Your thread was published, but some files failed to upload: ${formatUploadFailures(failures)}. You can try attaching them again in a reply.`;
          }
        }

        clearFiles();
        navigate(`/threads/${created.id}`, {
          replace: true,
          state: attachmentNotice ? { notice: attachmentNotice } : undefined,
        });
      } catch (err) {
        setError((err as Error).message || 'Could not create thread.');
      } finally {
        setSubmitting(false);
      }
    },
    [title, content, categoryId, parsedTags, files, navigate, clearFiles],
  );

  return (
    <Container maxWidth="md">
      <PageHeader
        eyebrow="New thread"
        title="Start a conversation"
        subtitle="Give your thread a clear title, pick a category, and share the details."
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Categories', to: '/categories' },
          { label: 'New thread' },
        ]}
      />

      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Best lures for early-season bass?"
                required
                slotProps={{ htmlInput: { maxLength: 160 } }}
                helperText={`${title.length}/160`}
              />

              <TextField
                select
                label="Category"
                value={categoryId}
                onChange={(e) => setChosenCategoryId(e.target.value)}
                required
                disabled={categories.loading}
              >
                {(categories.data ?? []).map((c) => (
                  <MenuItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Body"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tell the story. Include species, location (be vague if you like!), tackle, and what worked."
                multiline
                minRows={8}
                required
              />

              <AttachmentFilePicker
                files={files}
                onAdd={addFiles}
                onRemove={removeFile}
                accept={accept}
                disabled={submitting}
                validationError={validationError}
              />

              <TextField
                label="Tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="bass, topwater, mornings"
                helperText="Comma or space separated. Optional."
              />
              {parsedTags.length > 0 && (
                <Stack
                  direction="row"
                  useFlexGap
                  sx={{ flexWrap: 'wrap', gap: 1 }}
                >
                  {parsedTags.map((t) => (
                    <Chip key={t} label={`#${t}`} variant="outlined" />
                  ))}
                </Stack>
              )}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 1.5,
                }}
              >
                <Button onClick={() => navigate(-1)} disabled={submitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SendIcon />}
                  disabled={
                    submitting ||
                    !title.trim() ||
                    !content.trim() ||
                    !categoryId
                  }
                >
                  {submitting ? 'Publishing…' : 'Publish thread'}
                </Button>
              </Box>
              {!categories.loading && (categories.data?.length ?? 0) === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No categories are available yet. An administrator must create
                  one first.
                </Typography>
              )}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
