import PropTypes from 'prop-types'
import { MenuItem, TableCell, TableRow } from '@mui/material'
import { TableMoreMenu } from 'src/components/table'
import { fDate } from 'src/utils/formatTime'
import { useTheme } from '@emotion/react'
import { useState } from 'react'
import Iconify from 'src/components/Iconify'

// ----------------------------------------------------------------------

SemesterTableRow.propTypes = {
  row: PropTypes.object,
  onRowEdit: PropTypes.func,
  onRowDelete: PropTypes.func
}

export default function SemesterTableRow({ row, onRowEdit, onRowDelete }) {
  const theme = useTheme()

  const [openMenu, setOpenMenuActions] = useState(null)

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null)
  }

  return (
    <TableRow key={row.number}>
      <TableCell align="left">{row.number}</TableCell>
      <TableCell align="left">{fDate(row.start_date)}</TableCell>
      <TableCell align="left">{fDate(row.end_date)}</TableCell>
      <TableCell>
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onRowEdit()
                  handleCloseMenu()
                }}
              >
                <Iconify icon={'eva:edit-outline'} />
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onRowDelete()
                  handleCloseMenu()
                }}
              >
                <Iconify
                  sx={{
                    color: theme.palette.error.main
                  }}
                  icon={'eva:trash-2-outline'}
                />
                Delete
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  )
}
