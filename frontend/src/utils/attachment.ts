import type { Attachment } from '../types';

const IMAGE_EXT = /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i;

export function attachmentFilename(attachment: Attachment): string {
  return (
    attachment.filename ??
    attachment.originalFilename ??
    `attachment-${attachment.id}`
  );
}

export function attachmentContentType(attachment: Attachment): string | undefined {
  return attachment.contentType ?? attachment.mimeType;
}

export function isImageAttachment(attachment: Attachment): boolean {
  const type = attachmentContentType(attachment);
  if (type?.startsWith('image/')) return true;
  return IMAGE_EXT.test(attachmentFilename(attachment));
}

/**
 * Resolve the public URL for an attachment.
 * Backend serves static files at `/uploads/**` — use the `url` field as-is.
 */
export function attachmentUrl(attachment: Attachment): string {
  const direct =
    attachment.url ??
    attachment.downloadUrl ??
    (attachment as { href?: string }).href;

  if (!direct) return '';

  if (direct.startsWith('http://') || direct.startsWith('https://')) {
    return direct;
  }

  if (direct.startsWith('/')) {
    return direct;
  }

  return `/${direct.replace(/^\//, '')}`;
}
