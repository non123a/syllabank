import PropTypes from 'prop-types'
import { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { TableRow, TableCell, Typography, MenuItem } from '@mui/material'
import Label from 'src/components/Label'
import Iconify from 'src/components/Iconify'
import { TableMoreMenu } from 'src/components/table'
import TruncatedDescription from 'src/components/TruncatedDescription'

DepartmentTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onToggleStatus: PropTypes.func,
  onDisableRow: PropTypes.func,
  onEnableRow: PropTypes.func
}

export default function DepartmentTableRow({
  row,
  onEditRow,
  onViewRow,
  onDisableRow,
  onEnableRow,
  onToggleStatus
}) {
  const theme = useTheme()

  const { id, code_name, full_name, description, is_active } = row

  const [openMenu, setOpenMenuActions] = useState(null)

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null)
  }

  return (
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
                    onDisableRow(id)
                  } else {
                    onEnableRow(id)
                  }
                  handleCloseMenu()
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
  )
}
