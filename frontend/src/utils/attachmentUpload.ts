import { postsApi } from '../api/posts';
import type { Attachment } from '../types';

export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

/** Shown on `<input accept="…">` — validated again in JS before upload. */
export const ATTACHMENT_ACCEPT =
  'image/png,image/jpeg,image/gif,image/webp,application/pdf,text/plain,.pdf,.doc,.docx';

const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const ALLOWED_EXTENSIONS = /\.(png|jpe?g|gif|webp|pdf|txt|doc|docx)$/i;

export function validateAttachmentFile(file: File): string | null {
  if (file.size > MAX_ATTACHMENT_BYTES) {
    return `"${file.name}" exceeds the 5 MB size limit.`;
  }

  const mime = file.type.toLowerCase();
  if (mime && ALLOWED_MIME_TYPES.has(mime)) {
    return null;
  }

  if (ALLOWED_EXTENSIONS.test(file.name)) {
    return null;
  }

  return `"${file.name}" is not an allowed file type. Use images, PDF, or text documents.`;
}

export function partitionAttachmentFiles(files: File[]): {
  valid: File[];
  errors: string[];
} {
  const valid: File[] = [];
  const errors: string[] = [];
  for (const file of files) {
    const message = validateAttachmentFile(file);
    if (message) errors.push(message);
    else valid.push(file);
  }
  return { valid, errors };
}

export interface AttachmentUploadFailure {
  filename: string;
  message: string;
}

export interface AttachmentUploadResult {
  uploaded: Attachment[];
  failures: AttachmentUploadFailure[];
}

/** Upload files sequentially after a post exists. Partial failures are collected. */
export async function uploadAttachmentsToPost(
  postId: number | string,
  files: File[],
): Promise<AttachmentUploadResult> {
  if (files.length === 0) {
    return { uploaded: [], failures: [] };
  }

  const results = await Promise.all(
    files.map(async (file) => {
      try {
        const attachment = await postsApi.uploadAttachment(postId, file);
        return { ok: true as const, attachment };
      } catch (err) {
        return {
          ok: false as const,
          filename: file.name,
          message: (err as Error).message || 'Upload failed.',
        };
      }
    }),
  );

  const uploaded: Attachment[] = [];
  const failures: AttachmentUploadFailure[] = [];

  for (const result of results) {
    if (result.ok) uploaded.push(result.attachment);
    else failures.push({ filename: result.filename, message: result.message });
  }

  return { uploaded, failures };
}

export function formatUploadFailures(failures: AttachmentUploadFailure[]): string {
  if (failures.length === 0) return '';
  return failures.map((f) => `${f.filename}: ${f.message}`).join('; ');
}
