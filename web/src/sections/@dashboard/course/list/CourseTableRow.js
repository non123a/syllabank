import PropTypes from 'prop-types'
import { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { TableRow, TableCell, Typography, MenuItem } from '@mui/material'
import Label from 'src/components/Label'
import Iconify from 'src/components/Iconify'
import { TableMoreMenu } from 'src/components/table'

CourseTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onToggleStatus: PropTypes.func,
  onDisableRow: PropTypes.func,
  onEnableRow: PropTypes.func
}

export default function CourseTableRow({
  row,
  onEditRow,
  onViewRow,
  onDisableRow,
  onEnableRow,
  onToggleStatus
}) {
  const theme = useTheme()

  const { id, course_code, course_subject, course_name, is_active, author } =
    row

  const [openMenu, setOpenMenuActions] = useState(null)

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null)
  }

  const author_name = author?.name || 'N/A'

  return (
    <TableRow hover>
      <TableCell align="left">{course_subject}</TableCell>
      <TableCell align="left">{course_code}</TableCell>
      <TableCell align="left">{course_name}</TableCell>
      <TableCell align="left">{author_name}</TableCell>
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
                  onEditRow(id)
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
