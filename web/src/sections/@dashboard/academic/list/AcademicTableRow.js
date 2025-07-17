import PropTypes from 'prop-types'
import { useState } from 'react'
// @mui
import { MenuItem, TableCell, TableRow, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
// components
import Iconify from 'src/components/Iconify'
import Label from 'src/components/Label'
import { TableMoreMenu } from 'src/components/table'
import { fDateYear } from 'src/utils/formatTime'

// ----------------------------------------------------------------------

AcademicTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onRowDuplicate: PropTypes.func
}

export default function AcademicTableRow({
  row,
  selected,
  onViewRow,
  onRowDuplicate,
  onRowDelete
}) {
  const theme = useTheme()

  const { start_date, end_date, semesters } = row

  const [openMenu, setOpenMenuActions] = useState(null)

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null)
  }

  return (
    <TableRow selected={selected}>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {fDateYear(start_date)} - {fDateYear(end_date)}
        </Typography>
      </TableCell>

      <TableCell
        align="left"
        sx={{
          '& > *': { mr: 0.5 }
        }}
      >
        {semesters.map((semester, index) => (
          <Label
            key={index}
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color="info"
            sx={{ textTransform: 'capitalize' }}
          >
            {semester.semester_number}
          </Label>
        ))}
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
                  onViewRow()
                  handleCloseMenu()
                }}
              >
                <Iconify icon={'eva:eye-fill'} />
                View
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onRowDuplicate()
                  handleCloseMenu()
                }}
              >
                <Iconify icon={'eva:copy-outline'} />
                Duplicate
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
