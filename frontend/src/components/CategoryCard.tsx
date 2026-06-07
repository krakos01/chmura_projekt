import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import {
  Forum as ForumIcon,
  ChatBubbleOutlined as ChatIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import type { Category } from '../types';
import { colorFromString } from '../utils/format';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const accent = category.color ?? colorFromString(category.name);
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea
        component={RouterLink}
        to={`/categories/${category.id}`}
        sx={{ height: '100%', alignItems: 'stretch' }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'flex-start' }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                boxShadow: `0 8px 20px -10px ${accent}`,
                flexShrink: 0,
              }}
            >
              <ForumIcon />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="h6"
                sx={{ lineHeight: 1.25, mb: 0.5, fontWeight: 700 }}
              >
                {category.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: 40,
                }}
              >
                {category.description ?? 'Talk fishing with the community.'}
              </Typography>
              {(category.threadCount != null || category.postCount != null) && (
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    mt: 2,
                    color: 'text.secondary',
                    fontSize: 13,
                    alignItems: 'center',
                  }}
                >
                  {category.threadCount != null && (
                    <Stack
                      direction="row"
                      spacing={0.75}
                      sx={{ alignItems: 'center' }}
                    >
                      <ForumIcon sx={{ fontSize: 16 }} />
                      <span>{category.threadCount} threads</span>
                    </Stack>
                  )}
                  {category.postCount != null && (
                    <Stack
                      direction="row"
                      spacing={0.75}
                      sx={{ alignItems: 'center' }}
                    >
                      <ChatIcon sx={{ fontSize: 16 }} />
                      <span>{category.postCount} posts</span>
                    </Stack>
                  )}
                </Stack>
              )}
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
