import {
  Alert,
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useRef } from 'react';
import { formatBytes } from '../utils/format';
import { MAX_ATTACHMENT_BYTES } from '../utils/attachmentUpload';

interface AttachmentFilePickerProps {
  files: File[];
  onAdd: (files: FileList | File[]) => void;
  onRemove: (index: number) => void;
  accept: string;
  disabled?: boolean;
  validationError?: string | null;
}

export default function AttachmentFilePicker({
  files,
  onAdd,
  onRemove,
  accept,
  disabled = false,
  validationError,
}: AttachmentFilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box>
      {validationError && (
        <Alert severity="warning" sx={{ mb: 1.5 }}>
          {validationError}
        </Alert>
      )}

      {files.length > 0 && (
        <Stack
          direction="row"
          useFlexGap
          sx={{ flexWrap: 'wrap', gap: 1, mb: 1.5 }}
        >
          {files.map((file, idx) => (
            <Chip
              key={`${file.name}-${idx}`}
              icon={<AttachFileIcon />}
              label={`${file.name} · ${formatBytes(file.size)}`}
              onDelete={disabled ? undefined : () => onRemove(idx)}
              deleteIcon={<CloseIcon />}
              variant="outlined"
            />
          ))}
        </Stack>
      )}

      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Tooltip title="Attach files (max 5 MB each)">
          <span>
            <IconButton
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              aria-label="Attach files"
            >
              <AttachFileIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Typography variant="caption" color="text.secondary">
          Images, PDF, or text · max {formatBytes(MAX_ATTACHMENT_BYTES)} each
        </Typography>
      </Stack>

      <input
        ref={inputRef}
        type="file"
        hidden
        multiple
        accept={accept}
        disabled={disabled}
        onChange={(e) => {
          const picked = e.target.files;
          if (picked) onAdd(picked);
          e.target.value = '';
        }}
      />
    </Box>
  );
}
