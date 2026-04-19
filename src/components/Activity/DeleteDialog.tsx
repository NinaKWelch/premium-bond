import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import type { TActivityItem } from '#types/bonds';
import { formatYearMonth } from '#utils/date';

interface IDeleteDialogProps {
  target: TActivityItem | null;
  error: string | null;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

const DeleteDialog = ({ target, error, onConfirm, onClose }: IDeleteDialogProps) => (
  <Dialog open={!!target} onClose={onClose}>
    <DialogTitle>Delete {target?.itemType}?</DialogTitle>
    <DialogContent>
      {error ? (
        <DialogContentText color="error">{error}</DialogContentText>
      ) : (
        <DialogContentText>
          This will permanently remove the {target && 'type' in target ? target.type : 'prize'} of £
          {target?.amount.toFixed(2)} on {formatYearMonth(target?.date ?? '')}. This cannot be
          undone.
        </DialogContentText>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      {!error && (
        <Button color="error" onClick={onConfirm}>
          Delete
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

export default DeleteDialog;
