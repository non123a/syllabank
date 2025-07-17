import PropTypes from 'prop-types'
import { useState } from 'react'
// @mui
import {
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

InstructorTableRow.propTypes = {
  row: PropTypes.object,
//   selected: PropTypes.bool,
  onEditRow: PropTypes.func,
//   onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func
}

export default function InstructorTableRow({
  row,
//   selected,
  onEditRow,
//   onSelectRow,
  onDeleteRow
}) {
  const { name, identification_number, email } = row

  const [openMenu, setOpenMenuActions] = useState(null)

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null)
  }

  return (
    <TableRow>
      <TableCell
        sx={{
          display: 'flex',
          alignItems: 'left',
          flexDirection: 'column'
        }}
      >
        <Typography variant="subtitle2" noWrap>
          {identification_number}
        </Typography>
        <Typography variant="body2">{email}</Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {name}
      </TableCell>

      <TableCell align="left">
        <Label
          variant={row.is_active ? 'ghost' : 'filled'}
          color={row.is_active ? 'success' : 'error'}
        >
          {row.is_active ? 'Active' : 'In-active'}
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
                  onDeleteRow()
                  handleCloseMenu()
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow()
                  handleCloseMenu()
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  )
}
