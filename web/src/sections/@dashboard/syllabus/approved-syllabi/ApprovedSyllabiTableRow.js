import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  TableRow,
  TableCell,
  MenuItem,
  IconButton,
  Typography
} from '@mui/material'
import Iconify from 'src/components/Iconify'
import { TableMoreMenu } from 'src/components/table'
import Label from 'src/components/Label'

ApprovedSyllabiTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  onViewDetails: PropTypes.func,
  onViewTimeline: PropTypes.func,
  onDownloadSyllabus: PropTypes.func
}

export default function ApprovedSyllabiTableRow({
  row,
  onViewDetails,
  onViewTimeline,
  onDownloadSyllabus
}) {
  const { author_name, syllabus_name, course, sections, status } = row
  const [openMenu, setOpenMenu] = useState(null)

  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenu(null)
  }

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
      <TableCell align="left">
        <Typography
          variant="body2"
          sx={{
            maxWidth: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {author_name}
        </Typography>
      </TableCell>
      <TableCell align="left">{syllabus_name}</TableCell>
      <TableCell align="left">{`${course.subject} ${course.code}: ${course.name}`}</TableCell>
      <TableCell align="left">
        <Typography
          variant="body2"
          sx={{
            maxWidth: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {Array.isArray(sections)
            ? sections.join(', ')
            : typeof sections === 'string'
            ? JSON.parse(sections).join(', ')
            : sections}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Label
          variant="ghost"
          color={getStatusColor(status)}
          sx={{ textTransform: 'capitalize' }}
        >
          {status.replace(/_/g, ' ')}
        </Label>
      </TableCell>
      <TableCell align="center">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onViewDetails(row)
                  handleCloseMenu()
                }}
              >
                <Iconify icon={'eva:eye-fill'} />
                View Details
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onViewTimeline(row.id)
                  handleCloseMenu()
                }}
              >
                <Iconify icon={'eva:clock-outline'} />
                View Timeline
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDownloadSyllabus(row.id)
                  handleCloseMenu()
                }}
              >
                <Iconify icon={'eva:download-outline'} />
                Download
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  )
}
