import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'src/utils/axios'
import {
  Box,
  Card,
  Table,
  Switch,
  Button,
  Divider,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  FormControlLabel,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Paper,
  Typography
} from '@mui/material'
import { PATH_DASHBOARD } from 'src/routes/paths'
import useSettings from 'src/hooks/useSettings'
import useTable from 'src/hooks/useTable'
import Layout from 'src/layouts'
import Page from 'src/components/Page'
import Scrollbar from 'src/components/Scrollbar'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData
} from 'src/components/table'
import SyllabiRequestVouchingTableToolbar from 'src/sections/@dashboard/syllabus/hod-request-approval/SyllabiRequestVouchingTableToolbar'
import SyllabiRequestTimeline from 'src/sections/@dashboard/syllabus/SyllabiRequestTimeline'
import {
  getMySyllabi,
  approveSyllabus,
  rejectSyllabus
} from 'src/apis/syllabus'
import { useSnackbar } from 'notistack'
import useDebouncedState from 'src/hooks/useDebounceState'
import SyllabiRequestVouchingTableRow from 'src/sections/@dashboard/syllabus/hod-request-approval/SyllabiRequestVouchingTableRow'

const TABLE_HEAD = [
  {
    id: 'author_name',
    label: 'Instructor Name',
    align: 'left'
  },
  { id: 'syllabus_name', label: 'Syllabus Name', align: 'left' },
  { id: 'academic_period', label: 'Academic Period', align: 'left' },
  { id: 'sections', label: 'Sections', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'center' }
]

SyllabiRequestAcceptance.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default function SyllabiRequestAcceptance() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [filterName, setFilterName] = useDebouncedState('', 500)
  const [filterStatus, setFilterStatus] = useState('all')
  const { themeStretch } = useSettings()
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [feedback, setFeedback] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const [pdfPreview, setPdfPreview] = useState(null)
  const [openApproveDialog, setOpenApproveDialog] = useState(false)
  const [openRejectDialog, setOpenRejectDialog] = useState(false)
  const [comment, setComment] = useState('')

  const {
    dense,
    page,
    rowsPerPage,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage
  } = useTable({
    defaultDense: true,
    defaultRowsPerPage: 5
  })

  const {
    data: syllabiRequestsQuery,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['syllabi-requests', page, rowsPerPage, filterName, filterStatus],
    queryFn: () =>
      getMySyllabi(
        {
          search: filterName,
          status: filterStatus !== 'all' ? filterStatus : undefined
        },
        {
          page: page + 1,
          rowsPerPage
        }
      ),
    keepPreviousData: true
  })

  useEffect(() => {
    refetch()
  }, [page, rowsPerPage, filterName, filterStatus])

  const handleOnFilterName = (value) => {
    setFilterName(value || '')
  }

  const handleOnFilterStatus = (event) => {
    setFilterStatus(event.target.value)
  }

  const handleViewDetails = (request) => {
    router.push(`/provost/${request.id}/preview`)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedRequest(null)
    setFeedback('')
    setPdfPreview(null)
  }

  const handleOpenApproveDialog = (request) => {
    setSelectedRequest(request)
    setOpenApproveDialog(true)
  }

  const handleOpenRejectDialog = (request) => {
    setSelectedRequest(request)
    setOpenRejectDialog(true)
  }

  const handleCloseApproveDialog = () => {
    setOpenApproveDialog(false)
    setSelectedRequest(null)
    setComment('')
  }

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false)
    setSelectedRequest(null)
    setComment('')
  }

  const addComment = async (syllabusId, commentContent, status) => {
    try {
      const response = await axios.post(`/syllabus/${syllabusId}/add-comment`, {
        content: commentContent,
        eventId: status
      })
      if (response.data && response.data.status_timeline) {
        enqueueSnackbar('Comment added successfully', { variant: 'success' })
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      enqueueSnackbar('Failed to add comment', { variant: 'error' })
    }
  }

  const approveSyllabus = async (id) => {
    try {
      const response = await axios.post('syllabus/submit', { id })
      if (response.status === 200) {
        enqueueSnackbar('Syllabus submitted successfully', {
          variant: 'success'
        })
        refetch()
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      console.error('Error submitting syllabus:', error)
      enqueueSnackbar('Failed to submit syllabus', { variant: 'error' })
    }
  }

  const handleApprove = async () => {
    if (!comment.trim()) {
      enqueueSnackbar('Comment is required', { variant: 'error' })
      return
    }
    try {
      await addComment(selectedRequest.id, comment, selectedRequest.status)
      await approveSyllabus(selectedRequest.id)
      handleCloseApproveDialog()
      refetch()
    } catch (error) {
      enqueueSnackbar('Failed to approve syllabus', { variant: 'error' })
    }
  }

  const rejectSyllabus = async (id) => {
    try {
      const response = await axios.post('syllabus/reject', { id })
      if (response.status === 200) {
        enqueueSnackbar('Syllabus rejected successfully', {
          variant: 'success'
        })
        refetch()
      } else {
        throw new Error('Rejection failed')
      }
    } catch (error) {
      console.error('Error rejecting syllabus:', error)
      enqueueSnackbar('Failed to reject syllabus', { variant: 'error' })
    }
  }

  const handleReject = async () => {
    if (!comment.trim()) {
      enqueueSnackbar('Comment is required', { variant: 'error' })
      return
    }
    try {
      await addComment(selectedRequest.id, comment, 'rejected')
      await rejectSyllabus(selectedRequest.id, 'rejected')
      enqueueSnackbar('Syllabus rejected successfully', { variant: 'success' })
      handleCloseRejectDialog()
      refetch()
    } catch (error) {
      enqueueSnackbar('Failed to reject syllabus', { variant: 'error' })
    }
  }

  const syllabi = syllabiRequestsQuery?.data?.data || []
  const total = syllabiRequestsQuery?.data?.meta?.total || 0
  const isNotFound = !isFetching && syllabi.length === 0

  return (
    <Page title="Syllabi Requests">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Syllabi Requests"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Provost', href: PATH_DASHBOARD.provost.syllabiRequests },
            { name: 'Syllabi Request Approval' }
          ]}
        />
        <Card>
          <Divider />
          <SyllabiRequestVouchingTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleOnFilterName}
            onFilterStatus={handleOnFilterStatus}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {syllabi.map((row) => (
                    <SyllabiRequestVouchingTableRow
                      key={row.id}
                      row={row}
                      onViewDetails={() => handleViewDetails(row)}
                      onOpenApproveDialog={() => handleOpenApproveDialog(row)}
                      onOpenRejectDialog={() => handleOpenRejectDialog(row)}
                    />
                  ))}
                  <TableEmptyRows
                    height={dense ? 52 : 72}
                    emptyRows={Math.max(0, rowsPerPage - syllabi.length)}
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
              page={page}
              onPageChange={(event, newPage) => onChangePage(newPage)}
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
              {isFetching && <CircularProgress size="1rem" />}
            </Box>
          </Box>
        </Card>
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>Syllabi Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={3}
                  sx={{
                    height: 'calc(100vh - 300px)',
                    padding: 2,
                    overflow: 'auto'
                  }}
                >
                  {pdfPreview ? (
                    <embed
                      src={pdfPreview}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                    />
                  ) : (
                    <Typography>Loading preview...</Typography>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={3}
                  sx={{
                    height: 'calc(100vh - 300px)',
                    padding: 2,
                    overflow: 'auto'
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Request Timeline
                  </Typography>
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
                </Paper>
              </Grid>
            </Grid>
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

      <Dialog
        open={openApproveDialog}
        onClose={handleCloseApproveDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Approve Syllabus</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            error={!comment.trim()}
            helperText={!comment.trim() ? 'Comment is required' : ''}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApproveDialog}>Cancel</Button>
          <Button onClick={handleApprove} color="primary">
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRejectDialog}
        onClose={handleCloseRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Syllabus</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            error={!comment.trim()}
            helperText={!comment.trim() ? 'Comment is required' : ''}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog}>Cancel</Button>
          <Button onClick={handleReject} color="error">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  )
}
