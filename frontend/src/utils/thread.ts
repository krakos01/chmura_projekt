import type { Thread } from '../types';

export function threadTagNames(thread: Thread): string[] {
  return thread.tagNames ?? thread.tags ?? [];
}

export function threadHasStats(thread: Thread): boolean {
  return (
    thread.postCount != null ||
    thread.viewCount != null ||
    thread.lastPostAt != null
  );
}

export function isThreadLocked(thread: Pick<Thread, 'status'>): boolean {
  return thread.status === 'LOCKED';
}

export function resolveCategoryLabel(
  thread: Thread,
  categoryName?: string,
): string | undefined {
  return categoryName ?? thread.categoryName;
}
