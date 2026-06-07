import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import {
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import type { Attachment, Post } from '../types';
import {
  colorFromString,
  initials,
  timeAgo,
} from '../utils/format';
import PostAttachments from './PostAttachments';

interface PostCardProps {
  post: Post;
  index?: number;
  highlightOp?: boolean;
  attachments?: Attachment[];
  attachmentsLoading?: boolean;
}

export default function PostCard({
  post,
  index,
  highlightOp,
  attachments,
  attachmentsLoading,
}: PostCardProps) {
  const author = post.author ?? 'Anonymous';
  const isHidden = post.status === 'HIDDEN';
  const isOp = highlightOp && index === 0;

  return (
    <Card
      id={`post-${post.id}`}
      sx={{
        ...(isOp && {
          borderColor: (t) => t.palette.primary.main,
          boxShadow: (t) =>
            `0 0 0 1px ${t.palette.primary.main}33, 0 12px 36px -18px ${t.palette.primary.main}55`,
        }),
        ...(isHidden && { opacity: 0.6 }),
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2.5}
          sx={{ alignItems: 'flex-start' }}
        >
          <Stack
            spacing={1}
            sx={{ width: { sm: 92 }, alignItems: 'center' }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: colorFromString(author),
                fontSize: 18,
              }}
            >
              {initials(author)}
            </Avatar>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                {author}
              </Typography>
              {isOp && (
                <Chip
                  label="OP"
                  size="small"
                  color="primary"
                  sx={{ mt: 0.75, height: 18, fontSize: 10.5 }}
                />
              )}
            </Box>
          </Stack>

          <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            <Stack
              direction="row"
              useFlexGap
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
                color: 'text.secondary',
                fontSize: 13,
                mb: 1,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center' }}
              >
                {typeof index === 'number' && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontVariantNumeric: 'tabular-nums',
                      color: 'text.secondary',
                    }}
                  >
                    #{index + 1}
                  </Typography>
                )}
                <span>{timeAgo(post.createdAt) || 'just now'}</span>
                {post.updatedAt && post.updatedAt !== post.createdAt && (
                  <>
                    <Box component="span">·</Box>
                    <span>edited</span>
                  </>
                )}
              </Stack>
              {isHidden && (
                <Chip
                  size="small"
                  icon={<VisibilityOffIcon sx={{ fontSize: 14 }} />}
                  label="Hidden"
                  variant="outlined"
                />
              )}
            </Stack>

            <Typography
              component="div"
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: 'text.primary',
              }}
            >
              {post.content}
            </Typography>

            <PostAttachments
              postId={post.id}
              attachments={attachments}
              loading={attachmentsLoading}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
