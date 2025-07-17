import PropTypes from 'prop-types'
import { useState } from 'react'
// @mui
import { useTheme } from '@mui/material/styles'
import { TableRow, TableCell, Typography, MenuItem } from '@mui/material'
// components
import Label from 'src/components/Label'
import Iconify from 'src/components/Iconify'
import { TableMoreMenu } from 'src/components/table'

// ----------------------------------------------------------------------

AdminTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onDisableRow: PropTypes.func,
  onEnableRow: PropTypes.func
}

export default function AdminTableRow({
  row,
  onEditRow,
  onDisableRow,
  onEnableRow
}) {
  const theme = useTheme()

  const { name, identification_number, email, is_active } = row

  const [openMenu, setOpenMenuActions] = useState(null)

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null)
  }

  return (
    <TableRow hover={false}>
      <TableCell
        sx={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }}
      >
        <Typography variant="subtitle2" noWrap>
          {identification_number}
        </Typography>
        <Typography variant="body2">{email}</Typography>
      </TableCell>

      <TableCell align="left">{name}</TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(is_active && 'success') || 'error'}
          sx={{ textTransform: 'capitalize' }}
        >
          {is_active ? 'Active' : 'In Active'}
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
                <Iconify icon={'eva:edit-2-fill'} />
                Edit
              </MenuItem>
              <MenuItem
                onClick={is_active ? onDisableRow : onEnableRow}
                sx={{
                  color: is_active
                    ? theme.palette.error.main
                    : theme.palette.secondary.main
                }}
              >
                {is_active ? (
                  <>
                    <Iconify icon={'eva:minus-circle-outline'} />
                    Disable
                  </>
                ) : (
                  <>
                    <Iconify icon={'eva:person-done-fill'} />
                    Enable
                  </>
                )}
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  )
}
