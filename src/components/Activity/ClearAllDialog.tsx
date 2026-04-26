import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface IClearAllDialogProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ClearAllDialog = ({ open, onConfirm, onClose }: IClearAllDialogProps) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Clear all activity?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        This will permanently delete all your transactions and prizes. This cannot be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button color="error" onClick={onConfirm}>
        Clear all
      </Button>
    </DialogActions>
  </Dialog>
);

export default ClearAllDialog;
