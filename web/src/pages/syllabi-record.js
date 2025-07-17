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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
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
import { TableNoData } from 'src/components/table'
import useSettings from 'src/hooks/useSettings'
import useTable from 'src/hooks/useTable'
import { PATH_DASHBOARD } from 'src/routes/paths'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DownloadIcon from '@mui/icons-material/Download'

export default function SyllabiRequestList() {
  const { themeStretch } = useSettings()
  const [selectedForm, setSelectedForm] = useState(null)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [openPdfDialog, setOpenPdfDialog] = useState(false)

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
    error
  } = useQuery(
    ['syllabi-request-forms', page, rowsPerPage],
    () =>
      axios.get('/me/syllabi-request-forms', {
        params: {
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

  const handleViewDetails = (form) => {
    setSelectedForm(form)
    setOpenViewDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenViewDialog(false)
    setSelectedForm(null)
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

  const handleViewSyllabus = async (id) => {
    try {
      const response = await axios.get(`/syllabus/${id}`)
      const { content, pdf_base64 } = response.data

      if (content) {
        const renderResponse = await axios.post('/syllabus/render-custom', {
          content: content
        })

        if (renderResponse.data && renderResponse.data.pdf) {
          setPdfUrl(`data:application/pdf;base64,${renderResponse.data.pdf}`)
        } else {
          console.error('Failed to render PDF')
        }
      } else if (pdf_base64) {
        setPdfUrl(`data:application/pdf;base64,${pdf_base64}`)
      } else {
        console.error('No content or PDF available for this syllabus')
      }

      setOpenPdfDialog(true)
    } catch (error) {
      console.error('Error viewing syllabus:', error)
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
      link.parentNode.removeChild(link)
    } catch (error) {
      console.error('Error downloading syllabus:', error)
    }
  }

  const handleClosePdfDialog = () => {
    setOpenPdfDialog(false)
    setPdfUrl(null)
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
                    <TableCell>Academic Year</TableCell>
                    <TableCell>Semester</TableCell>
                    <TableCell>Requester</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
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
                      <TableRow key={form.id}>
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
                      </TableRow>
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
                            <TableCell>Course</TableCell>
                            <TableCell>Lecturer(s)</TableCell>
                            <TableCell>Sections</TableCell>
                            <TableCell>Actions</TableCell>
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
                              <TableCell>
                                <IconButton
                                  onClick={() => handleViewSyllabus(course.id)}
                                  size="small"
                                  color="primary"
                                  disabled={selectedForm.status !== 'approved'}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() =>
                                    handleDownloadSyllabus(course.id)
                                  }
                                  size="small"
                                  color="secondary"
                                  disabled={selectedForm.status !== 'approved'}
                                >
                                  <DownloadIcon />
                                </IconButton>
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
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPdfDialog}
        onClose={() => setOpenPdfDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Syllabus Preview</DialogTitle>
        <DialogContent>
          {pdfUrl ? (
            <embed
              src={pdfUrl}
              type="application/pdf"
              width="100%"
              height="600px"
              style={{ border: 'none' }}
            />
          ) : (
            <Typography>Loading PDF...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPdfDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Page>
  )
}
