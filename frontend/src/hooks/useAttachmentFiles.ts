import { useCallback, useState } from 'react';
import {
  ATTACHMENT_ACCEPT,
  partitionAttachmentFiles,
} from '../utils/attachmentUpload';

export function useAttachmentFiles() {
  const [files, setFiles] = useState<File[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const addFiles = useCallback((picked: FileList | File[]) => {
    const { valid, errors } = partitionAttachmentFiles(Array.from(picked));
    if (errors.length > 0) {
      setValidationError(errors.join(' '));
    } else {
      setValidationError(null);
    }
    if (valid.length > 0) {
      setFiles((prev) => [...prev, ...valid]);
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setValidationError(null);
  }, []);

  return {
    files,
    validationError,
    addFiles,
    removeFile,
    clearFiles,
    accept: ATTACHMENT_ACCEPT,
  };
}
