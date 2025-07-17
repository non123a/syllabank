import PropTypes from 'prop-types'
import { useState } from 'react'
// @mui
import { useTheme } from '@mui/material/styles'
import {
  Checkbox,
  TableRow,
  TableCell,
  Typography,
  MenuItem
} from '@mui/material'
// components
import Label from 'src/components/Label'
import Iconify from 'src/components/Iconify'
import { TableMoreMenu } from 'src/components/table'

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDisableRow: PropTypes.func,
  onEnableRow: PropTypes.func,
  onRefetch: PropTypes.func
}

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onViewRow,
  onDisableRow,
  onEnableRow,
  onRefetch
}) {
  const theme = useTheme()

  const {
    name,
    identification_number,
    email,
    department,
    faculty,
    roles,
    is_active
  } = row

  const [openMenu, setOpenMenuActions] = useState(null)

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null)
  }

  return (
    <TableRow selected={selected}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}

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
          color={(status === 'banned' && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {department?.code_name || 'N/A'}
        </Label>
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status === 'banned' && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {department?.faculty?.code_name || 'N/A'}
        </Label>
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status === 'banned' && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {roles
            ?.map((role) =>
              role.name.toLowerCase() === 'hod'
                ? 'Head of Department'
                : role.name.charAt(0).toUpperCase() + role.name.slice(1)
            )
            .join(', ')}
        </Label>
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(is_active && 'success') || 'error'}
          sx={{ textTransform: 'capitalize' }}
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
                <Iconify icon={'eva:edit-2-fill'} />
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  if (is_active) {
                    onDisableRow(row.id).then(() => onRefetch())
                  } else {
                    onEnableRow(row.id).then(() => onRefetch())
                  }
                  handleCloseMenu()
                }}
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
