import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import {
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  Stack,
  Box,
  Button,
  Collapse
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import Label from 'src/components/Label'
import Iconify from 'src/components/Iconify'
import { TableMoreMenu } from 'src/components/table'
import AssignInstructorDialog from './AssignInstructorDialog'

FacultySyllabiTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  onAssignInstructor: PropTypes.func.isRequired,
  onDisableRow: PropTypes.func.isRequired,
  onEnableRow: PropTypes.func.isRequired
}

export default function FacultySyllabiTableRow({
  row,
  onAssignInstructor,
  onDisableRow,
  onEnableRow
}) {
  const theme = useTheme()

  const [localRow, setLocalRow] = useState(row)

  useEffect(() => {
    setLocalRow(row)
  }, [row])

  const {
    assignment_id: courseAssignmentId,
    course_code,
    course_name,
    course_subject,
    academic_year_start,
    academic_year_end,
    semester_number,
    instructor_id,
    instructor_names,
    head_of_dept_name,
    is_active
  } = localRow

  const [openMenu, setOpenMenuActions] = useState(null)
  const [openAssignDialog, setOpenAssignDialog] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null)
  }

  const handleOpenAssignDialog = () => {
    setOpenAssignDialog(true)
    handleCloseMenu()
  }

  const handleCloseAssignDialog = () => {
    setOpenAssignDialog(false)
  }

  const handleConfirmAssign = async (
    courseAssignmentId,
    selectedInstructors
  ) => {
    try {
      await onAssignInstructor(courseAssignmentId, selectedInstructors)
      setLocalRow((prev) => ({
        ...prev,
        instructor_id: selectedInstructors
          .map((instructor) => instructor.id)
          .join(','),
        instructor_names: selectedInstructors
          .map((instructor) => instructor.name)
          .join(', ')
      }))
      handleCloseAssignDialog()
    } catch (error) {
      console.error('Error assigning instructors:', error)
    }
  }

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  const handleDisableRow = async () => {
    await onDisableRow(courseAssignmentId)
    setLocalRow((prev) => ({ ...prev, is_active: false }))
    handleCloseMenu()
  }

  const handleEnableRow = async () => {
    await onEnableRow(courseAssignmentId)
    setLocalRow((prev) => ({ ...prev, is_active: true }))
    handleCloseMenu()
  }

  const formattedAcademicYear = `${academic_year_start.slice(
    0,
    4
  )} - ${academic_year_end.slice(0, 4)}`
  const formattedSemester = `Semester ${semester_number}`

  const formatInstructors = () => {
    if (!instructor_id || !instructor_names) return []
    const ids = instructor_id.split(',')
    const names = instructor_names.split(', ')
    return ids.map((id, index) => ({
      id,
      name: names[index]
    }))
  }

  const instructors = formatInstructors()
  const displayedInstructors = expanded ? instructors : instructors.slice(0, 2)
  const hasMoreInstructors = instructors.length > 2

  return (
    <>
      <TableRow hover>
        <TableCell>{`${course_subject} ${course_code}`}</TableCell>
        <TableCell>{`${course_name}`}</TableCell>
        <TableCell>
          <Typography variant="body2">{formattedAcademicYear}</Typography>
          <Typography variant="caption" color="textSecondary">
            {formattedSemester}
          </Typography>
        </TableCell>
        <TableCell>
          <Box sx={{ minWidth: 200 }}>
            {instructors.length > 0 ? (
              <Stack direction="column" spacing={1}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {displayedInstructors.map(
                    (instructor) =>
                      instructor.name && (
                        <Label
                          key={instructor.id}
                          variant={
                            theme.palette.mode === 'light' ? 'ghost' : 'filled'
                          }
                          color="info"
                        >
                          {instructor.name}
                        </Label>
                      )
                  )}
                </Box>
                {hasMoreInstructors && (
                  <Button
                    onClick={toggleExpand}
                    startIcon={
                      expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
                    }
                    size="small"
                    sx={{ alignSelf: 'flex-start', mt: 1 }}
                  >
                    {expanded
                      ? 'Show Less'
                      : `Show ${instructors.length - 2} More`}
                  </Button>
                )}
                <Collapse in={expanded}>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                  >
                    Total Assigned: {instructors.length}
                  </Typography>
                </Collapse>
              </Stack>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Not Assigned
              </Typography>
            )}
          </Box>
        </TableCell>
        <TableCell>{head_of_dept_name || 'N/A'}</TableCell>
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
                <MenuItem onClick={handleOpenAssignDialog}>
                  <Iconify icon="eva:person-add-fill" />
                  Assign Instructor
                </MenuItem>
                <MenuItem
                  onClick={is_active ? handleDisableRow : handleEnableRow}
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
      <AssignInstructorDialog
        open={openAssignDialog}
        onClose={handleCloseAssignDialog}
        onConfirm={handleConfirmAssign}
        courseAssignmentId={courseAssignmentId}
        currentInstructors={instructors}
      />
    </>
  )
}
