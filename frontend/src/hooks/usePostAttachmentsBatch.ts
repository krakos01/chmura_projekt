import { useEffect, useMemo, useState } from 'react';
import { postsApi } from '../api/posts';
import type { Attachment } from '../types';

/** Fetches attachments for all posts in a thread concurrently. */
export function usePostAttachmentsBatch(
  postIds: ReadonlyArray<number | string>,
) {
  const [attachmentsByPostId, setAttachmentsByPostId] = useState<
    Record<string, Attachment[]>
  >({});
  const [loading, setLoading] = useState(false);

  const idsKey = useMemo(() => postIds.map(String).join(','), [postIds]);
  const hasPosts = postIds.length > 0;

  useEffect(() => {
    if (!hasPosts) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    Promise.all(
      postIds.map(async (postId) => {
        try {
          const items = await postsApi.attachments(postId);
          return [String(postId), items] as const;
        } catch {
          return [String(postId), []] as const;
        }
      }),
    )
      .then((entries) => {
        if (!cancelled) {
          setAttachmentsByPostId(Object.fromEntries(entries));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // idsKey tracks postIds content; postIds reference is stable via useMemo upstream.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, hasPosts]);

  if (!hasPosts) {
    return { attachmentsByPostId: {}, loading: false };
  }

  return { attachmentsByPostId, loading };
}
