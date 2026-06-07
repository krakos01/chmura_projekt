import {
  Box,
  CircularProgress,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { postsApi } from '../api/posts';
import { useApi } from '../hooks/useApi';
import type { Attachment } from '../types';
import {
  attachmentFilename,
  attachmentUrl,
  isImageAttachment,
} from '../utils/attachment';
import { formatBytes } from '../utils/format';

interface PostAttachmentsProps {
  postId: number | string;
  /** Pre-loaded attachments from a parent batch fetch. */
  attachments?: Attachment[];
  /** When true, skip fetching (parent is loading attachments). */
  loading?: boolean;
}

export default function PostAttachments({
  postId,
  attachments: provided,
  loading: parentLoading = false,
}: PostAttachmentsProps) {
  const shouldFetch = provided === undefined && !parentLoading;
  const fetched = useApi(
    () => (shouldFetch ? postsApi.attachments(postId) : Promise.resolve([])),
    [postId, shouldFetch],
  );

  if (parentLoading || (shouldFetch && fetched.loading)) {
    return (
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={16} />
        <Typography variant="caption" color="text.secondary">
          Loading attachments…
        </Typography>
      </Box>
    );
  }

  const attachments = provided ?? fetched.data ?? [];
  const images = attachments.filter(isImageAttachment);
  const files = attachments.filter((a) => !isImageAttachment(a));

  if (attachments.length === 0) {
    return null;
  }

  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Stack spacing={1.5}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ letterSpacing: '0.12em' }}
        >
          Attachments
        </Typography>

        {images.length > 0 && (
          <Stack
            direction="row"
            useFlexGap
            sx={{ flexWrap: 'wrap', gap: 1.5 }}
          >
            {images.map((att) => {
              const name = attachmentFilename(att);
              const src = attachmentUrl(att);
              if (!src) return null;
              return (
                <Box
                  key={att.id}
                  component="a"
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'block',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: (t) => `1px solid ${t.palette.divider}`,
                    maxWidth: '100%',
                    transition:
                      'border-color 150ms ease, box-shadow 150ms ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: (t) =>
                        `0 8px 24px -12px ${t.palette.primary.main}66`,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={src}
                    alt={name}
                    loading="lazy"
                    sx={{
                      display: 'block',
                      maxWidth: '100%',
                      maxHeight: 420,
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      bgcolor: (t) =>
                        t.palette.mode === 'dark'
                          ? 'rgba(0,0,0,0.25)'
                          : 'rgba(0,0,0,0.04)',
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        )}

        {files.length > 0 && (
          <Stack
            direction="row"
            useFlexGap
            sx={{ flexWrap: 'wrap', gap: 1 }}
          >
            {files.map((att) => {
              const name = attachmentFilename(att);
              const href = attachmentUrl(att);
              if (!href) return null;
              return (
                <Link
                  key={att.id}
                  href={href}
                  download={name}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 2,
                    border: (t) => `1px solid ${t.palette.divider}`,
                    fontSize: 13,
                    '&:hover': {
                      borderColor: 'primary.main',
                      color: 'primary.main',
                    },
                  }}
                >
                  <AttachFileIcon sx={{ fontSize: 16 }} />
                  <span>{name}</span>
                  {att.size != null && (
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      {formatBytes(att.size)}
                    </Typography>
                  )}
                  <DownloadIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                </Link>
              );
            })}
          </Stack>
        )}
      </Stack>
    </>
  );
}
