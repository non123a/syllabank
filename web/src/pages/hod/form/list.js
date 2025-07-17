import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  styled,
  Tooltip,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import axios from 'src/utils/axios'
import { fAcademicYear, fDate } from 'src/utils/formatTime'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import Scrollbar from 'src/components/Scrollbar'
import {
  TableEmptyRows,
  TableNoData,
  TablePagination
} from 'src/components/table'
import useSettings from 'src/hooks/useSettings'
import useTable from 'src/hooks/useTable'
import { PATH_DASHBOARD } from 'src/routes/paths'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
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

export default function SyllabiRequestList() {
  const { themeStretch } = useSettings()
  const [filterStatus, setFilterStatus] = useState('pending')
  const [selectedForm, setSelectedForm] = useState(null)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [openApproveDialog, setOpenApproveDialog] = useState(false)
  const [openRejectDialog, setOpenRejectDialog] = useState(false)
  const [feedback, setFeedback] = useState('')

  const {
    dense,
    page,
    rowsPerPage,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage
  } = useTable()

  const {
    data: syllabiForms,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery(
    ['syllabi-request-forms', filterStatus, page, rowsPerPage],
    () =>
      axios.get('/me/syllabi-request-forms', {
        params: {
          status: filterStatus,
          'page[number]': page + 1,
          'page[size]': rowsPerPage
        }
      }),
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error('Error fetching syllabi request forms:', error)
      }
    }
  )

  console.log(syllabiForms?.data?.total)

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value)
  }

  const handleViewDetails = (form) => {
    setSelectedForm(form)
    setOpenViewDialog(true)
  }

  const handleApprove = (form) => {
    setSelectedForm(form)
    setOpenApproveDialog(true)
  }

  const handleReject = (form) => {
    setSelectedForm(form)
    setOpenRejectDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenViewDialog(false)
    setOpenApproveDialog(false)
    setOpenRejectDialog(false)
    setSelectedForm(null)
    setFeedback('')
  }

  const handleSubmitApprove = async () => {
    try {
      await axios.put(`/syllabus/${selectedForm.id}/approve`, {
        feedback
      })
      refetch()
      handleCloseDialog()
    } catch (error) {
      console.error('Error approving form:', error)
    }
  }

  const handleSubmitReject = async () => {
    try {
      await axios.put(`/syllabus/${selectedForm.id}/reject`, {
        feedback
      })
      refetch()
      handleCloseDialog()
    } catch (error) {
      console.error('Error rejecting form:', error)
    }
  }

  const renderStatusChip = (status) => {
    let color = 'default'
    switch (status) {
      case 'pending':
        color = 'warning'
        break
      case 'approved':
        color = 'success'
        break
      case 'rejected':
        color = 'error'
        break
    }
    return <Chip label={status} color={color} size="small" />
  }

  return (
    <Page title="Syllabi Request List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Syllabi Request List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.home },
            { name: 'Syllabi Request List' }
          ]}
        />
        <Paper elevation={3} sx={{ p: 3 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Academic Year</StyledTableCell>
                    <StyledTableCell>Semester</StyledTableCell>
                    <StyledTableCell>Requester</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : syllabiForms?.data?.data?.length > 0 ? (
                    syllabiForms.data.data.map((form) => (
                      <StyledTableRow key={form.id}>
                        <TableCell>
                          {fAcademicYear(
                            form.academic_year.start_date,
                            form.academic_year.end_date
                          )}
                        </TableCell>
                        <TableCell>
                          Semester {form.semester.semester_number}
                        </TableCell>
                        <TableCell>
                          {form.requester.name} (
                          {form.requester.identification_number})
                        </TableCell>
                        <TableCell>{renderStatusChip(form.status)}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleViewDetails(form)}
                            size="small"
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={syllabiForms?.data?.total || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => onChangePage(newPage)}
            onRowsPerPageChange={onChangeRowsPerPage}
          /> */}
        </Paper>
      </Container>

      <Dialog
        open={openViewDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" color="primary" gutterBottom>
            Syllabi Request Form Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedForm && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Submitted by: {selectedForm.requester.name} (
                {selectedForm.requester.identification_number})
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Submitted on: {fDate(selectedForm.created_at)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Status: {selectedForm.status}
              </Typography>
              {JSON.parse(selectedForm.forms).map((form, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      {fAcademicYear(
                        form.academicYear.start_date,
                        form.academicYear.end_date
                      )}{' '}
                      - Semester {form.semester.semester_number}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Course</StyledTableCell>
                            <StyledTableCell>Lecturer(s)</StyledTableCell>
                            <StyledTableCell>Sections</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {form.courses.map((course, courseIndex) => (
                            <TableRow key={courseIndex}>
                              <TableCell>{course.syllabus_name}</TableCell>
                              <TableCell>{course.instructors}</TableCell>
                              <TableCell>
                                {JSON.parse(course.sections).join(', ')}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))}
              {selectedForm.description && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Description:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedForm.description}
                  </Typography>
                </Box>
              )}
              {selectedForm.feedback && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Feedback:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedForm.feedback}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedForm?.status === 'pending' && (
            <>
              <Button
                onClick={() => {
                  handleCloseDialog()
                  handleReject(selectedForm)
                }}
                color="error"
                variant="contained"
              >
                Reject
              </Button>
              <Button
                onClick={() => {
                  handleCloseDialog()
                  handleApprove(selectedForm)
                }}
                color="success"
                variant="contained"
              >
                Approve
              </Button>
            </>
          )}
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openApproveDialog} onClose={handleCloseDialog}>
        <DialogTitle>Approve Syllabi Request</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitApprove}
            color="success"
            variant="contained"
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRejectDialog} onClose={handleCloseDialog}>
        <DialogTitle>Reject Syllabi Request</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitReject}
            color="error"
            variant="contained"
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  )
}
