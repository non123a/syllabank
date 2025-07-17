import React, { useState, useEffect, useRef } from 'react'
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  styled,
  Tooltip,
  Autocomplete
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { fAcademicYear } from 'src/utils/formatTime'

// Styled components (same as before)
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold'
  },
  '&.MuiTableCell-body': {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

const TruncatedCell = styled(TableCell)({
  maxWidth: 200,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
})

const SyllabiRequestForm = ({
  academicYear,
  semester,
  onCoursesChange,
  syllabi
}) => {
  const [courses, setCourses] = useState([
    { id: null, syllabus_name: '', sections: '[]', instructors: '' }
  ])
  const [availableCourses, setAvailableCourses] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (syllabi && syllabi.length > 0) {
      setCourses([
        { id: null, syllabus_name: '', sections: '[]', instructors: '' }
      ])
      setAvailableCourses(syllabi)
    } else {
      setCourses([])
      setAvailableCourses([])
    }
  }, [syllabi])

  useEffect(() => {
    const coursesChanged =
      JSON.stringify(courses) !== JSON.stringify(prevCourses.current)
    if (coursesChanged) {
      onCoursesChange(courses.filter((course) => course.id !== null))
      prevCourses.current = courses
    }
    // Clear error when courses are added
    if (courses.length > 0) {
      setError('')
    }
  }, [courses, onCoursesChange])

  const prevCourses = useRef(courses)

  const handleAddCourse = () => {
    if (courses.length < 7 && availableCourses.length > 0) {
      setCourses([
        ...courses,
        { id: null, syllabus_name: '', sections: '[]', instructors: '' }
      ])
    }
  }

  const handleRemoveCourse = (index) => {
    if (courses.length > 1) {
      const newCourses = courses.filter((_, i) => i !== index)
      setCourses(newCourses)
    }
  }

  const handleCourseChange = (index, newValue) => {
    const newCourses = [...courses]
    const oldCourse = newCourses[index]
    newCourses[index] = newValue || {
      id: null,
      syllabus_name: '',
      sections: '[]',
      instructors: ''
    }
    setCourses(newCourses)

    if (oldCourse && oldCourse.id) {
      setAvailableCourses([...availableCourses, oldCourse])
    }
    if (newValue) {
      setAvailableCourses(
        availableCourses.filter((course) => course.id !== newValue.id)
      )
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validCourses = courses.filter((course) => course.id !== null)
    if (validCourses.length === 0) {
      setError('Please select at least one course')
    } else {
      setError('')
      onCoursesChange(validCourses)
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom color="primary">
        Syllabi Request Form - AY{' '}
        {fAcademicYear(academicYear.start_date, academicYear.end_date)} -
        Semester {semester.semester_number}
      </Typography>
      {syllabi.length === 0 ? (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 2, mb: 2 }}
        >
          No syllabi available for the selected academic year and semester.
        </Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <TableContainer sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell width="40%">Course</StyledTableCell>
                  <StyledTableCell width="20%">Lecturer(s)</StyledTableCell>
                  <StyledTableCell width="25%">Sections</StyledTableCell>
                  <StyledTableCell width="15%">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course, index) => (
                  <StyledTableRow key={index}>
                    <TableCell>
                      <Autocomplete
                        value={course.id ? course : null}
                        onChange={(event, newValue) => {
                          handleCourseChange(index, newValue)
                        }}
                        options={availableCourses}
                        getOptionLabel={(option) => option.syllabus_name}
                        renderInput={(params) => (
                          <TextField {...params} size="small" />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                      />
                    </TableCell>
                    <TruncatedCell>
                      <Tooltip title={course.instructors} placement="top-start">
                        <span>{course.instructors}</span>
                      </Tooltip>
                    </TruncatedCell>
                    <TruncatedCell>
                      <Tooltip
                        title={JSON.parse(course.sections).join(', ')}
                        placement="top-start"
                      >
                        <span>{JSON.parse(course.sections).join(', ')}</span>
                      </Tooltip>
                    </TruncatedCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => handleRemoveCourse(index)}
                          size="small"
                          color="error"
                          disabled={courses.length === 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {error && (
            <Typography color="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCourse}
              disabled={
                courses.length >= 7 ||
                availableCourses.length === 0 ||
                courses.some((course) => course.id === null)
              }
              startIcon={<AddIcon />}
            >
              Add Course
            </Button>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, mb: 2 }}
          >
            {courses.length < 7
              ? 'Select a course to add more rows (up to 7 courses).'
              : 'Maximum number of courses reached.'}
          </Typography>
        </form>
      )}
    </Paper>
  )
}

export default SyllabiRequestForm
