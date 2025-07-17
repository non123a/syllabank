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
  Box,
  Label
} from '@mui/material'
import { fDate } from 'src/utils/formatTime'
import VisibilityIcon from '@mui/icons-material/Visibility'
import HistoryIcon from '@mui/icons-material/History'
import SyllabiRequestTimeline from '../SyllabiRequestTimeline'
import SyllabiRequestVouchingForm from './SyllabiRequestVouchingForm'

export default function SyllabiRequestVouchingDialog({
  row,
  onViewDetails,
  onApprove,
  onReject
}) {
  const { id, course, syllabus_name, sections, status, is_file_upload } = row

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success'
      case 'submit_to_head_of_department':
        return 'warning'
      case 'rejected':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <TableRow hover>
      <TableCell>{syllabus_name}</TableCell>
      <TableCell>{`${course.subject} ${course.code} - ${course.name}`}</TableCell>
      <TableCell>{JSON.parse(sections).join(', ')}</TableCell>
      <TableCell>
        <Label color={getStatusColor(status)}>
          {status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </Label>
      </TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => onViewDetails(row)}
          sx={{ mr: 1 }}
        >
          View Details
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => onApprove(id)}
          sx={{ mr: 1 }}
        >
          Approve
        </Button>
        <Button variant="contained" color="error" onClick={() => onReject(id)}>
          Reject
        </Button>
      </TableCell>
    </TableRow>
  )
}
