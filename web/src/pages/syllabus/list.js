import { useState, useEffect } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
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
  DialogContentText,
  Typography
} from '@mui/material'
import { PATH_DASHBOARD } from 'src/routes/paths'
import useSettings from 'src/hooks/useSettings'
import useTable from 'src/hooks/useTable'
import Layout from 'src/layouts'
import Page from 'src/components/Page'
import Iconify from 'src/components/Iconify'
import Scrollbar from 'src/components/Scrollbar'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData
} from 'src/components/table'
import SyllabusTableToolbar from 'src/sections/@dashboard/syllabus/SyllabusTableToolbar'
import SyllabusTableRow from 'src/sections/@dashboard/syllabus/SyllabusTableRow'
import axios from 'src/utils/axios'
import { getMySyllabi } from 'src/apis/syllabus'
import { useSnackbar } from 'notistack'
import { RHFUploadSingleFile } from 'src/components/hook-form'
import { LoadingButton } from '@mui/lab'
import { FormProvider, useForm } from 'react-hook-form'

const TABLE_HEAD = [
  { id: 'syllabus_name', label: 'Syllabus Name', align: 'left' },
  { id: 'course', label: 'Course', align: 'left' },
  { id: 'sections', label: 'Sections', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'lastModifiedAt', label: 'Last Modified', align: 'left' },
  { id: 'lastModifiedBy', label: 'Last Modified By', align: 'left' },
  { id: '' }
]

SyllabusList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default function SyllabusList() {
  const {
    dense,
    page,
    rowsPerPage,
    setPage,
    onChangeDense,
    onChangeRowsPerPage
  } = useTable({
    defaultRowsPerPage: 5
  })

  const { themeStretch } = useSettings()
  const { push } = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const [filterName, setFilterName] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false)
  const [selectedSyllabusId, setSelectedSyllabusId] = useState(null)
  const [comment, setComment] = useState('')
  const [openFileUploadDialog, setOpenFileUploadDialog] = useState(false)
  const [pdfFile, setPdfFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const methods = useForm({
    defaultValues: {
      pdfFile: null
    }
  })

  const {
    data: syllabiQuery,
    isSuccess,
    isLoading,
    isFetching,
    isFetched,
    refetch
  } = useQuery({
    queryKey: ['syllabi', page, rowsPerPage, filterName, filterStatus],
    queryFn: async () =>
      await getMySyllabi(
        {
          search: filterName || null,
          status: filterStatus !== 'all' ? filterStatus : undefined
        },
        {
          page: page + 1,
          rowsPerPage
        }
      ),
    keepPreviousData: true
  })

  const syllabi = syllabiQuery?.data?.data
  const total = isFetching ? -1 : syllabiQuery?.data?.meta?.total || 0

  useEffect(() => {
    setPage(0)
  }, [filterName, filterStatus])

  const handleFilterName = (filterName) => {
    setFilterName(filterName)
  }

  const handleFilterStatus = (event) => {
    setFilterStatus(event.target.value)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleViewRow = (id) => {
    push(PATH_DASHBOARD.syllabus.view(id))
  }

  // const handleEditRow = (id) => {
  //   const syllabus = syllabi.find((s) => s.id === id)
  //   console.log('SYLLABUS DATA:', syllabus) // 👈 this line
  //   if (syllabus && syllabus.is_file_upload) {
  //     setSelectedSyllabusId(id)
  //     setOpenFileUploadDialog(true)
  //   } else {
  //     push(`/syllabus/${id}/edit`)
  //     const { course, academic_year_start, academic_year_end, semester_number, sections } = syllabus
  //     const yearRange = `${new Date(academic_year_start).getFullYear()}/${new Date(academic_year_end).getFullYear()}`
  //     push({
  //       pathname: `/syllabus/${id}/edit`,
  //       query: {
  //         courseCode: `${course.subject}${course.code}`,
  //         academicYear: yearRange,
  //         semester: `Semester ${semester_number}`,
  //         sections
  //       }
  //     })
  //   }
  // }
  const handleEditRow = (id) => {
    const syllabus = syllabi.find((s) => s.id === id)
    console.log('SYLLABUS DATA:', syllabus)
    if (syllabus && syllabus.is_file_upload) {
      setSelectedSyllabusId(id)
      setOpenFileUploadDialog(true)
    } else {
      const academicYear = `${syllabus.academic_year_start.slice(0, 4)}/${syllabus.academic_year_end.slice(0, 4)}`
      const syllabusName = syllabus.syllabus_name
      const semester = syllabus.semester_number
      const sections = syllabus.sections
  
      push({
        pathname: `/syllabus/${id}/edit`,
        query: {
          syllabusName,
          academicYear,
          semester,
          sections
        }
      })
    }
  }

  const handleOpenSubmitDialog = (id) => {
    setSelectedSyllabusId(id)
    setOpenSubmitDialog(true)
  }

  const handleCloseSubmitDialog = () => {
    setOpenSubmitDialog(false)
    setSelectedSyllabusId(null)
    setComment('')
  }

  const addComment = async (syllabusId, commentContent, status) => {
    const response = await axios.post(`/syllabus/${syllabusId}/add-comment`, {
      content: commentContent,
      eventId: status
    })
    if (!response.data || !response.data.status_timeline) {
      throw new Error('Failed to add comment')
    }
  }

  const submitSyllabus = async (id) => {
    const response = await axios.post('syllabus/submit', { id })
    if (response.status !== 200) {
      throw new Error('Submission failed')
    }
  }

  const handleSubmitSyllabus = async () => {
    if (!comment.trim()) {
      enqueueSnackbar('Comment is required', { variant: 'error' })
      return
    }

    if (isSubmitting) return // Prevent multiple submissions

    setIsSubmitting(true)
    try {
      await submitSyllabus(selectedSyllabusId)
      await addComment(
        selectedSyllabusId,
        comment,
        'submit_to_head_of_department'
      )
      enqueueSnackbar('Syllabus submitted successfully', { variant: 'success' })
      handleCloseSubmitDialog()
      setComment('')
      refetch()
    } catch (error) {
      enqueueSnackbar('Failed to submit syllabus', { variant: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownloadSyllabus = async (id) => {
    try {
      const response = await axios.get(
        `/syllabus/download-with-watermark/${id}`,
        {
          responseType: 'blob'
        }
      )
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `syllabus_${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error downloading syllabus:', error)
      enqueueSnackbar('Failed to download syllabus', { variant: 'error' })
    }
  }

  const denseHeight = dense ? 52 : 72

  const isNotFound = !total && !!filterName

  const handleUpdatePdf = async () => {
    if (!pdfFile || !selectedSyllabusId) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('pdfFile', pdfFile)

      const response = await axios.post(
        `/syllabus/save-file-upload/${selectedSyllabusId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      console.log('Server response:', response.data)
      enqueueSnackbar('Syllabus PDF updated successfully', {
        variant: 'success'
      })
      setOpenFileUploadDialog(false)
      setPdfFile(null)
      refetch()
    } catch (error) {
      console.error(
        'Error updating syllabus PDF:',
        error.response?.data || error.message
      )
      enqueueSnackbar(
        'Failed to update syllabus PDF: ' +
          (error.response?.data?.message || error.message),
        { variant: 'error' }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Page title="Syllabus: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Syllabus List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Syllabus Listing' }
          ]}
          action={
            <NextLink href={PATH_DASHBOARD.syllabus.new} passHref>
              <Button
                variant="contained"
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                New Syllabus
              </Button>
            </NextLink>
          }
        />

        <Card>
          <Divider />

          <SyllabusTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {syllabi?.map((row) => (
                    <SyllabusTableRow
                      key={row.id}
                      row={row}
                      onViewRow={() => handleViewRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onSubmitSyllabus={() => handleOpenSubmitDialog(row.id)}
                      onDownloadSyllabus={() => handleDownloadSyllabus(row.id)}
                      refreshData={refetch}
                    />
                  ))}
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={Math.max(0, rowsPerPage - syllabi?.length)}
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
              onPageChange={handleChangePage}
              onRowsPerPageChange={(event) => {
                onChangeRowsPerPage(event)
              }}
              disabled={isLoading}
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
        open={openSubmitDialog}
        onClose={handleCloseSubmitDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Submit Syllabus</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a comment before submitting this syllabus. This
            action cannot be undone.
          </DialogContentText>
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
          <Button onClick={handleCloseSubmitDialog}>Cancel</Button>
          <LoadingButton
            onClick={handleSubmitSyllabus}
            loading={isSubmitting}
            color="primary"
            disabled={!comment.trim() || isSubmitting}
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openFileUploadDialog}
        onClose={() => setOpenFileUploadDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Syllabus PDF</DialogTitle>
        <FormProvider {...methods}>
          <DialogContent>
            <DialogContentText>
              Please upload the new PDF file for this syllabus.
            </DialogContentText>
            <RHFUploadSingleFile
              name="pdfFile"
              accept="application/pdf"
              maxSize={10485760} // 10MB
              onDrop={(acceptedFiles) => {
                const file = acceptedFiles[0]
                if (file) {
                  methods.setValue('pdfFile', file)
                  setPdfFile(file)
                }
              }}
            />
            {pdfFile && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Selected file: {pdfFile.name}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenFileUploadDialog(false)}>
              Cancel
            </Button>
            <LoadingButton
              onClick={handleUpdatePdf}
              loading={isSubmitting}
              disabled={!pdfFile}
            >
              Upload
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </Page>
  )
}
