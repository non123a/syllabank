import React, { useState } from 'react'
import {
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Tooltip,
  Modal,
  Box,
  Typography
} from '@mui/material'
import { fDate } from 'src/utils/formatTime'
import VisibilityIcon from '@mui/icons-material/Visibility'
import GetAppIcon from '@mui/icons-material/GetApp'
import HistoryIcon from '@mui/icons-material/History'
import SyllabiRequestTimeline from './SyllabiRequestTimeline'

export default function SyllabiRequestTableRow({ row }) {
  const { id, academicYear, semester, courses, status, submissionDate } = row
  const [openTimeline, setOpenTimeline] = useState(false)

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

  return (
    <TableRow hover>
      <TableCell>{id}</TableCell>
      <TableCell>{academicYear}</TableCell>
      <TableCell>{semester}</TableCell>
      <TableCell>{courses.join(', ')}</TableCell>
      <TableCell>
        <Chip label={status} color={getStatusColor(status)} size="small" />
      </TableCell>
      <TableCell>{fDate(submissionDate)}</TableCell>
      <TableCell align="center">
        <Tooltip title="View Details">
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        {status.toLowerCase() === 'approved' && (
          <Tooltip title="Download Syllabus">
            <IconButton>
              <GetAppIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="View Timeline">
          <IconButton onClick={handleOpenTimeline}>
            <HistoryIcon />
          </IconButton>
        </Tooltip>
      </TableCell>

      <Modal
        open={openTimeline}
        onClose={handleCloseTimeline}
        aria-labelledby="timeline-modal-title"
        aria-describedby="timeline-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4
          }}
        >
          <SyllabiRequestTimeline
            requestId={id}
            onClose={handleCloseTimeline}
          />
        </Box>
      </Modal>
    </TableRow>
  )
}
