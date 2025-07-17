import React from 'react'
import { TableRow, TableCell, Button, Stack, Typography } from '@mui/material'
import Label from 'src/components/Label'
import Iconify from 'src/components/Iconify'

export default function SyllabiRequestVouchingTableRow({
  row,
  onViewDetails,
  onOpenApproveDialog,
  onOpenRejectDialog
}) {
  const {
    id,
    author_name,
    author_identification,
    syllabus_name,
    course,
    sections,
    status,
    academic_year_start,
    academic_year_end,
    semester_number
  } = row

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success'
      case 'submit_to_head_of_department':
        return 'primary'
      case 'vouched_to_dean':
        return 'secondary'
      case 'accepted_by_provost':
        return 'info'
      case 'draft':
        return 'default'
      case 'rejected':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status) => {
    switch (status.toLowerCase()) {
      case 'submit_to_head_of_department':
        return 'Pending for Vouching'
      case 'vouched_to_dean':
        return 'Pending for Dean Approval'
      case 'accepted_by_provost':
        return 'Pending for Provost Acceptance'
      default:
        return status.replace(/_/g, ' ').toLowerCase()
    }
  }

  return (
    <TableRow hover>
      <TableCell>
        {' '}
        <Typography variant="subtitle2" noWrap>
          {author_name}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
          {author_identification}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {syllabus_name}
        </Typography>
      </TableCell>
      {/* <TableCell>
        <Typography variant="body2" noWrap>
          {course.subject} {course.code}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
          {course.name}
        </Typography>
      </TableCell> */}
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {academic_year_start && academic_year_end
            ? `${new Date(academic_year_start).getFullYear()} - ${new Date(
                academic_year_end
              ).getFullYear()}`
            : 'N/A'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {semester_number ? `Semester ${semester_number}` : 'N/A'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" noWrap>
          {Array.isArray(sections)
            ? sections.join(', ')
            : JSON.parse(sections).join(', ')}
        </Typography>
      </TableCell>
      <TableCell>
        <Label
          variant="filled"
          color={getStatusColor(status)}
          sx={{ textTransform: 'capitalize' }}
        >
          {getStatusLabel(status)}
        </Label>
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            size="small"
            color="info"
            variant="outlined"
            onClick={() => onViewDetails(row)}
            startIcon={<Iconify icon="eva:eye-fill" />}
          >
            View
          </Button>
          <Button
            size="small"
            color="success"
            variant="contained"
            onClick={() => onOpenApproveDialog(row)}
            startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          >
            Approve
          </Button>
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={() => onOpenRejectDialog(row)}
            startIcon={<Iconify icon="eva:close-circle-fill" />}
          >
            Reject
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  )
}
