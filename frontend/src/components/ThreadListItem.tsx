import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Chip,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ChatBubbleOutlined as ChatIcon,
  PushPin as PinIcon,
  Lock as LockIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import type { Thread } from '../types';
import { colorFromString, initials, timeAgo } from '../utils/format';
import {
  isThreadLocked,
  resolveCategoryLabel,
  threadHasStats,
  threadTagNames,
} from '../utils/thread';

interface ThreadListItemProps {
  thread: Thread;
  showCategory?: boolean;
  /** Resolved from parent context when the thread payload lacks categoryName. */
  categoryName?: string;
}

export default function ThreadListItem({
  thread,
  showCategory,
  categoryName,
}: ThreadListItemProps) {
  const authorName = thread.author ?? 'Anonymous';
  const categoryLabel = resolveCategoryLabel(thread, categoryName);
  const tags = threadTagNames(thread);
  const showStats = threadHasStats(thread);

  return (
    <Card sx={{ overflow: 'hidden' }}>
      <CardActionArea
        component={RouterLink}
        to={`/threads/${thread.id}`}
        sx={{ alignItems: 'stretch' }}
      >
        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Stack direction="row" spacing={2}>
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor: colorFromString(authorName),
                fontSize: 14,
              }}
            >
              {initials(authorName)}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 0.5 }}
              >
                {thread.pinned && (
                  <Tooltip title="Pinned">
                    <PinIcon
                      sx={{ fontSize: 16, color: 'secondary.main' }}
                    />
                  </Tooltip>
                )}
                {isThreadLocked(thread) && (
                  <Tooltip title="Locked">
                    <LockIcon
                      sx={{ fontSize: 16, color: 'text.secondary' }}
                    />
                  </Tooltip>
                )}
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {thread.title}
                </Typography>
              </Stack>

              {thread.excerpt && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1.25,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {thread.excerpt}
                </Typography>
              )}

              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  color: 'text.secondary',
                  fontSize: 13,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: 'text.primary', fontWeight: 600, fontSize: 13 }}
                >
                  {authorName}
                </Typography>
                <Box component="span">·</Box>
                <span>{timeAgo(thread.createdAt) || 'recently'}</span>
                {showCategory && categoryLabel && (
                  <>
                    <Box component="span">·</Box>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={categoryLabel}
                      sx={{ height: 22 }}
                    />
                  </>
                )}
                {tags.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag}
                    size="small"
                    label={`#${tag}`}
                    sx={{ height: 22 }}
                  />
                ))}
              </Stack>
            </Box>

            {showStats && (
              <Stack
                spacing={1}
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'flex-end',
                  color: 'text.secondary',
                  fontSize: 13,
                  minWidth: 96,
                }}
              >
                {thread.postCount != null && (
                  <Stack
                    direction="row"
                    spacing={0.75}
                    sx={{ alignItems: 'center' }}
                  >
                    <ChatIcon sx={{ fontSize: 16 }} />
                    <span>{thread.postCount}</span>
                  </Stack>
                )}
                {thread.viewCount != null && (
                  <Stack
                    direction="row"
                    spacing={0.75}
                    sx={{ alignItems: 'center' }}
                  >
                    <ViewIcon sx={{ fontSize: 16 }} />
                    <span>{thread.viewCount}</span>
                  </Stack>
                )}
                {thread.lastPostAt && (
                  <Typography variant="caption" color="text.secondary">
                    Last reply {timeAgo(thread.lastPostAt)}
                  </Typography>
                )}
              </Stack>
            )}
          </Stack>
        </Box>
      </CardActionArea>
    </Card>
  );
}
