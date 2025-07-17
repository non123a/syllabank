import PropTypes from 'prop-types'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

// ----------------------------------------------------------------------

DeleteAcademicYearDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  loading: PropTypes.bool
}

export default function DeleteAcademicYearDialog({
  open,
  onClose,
  onConfirm,
  loading = false
}) {
  return (
    <Dialog open={open} onClose={onClose} keepMounted>
      <DialogTitle>Delete Academic Year</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this academic year? All data will be
          lost and this action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          variant="contained"
          onClick={onClose}
          color="primary"
          disabled={loading}
        >
          Cancel
        </Button>
        <LoadingButton
          variant="outlined"
          onClick={onConfirm}
          color="error"
          disabled={loading}
          loading={loading}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
