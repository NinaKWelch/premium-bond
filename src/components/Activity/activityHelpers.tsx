import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import {
  DeleteOutlined as DeleteOutlineIcon,
  EditOutlined as EditOutlinedIcon,
} from '@mui/icons-material';
import type { TTransaction } from '#types/bonds';

export const displayLabel = (type: TTransaction['type'] | 'prize') => {
  if (type === 'reinvestment') {
    return 'reinvested prize';
  }

  return type;
};

export const ActionButtons = ({
  onEdit,
  onDelete,
  mobileWhiteBg = false,
}: {
  onEdit: () => void;
  onDelete: () => void;
  mobileWhiteBg?: boolean;
}) => (
  <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
    <IconButton
      size="small"
      aria-label="Edit"
      onClick={onEdit}
      sx={{
        color: 'primary.main',
        ...(mobileWhiteBg && { bgcolor: 'white' }),
        '&:hover, &:active': { bgcolor: 'primary.main', color: 'white' },
      }}
    >
      <EditOutlinedIcon fontSize="small" />
    </IconButton>
    <IconButton
      size="small"
      aria-label="Delete"
      onClick={onDelete}
      sx={{
        color: 'error.main',
        ...(mobileWhiteBg && { bgcolor: 'white' }),
        '&:hover, &:active': { bgcolor: 'error.main', color: 'white' },
      }}
    >
      <DeleteOutlineIcon fontSize="small" />
    </IconButton>
  </Stack>
);
