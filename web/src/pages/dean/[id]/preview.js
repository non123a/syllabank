import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  Grid,
  Paper,
  Divider,
  Alert,
  TextField,
  Button
} from '@mui/material'
import Head from 'next/head'
import DashboardLayout from '../../../layouts/dashboard'
import axios from '../../../utils/axios'
import { PATH_DASHBOARD } from '../../../routes/paths'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs'
import SyllabiRequestTimeline from '../../../sections/@dashboard/syllabus/SyllabiRequestTimeline'
import { approveSyllabus, rejectSyllabus } from '../../../apis/syllabus'
import { useSnackbar } from 'notistack'

const SyllabusPreview = () => {
  const [pdfPreview, setPdfPreview] = useState(null)
  const [syllabusName, setSyllabusName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syllabusData, setSyllabusData] = useState(null)
  const [timelineData, setTimelineData] = useState([])
  const router = useRouter()
  const { id } = router.query
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (id) {
      fetchSyllabusAndRender()
    }
  }, [id])

  const fetchSyllabusAndRender = async () => {
    try {
      setLoading(true)
      const syllabusResponse = await axios.get(`/syllabus/${id}`)
      const { syllabus_name, content, pdf_base64, status_timeline } =
        syllabusResponse.data

      setSyllabusName(syllabus_name)
      setSyllabusData(syllabusResponse.data)
      setTimelineData(JSON.parse(status_timeline))

      if (content) {
        const renderResponse = await axios.post('/syllabus/render-custom', {
          content: content
        })

        if (renderResponse.data && renderResponse.data.pdf) {
          setPdfPreview(
            `data:application/pdf;base64,${renderResponse.data.pdf}`
          )
        } else {
          setError('Failed to render PDF. Please check the syllabus content.')
        }
      } else if (pdf_base64) {
        setPdfPreview(`data:application/pdf;base64,${pdf_base64}`)
      } else {
        setError('No content or PDF available for this syllabus.')
      }
    } catch (error) {
      setError('Failed to fetch syllabus details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!feedback.trim()) {
      enqueueSnackbar('Feedback is required', { variant: 'error' })
      return
    }
    try {
      await approveSyllabus(id, feedback)
      enqueueSnackbar('Syllabus approved successfully', { variant: 'success' })
      router.push(PATH_DASHBOARD.hod.syllabusRequests)
    } catch (error) {
      enqueueSnackbar('Failed to approve syllabus', { variant: 'error' })
    }
  }

  const handleReject = async () => {
    if (!feedback.trim()) {
      enqueueSnackbar('Feedback is required', { variant: 'error' })
      return
    }
    try {
      await rejectSyllabus(id, feedback)
      enqueueSnackbar('Syllabus rejected successfully', { variant: 'success' })
      router.push(PATH_DASHBOARD.hod.syllabusRequests)
    } catch (error) {
      enqueueSnackbar('Failed to reject syllabus', { variant: 'error' })
    }
  }

  const handleAddComment = async (eventId, commentContent) => {
    try {
      const response = await axios.post(`/syllabus/${id}/add-comment`, {
        eventId,
        content: commentContent
      })

      if (response.data && response.data.status_timeline) {
        setTimelineData(JSON.parse(response.data.status_timeline))
        enqueueSnackbar('Comment added successfully', { variant: 'success' })
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      enqueueSnackbar('Failed to add comment', { variant: 'error' })
    }
  }

  return (
    <DashboardLayout>
      <Head>
        <title>
          {syllabusName ? `${syllabusName} - Preview` : 'Syllabus Preview'} |
          Paragon School
        </title>
      </Head>
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Syllabus Preview"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.home },
            {
              name: 'Syllabi Requests',
              href: PATH_DASHBOARD.dean.syllabiRequests
            },
            { name: syllabusName || 'Preview' }
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                height: 'calc(100vh - 200px)',
                padding: 2,
                overflow: 'auto'
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                pdfPreview && (
                  <embed
                    src={pdfPreview}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                  />
                )
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                height: 'calc(100vh - 200px)',
                padding: 2,
                overflow: 'auto'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Syllabus Details
              </Typography>
              {syllabusData && (
                <Box mb={2}>
                  <Typography>
                    <strong>Name:</strong> {syllabusData.syllabus_name}
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Request Timeline
              </Typography>
              {syllabusData && timelineData && (
                <SyllabiRequestTimeline
                  timelineData={timelineData}
                  onAddComment={handleAddComment}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => router.push(PATH_DASHBOARD.dean.syllabiRequests)}
          >
            Back to Syllabi Requests
          </Button>
        </Box>
      </Container>
    </DashboardLayout>
  )
}
export default SyllabusPreview
