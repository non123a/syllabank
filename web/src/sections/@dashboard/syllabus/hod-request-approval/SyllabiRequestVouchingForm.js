import React, { useState } from 'react'
import {
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
  styled,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  TextField
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

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

// Updated fake data for courses with sections, longer titles, and multiple syllabi forms
const coursesData = [
  {
    id: 1,
    code: 'CS125',
    name: 'Introduction to Computer Science and Programming Fundamentals',
    author: 'Dr. Jane Smith',
    sections: ['A', 'B', 'C'],
    syllabiForms: ['Standard', 'Extended', 'Online']
  },
  {
    id: 2,
    code: 'CS126',
    name: 'Advanced Data Structures and Algorithms for Problem Solving',
    author: 'Prof. John Doe',
    sections: ['A', 'B'],
    syllabiForms: ['Standard', 'Project-based']
  },
  {
    id: 3,
    code: 'CS127',
    name: 'Database Management Systems and SQL Programming',
    author: 'Dr. Emily Johnson',
    sections: ['A', 'B', 'C', 'D'],
    syllabiForms: ['Standard', 'Practical', 'Research-oriented']
  },
  {
    id: 4,
    code: 'CS128',
    name: 'Web Development Fundamentals: HTML, CSS, and JavaScript',
    author: 'Prof. Michael Brown',
    sections: ['A', 'B'],
    syllabiForms: ['Standard', 'Portfolio-based']
  },
  {
    id: 5,
    code: 'CS129',
    name: 'Artificial Intelligence and Machine Learning Principles',
    author: 'Dr. Sarah Lee',
    sections: ['A', 'B', 'C'],
    syllabiForms: ['Standard', 'Research-oriented', 'Industry-focused']
  },
  {
    id: 6,
    code: 'CS130',
    name: 'Computer Networks and Data Communication Protocols',
    author: 'Prof. David Wilson',
    sections: ['A', 'B'],
    syllabiForms: ['Standard', 'Lab-based']
  },
  {
    id: 7,
    code: 'CS131',
    name: 'Software Engineering Practices and Project Management',
    author: 'Dr. Robert Taylor',
    sections: ['A', 'B', 'C'],
    syllabiForms: ['Standard', 'Agile', 'Waterfall']
  }
]

const SyllabiRequestVouchingForm = () => {
  const [description, setDescription] = useState('')
  const [syllabiForms, setSyllabiForms] = useState([
    {
      id: 1,
      name: 'Syllabus Form 1 - 2024/2025 - Semester 1',
      courses: coursesData.map((course) => ({ ...course, selected: false }))
    },
    {
      id: 2,
      name: 'Syllabus Form 2 - 2024/2025 - Semester 2',
      courses: coursesData.map((course) => ({ ...course, selected: false }))
    }
  ])

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handleCourseSelect = (formIndex, courseIndex) => {
    const newSyllabiForms = [...syllabiForms]
    newSyllabiForms[formIndex].courses[courseIndex].selected =
      !newSyllabiForms[formIndex].courses[courseIndex].selected
    setSyllabiForms(newSyllabiForms)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(syllabiForms)
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Student's Description"
          value={description}
          InputProps={{
            readOnly: true
          }}
          sx={{ mb: 3 }}
        />
        {syllabiForms.map((form, formIndex) => (
          <Accordion key={form.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${form.id}-content`}
              id={`panel${form.id}-header`}
            >
              <Typography>{form.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell width="10%">Code</StyledTableCell>
                      <StyledTableCell width="35%">Course</StyledTableCell>
                      <StyledTableCell width="20%">Lecturer</StyledTableCell>
                      <StyledTableCell width="15%">Sections</StyledTableCell>
                      <StyledTableCell width="15%">
                        Syllabi Forms
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {form.courses.map((course, courseIndex) => (
                      <StyledTableRow key={course.id}>
                        <TableCell>{course.code}</TableCell>
                        <TruncatedCell>
                          <Tooltip title={course.name} placement="top-start">
                            <span>{course.name}</span>
                          </Tooltip>
                        </TruncatedCell>
                        <TruncatedCell>
                          <Tooltip title={course.author} placement="top-start">
                            <span>{course.author}</span>
                          </Tooltip>
                        </TruncatedCell>
                        <TruncatedCell>
                          <Tooltip
                            title={course.sections?.join(', ')}
                            placement="top-start"
                          >
                            <span>{course.sections?.join(', ')}</span>
                          </Tooltip>
                        </TruncatedCell>
                        <TruncatedCell>
                          <Tooltip
                            title={course.syllabiForms?.join(', ')}
                            placement="top-start"
                          >
                            <span>{course.syllabiForms?.join(', ')}</span>
                          </Tooltip>
                        </TruncatedCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </form>
    </Paper>
  )
}

export default SyllabiRequestVouchingForm
