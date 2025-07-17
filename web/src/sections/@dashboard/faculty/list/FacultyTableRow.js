import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import {
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material'
import Label from 'src/components/Label'
import Iconify from 'src/components/Iconify'
import { TableMoreMenu } from 'src/components/table'
import TruncatedDescription from 'src/components/TruncatedDescription'

const FacultyTableRow = ({
  row,
  onEditRow,
  onViewRow,
  onDisableRow,
  onEnableRow,
  onToggleStatus
}) => {
  const theme = useTheme()
  const { id, code_name, full_name, description, is_active } = row

  const [openMenu, setOpenMenuActions] = useState(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null)
  }

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true)
    handleCloseMenu()
  }

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false)
  }

  const handleConfirmDisable = () => {
    onDisableRow(id)
    handleCloseConfirmDialog()
  }

  return (
    <>
      <TableRow hover>
        <TableCell align="left">{code_name}</TableCell>
        <TableCell align="left">{full_name || 'N/A'}</TableCell>
        <TableCell align="left">
          <TruncatedDescription text={description || 'N/A'} />
        </TableCell>
        <TableCell align="left">
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={(is_active && 'success') || 'error'}
          >
            {is_active ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>

        <TableCell align="right">
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                <MenuItem
                  onClick={() => {
                    onEditRow()
                    handleCloseMenu()
                  }}
                >
                  <Iconify icon={'eva:edit-fill'} />
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    if (is_active) {
                      handleOpenConfirmDialog()
                    } else {
                      onEnableRow(id)
                      handleCloseMenu()
                    }
                  }}
                  sx={{
                    color: is_active
                      ? theme.palette.error.main
                      : theme.palette.success.main
                  }}
                >
                  <Iconify
                    icon={
                      is_active
                        ? 'eva:slash-outline'
                        : 'eva:checkmark-circle-2-outline'
                    }
                  />
                  {is_active ? 'Deactivate' : 'Activate'}
                </MenuItem>
              </>
            }
          />
        </TableCell>
      </TableRow>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Confirm Deactivation'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you disable this faculty, it will also disable all departments
            that are under the faculty as well. Are you sure you want to
            proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button onClick={handleConfirmDisable} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

FacultyTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onToggleStatus: PropTypes.func,
  onDisableRow: PropTypes.func,
  onEnableRow: PropTypes.func
}

export default FacultyTableRow
