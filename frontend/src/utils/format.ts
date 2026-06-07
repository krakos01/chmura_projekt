import { formatDistanceToNowStrict, parseISO } from 'date-fns';

export function timeAgo(date?: string | number | Date | null): string {
  if (!date) return '';
  try {
    const d =
      typeof date === 'string'
        ? parseISO(date)
        : date instanceof Date
          ? date
          : new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    return `${formatDistanceToNowStrict(d)} ago`;
  } catch {
    return '';
  }
}

export function initials(name?: string | null): string {
  if (!name) return '?';
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_PALETTE = [
  '#0e7490',
  '#0891b2',
  '#0284c7',
  '#7c3aed',
  '#c026d3',
  '#db2777',
  '#dc2626',
  '#ea580c',
  '#d97706',
  '#65a30d',
  '#16a34a',
  '#0d9488',
];

export function colorFromString(input?: string | null): string {
  if (!input) return AVATAR_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[idx];
}

export function formatBytes(bytes?: number): string {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}
