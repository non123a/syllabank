import React, { useState } from 'react'
import {
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material'
import { fDate } from 'src/utils/formatTime'
import VisibilityIcon from '@mui/icons-material/Visibility'
import HistoryIcon from '@mui/icons-material/History'
import SyllabiRequestTimeline from '../SyllabiRequestTimeline'
import SyllabiRequestApprovalForm from './SyllabiSubmissionApprovalForm'

export default function SyllabiSubmissionApprovalDialog({
  row,
  onApprove,
  onReject
}) {
  // Fake data to replace the undefined student
  const fakeStudent = {
    username: 'johndoe',
    email: 'johndoe@example.com',
    studentId: 'S12345',
    department: 'Computer Science',
    enrollmentYear: 2021
  }

  // Fake course data for the syllabi request
  const fakeCourses = [
    {
      id: 1,
      code: 'CS101',
      name: 'Introduction to Programming',
      credits: 3,
      status: 'Pending'
    },
    {
      id: 2,
      code: 'CS201',
      name: 'Data Structures and Algorithms',
      credits: 4,
      status: 'Pending'
    },
    {
      id: 3,
      code: 'CS301',
      name: 'Database Systems',
      credits: 3,
      status: 'Pending'
    }
  ]

  const {
    id,
    academicYear,
    semester,
    courses = fakeCourses, // Use fake course data if courses is undefined
    status,
    submissionDate,
    student = fakeStudent // Use fake data if student is undefined
  } = row
  const [openTimeline, setOpenTimeline] = useState(false)
  const [openDetails, setOpenDetails] = useState(false)
  const [feedback, setFeedback] = useState('')

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success'
      case 'pending':
        return 'warning'
      case 'rejected':
        return 'error'
      default:
        return 'default'
    }
  }

  const handleOpenTimeline = () => setOpenTimeline(true)
  const handleCloseTimeline = () => setOpenTimeline(false)
  const handleOpenDetails = () => setOpenDetails(true)
  const handleCloseDetails = () => {
    setOpenDetails(false)
    setFeedback('')
  }

  const handleApprove = () => {
    if (feedback.trim()) {
      onApprove(id, feedback)
      handleCloseDetails()
    }
  }

  const handleReject = () => {
    if (feedback.trim()) {
      onReject(id, feedback)
      handleCloseDetails()
    }
  }

  return (
    <TableRow hover>
      <TableCell>{student.username}</TableCell>
      <TableCell>{student.email}</TableCell>
      <TableCell>{student.studentId}</TableCell>
      <TableCell>{student.department}</TableCell>
      <TableCell>{student.enrollmentYear}</TableCell>
      <TableCell>
        <Chip label={status} color={getStatusColor(status)} size="small" />
      </TableCell>
      <TableCell align="center">
        <Tooltip title="View Details">
          <IconButton onClick={handleOpenDetails}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="View Timeline">
          <IconButton onClick={handleOpenTimeline}>
            <HistoryIcon />
          </IconButton>
        </Tooltip>
      </TableCell>

      <Dialog
        open={openTimeline}
        onClose={handleCloseTimeline}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Timeline</DialogTitle>
        <DialogContent>
          <SyllabiRequestTimeline
            requestId={id}
            onClose={handleCloseTimeline}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTimeline}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDetails}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle variant="h5" gutterBottom color="primary">
          Syllabi Request Details - {student.username}
        </DialogTitle>
        <DialogContent>
          <SyllabiRequestApprovalForm
            academicYear={academicYear}
            semester={semester}
            courses={courses}
            readOnly
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            error={!feedback.trim()}
            helperText={!feedback.trim() ? 'Feedback is required' : ''}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Cancel</Button>
          <Button
            onClick={handleReject}
            color="error"
            disabled={!feedback.trim()}
          >
            Reject
          </Button>
          <Button
            onClick={handleApprove}
            color="primary"
            disabled={!feedback.trim()}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  )
}
