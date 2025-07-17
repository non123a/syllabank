import {
  Box,
  Card,
  CircularProgress,
  Container,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import Scrollbar from 'src/components/Scrollbar'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData
} from 'src/components/table'
import useDebouncedState from 'src/hooks/useDebounceState'
import useTable from 'src/hooks/useTable'
import Layout from 'src/layouts'
import { PATH_DASHBOARD } from 'src/routes/paths'
import useSettings from 'src/hooks/useSettings'
import SyllabiRequestTimeline from 'src/sections/@dashboard/syllabus/SyllabiRequestTimeline'
import SyllabiRequestTableToolbar from 'src/sections/@dashboard/syllabus/hod-request-approval/SyllabiRequestVouchingTableToolbar'
import SyllabiRequestApprovalDialog from 'src/sections/@dashboard/syllabus/hod-request-approval/SyllabiRequestVouchingDialog'
import SyllabiRequestApprovalForm from 'src/sections/@dashboard/syllabus/hod-request-approval/SyllabiRequestVouchingForm'

SyllabiRequestApproval.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default function SyllabiRequestApproval() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [filterName, setFilterName] = useDebouncedState('', 500)
  const [filterStatus, setFilterStatus] = useState('all')
  const { themeStretch } = useSettings()
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [feedback, setFeedback] = useState('')

  const {
    dense,
    page,
    rowsPerPage,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage
  } = useTable({
    defaultDense: true
  })

  // Fake data to replace useSyllabiRequest
  const syllabiRequestsQuery = {
    data: {
      data: {
        data: [
          {
            id: 1,
            username: 'student1',
            email: 'student1@example.com',
            studentId: 'S001',
            department: 'Computer Science',
            enrollmentYear: 2021,
            status: 'Pending',
            academicYear: '2023-2024',
            semester: 'Fall',
            syllabi: [
              {
                id: 1,
                course: 'Introduction to Programming',
                status: 'Pending'
              },
              { id: 2, course: 'Data Structures', status: 'Pending' }
            ]
          },
          {
            id: 2,
            username: 'student2',
            email: 'student2@example.com',
            studentId: 'S002',
            department: 'Mathematics',
            enrollmentYear: 2022,
            status: 'Approved',
            academicYear: '2023-2024',
            semester: 'Spring',
            syllabi: [
              { id: 3, course: 'Calculus I', status: 'Approved' },
              { id: 4, course: 'Linear Algebra', status: 'Approved' }
            ]
          }
        ],
        total: 2
      }
    },
    isFetching: false,
    isFetched: true
  }

  const handleOnFilterName = (event) => {
    setFilterName(event.target.value)
  }

  const handleOnFilterStatus = (event) => {
    setFilterStatus(event.target.value)
  }

  const handleViewDetails = (request) => {
    setSelectedRequest(request)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedRequest(null)
    setFeedback('')
  }

  const handleApprove = async () => {
    if (!feedback.trim()) {
      return
    }
    handleCloseDialog()
  }

  const handleReject = async () => {
    if (!feedback.trim()) {
      return
    }
    handleCloseDialog()
  }

  const dataCount = syllabiRequestsQuery.data?.data?.data?.length || 0
  const isNotFound = dataCount === 0 && syllabiRequestsQuery.isFetched
  const total = syllabiRequestsQuery.isFetching
    ? 0
    : syllabiRequestsQuery?.data?.data.total || 0
  const denseHeight = dense ? 52 : 72

  return (
    <Page title="Syllabi Requests">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Syllabi Requests"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root
            },
            { name: 'Syllabi Requests' }
          ]}
        />
        <Card>
          <SyllabiRequestTableToolbar
            onFilterName={handleOnFilterName}
            onFilterStatus={handleOnFilterStatus}
            filterStatus={filterStatus}
          />
          <Scrollbar>
            <TableContainer
              sx={{ minWidth: (theme) => theme.breakpoints.values.sm }}
            >
              <Table>
                <TableHeadCustom
                  headLabel={[
                    { id: 'username', label: 'Username' },
                    { id: 'email', label: 'Email' },
                    { id: 'studentId', label: 'Student ID' },
                    { id: 'department', label: 'Department' },
                    { id: 'enrollmentYear', label: 'Enrollment Year' },
                    { id: 'status', label: 'Status' },
                    { id: 'actions', label: 'Actions' }
                  ]}
                />
                <TableBody>
                  {syllabiRequestsQuery.data?.data?.data.map((row) => (
                    <SyllabiRequestApprovalDialog
                      key={row.id}
                      row={row}
                      onViewDetails={() => handleViewDetails(row)}
                    />
                  ))}
                  <TableEmptyRows
                    emptyRows={dataCount > 0 ? rowsPerPage - dataCount : 0}
                    height={denseHeight}
                  />
                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={syllabiRequestsQuery.isFetching ? 0 : page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
            <Box
              sx={{
                px: 3,
                py: 1.5,
                top: 0,
                position: { md: 'absolute' },
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: {
                  xs: 'space-between',
                  md: 'flex-start'
                }
              }}
            >
              <FormControlLabel
                control={<Switch checked={dense} onChange={onChangeDense} />}
                label="Dense"
              />
              {syllabiRequestsQuery.isFetching && (
                <CircularProgress size="1rem" />
              )}
            </Box>
          </Box>
        </Card>
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Syllabi Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Syllabi Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {selectedRequest.syllabi.map((syllabus) => (
                    <SyllabiRequestApprovalForm
                      key={syllabus.id}
                      academicYear={selectedRequest.academicYear}
                      semester={selectedRequest.semester}
                      course={syllabus.course}
                      readOnly
                    />
                  ))}
                </AccordionDetails>
              </Accordion>
              <SyllabiRequestTimeline requestId={selectedRequest.id} />
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
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleReject} color="error">
            Reject
          </Button>
          <Button onClick={handleApprove} color="primary">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  )
}
