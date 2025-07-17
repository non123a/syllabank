import PropTypes from 'prop-types'
import { useState } from 'react'
import {
  TableRow,
  TableCell,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tooltip,
  Typography,
  TextField
} from '@mui/material'
import Iconify from 'src/components/Iconify'
import { TableMoreMenu } from 'src/components/table'
import Label from 'src/components/Label'
import { fDate, fDateTime, fDateTimeSuffix } from 'src/utils/formatTime'
import SyllabusTimelineModal from 'src/sections/@dashboard/syllabus/SyllabusTimelineModal'
import { useSnackbar } from 'notistack'

SyllabusTableRow.propTypes = {
  row: PropTypes.object,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSubmitSyllabus: PropTypes.func.isRequired,
  onDownloadSyllabus: PropTypes.func,
  refreshData: PropTypes.func
}

export default function SyllabusTableRow({
  row,
  onViewRow,
  onEditRow,
  onSubmitSyllabus,
  onDownloadSyllabus,
  refreshData
}) {
  const { enqueueSnackbar } = useSnackbar()
  const {
    id,
    syllabus_name,
    course,
    sections,
    status,
    updated_at,
    is_file_upload,
    academic_year_start,
    academic_year_end,
    semester_number,
    last_modified_by
  } = row

  const [openMenu, setOpenMenuActions] = useState(null)
  const [openTimelineModal, setOpenTimelineModal] = useState(false)

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null)
  }

  const handleOpenTimeline = () => {
    setOpenTimelineModal(true)
  }

  const handleCloseTimeline = () => {
    setOpenTimelineModal(false)
  }

  const parseSections = (sectionsString) => {
    try {
      return JSON.parse(sectionsString).join(', ')
    } catch (error) {
      console.error('Error parsing sections:', error)
      return 'N/A'
    }
  }

  return (
    <>
      <TableRow hover>
        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {syllabus_name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {academic_year_start && academic_year_end
              ? `${new Date(academic_year_start).getFullYear()} - ${new Date(
                  academic_year_end
                ).getFullYear()}`
              : 'N/A'}
            {semester_number ? ` • Semester ${semester_number}` : ' • N/A'}
          </Typography>
        </TableCell>
        <TableCell align="left">{`${course.subject}${course.code}: ${course.name}`}</TableCell>
        <TableCell align="left">{parseSections(sections)}</TableCell>
        <TableCell align="left">
          <Label
            variant="ghost"
            color={
              (status === 'approved' && 'success') ||
              (status === 'submit_to_head_of_department' && 'primary') ||
              (status === 'vouched_to_dean' && 'secondary') ||
              (status === 'accepted_by_provost' && 'info') ||
              (status === 'draft' && 'default') ||
              (status === 'rejected' && 'error') ||
              'default'
            }
          >
            {status
              .split('_')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </Label>
        </TableCell>
        <TableCell align="left">{fDateTime(updated_at)}</TableCell>
        <TableCell align="left">
          {last_modified_by ? last_modified_by : 'N/A'}
        </TableCell>
        <TableCell align="right">
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                {(status === 'draft' || status === 'rejected') && (
                  <MenuItem onClick={() => onSubmitSyllabus(row.id)}>
                    <Iconify icon={'eva:paper-plane-fill'} />
                    Submit
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    onViewRow()
                    handleCloseMenu()
                  }}
                >
                  <Iconify icon={'eva:eye-fill'} />
                  View
                </MenuItem>
                {(status === 'draft' || status === 'rejected') && (
                  <MenuItem
                    onClick={() => {
                      onEditRow()
                      handleCloseMenu()
                    }}
                  >
                    <Iconify icon={'eva:edit-fill'} />
                    Edit
                  </MenuItem>
                )}
                {status === 'approved' && (
                  <MenuItem
                    onClick={() => {
                      onDownloadSyllabus(id)
                      handleCloseMenu()
                    }}
                  >
                    <Iconify icon={'eva:download-fill'} />
                    Download
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    handleOpenTimeline()
                    handleCloseMenu()
                  }}
                >
                  <Iconify icon={'eva:clock-outline'} />
                  View Timeline
                </MenuItem>
              </>
            }
          />
        </TableCell>
      </TableRow>

      <SyllabusTimelineModal
        open={openTimelineModal}
        onClose={handleCloseTimeline}
        syllabus={row}
        onCommentAdded={refreshData}
      />
    </>
  )
}
