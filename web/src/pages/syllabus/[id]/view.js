import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  Button,
  Alert,
  Paper
} from '@mui/material'
import Head from 'next/head'
import DashboardLayout from '../../../layouts/dashboard'
import axios from '../../../utils/axios'
import { PATH_DASHBOARD } from '../../../routes/paths'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs'

const SyllabusView = () => {
  const [pdfPreview, setPdfPreview] = useState(null)
  const [syllabusName, setSyllabusName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) {
      fetchSyllabusAndRender()
    }
  }, [id])

  const fetchSyllabusAndRender = async () => {
    try {
      setLoading(true)
      const syllabusResponse = await axios.get(`/syllabus/${id}`)
      const { syllabus_name, content, pdf_base64 } = syllabusResponse.data

      setSyllabusName(syllabus_name)

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
      if (error.response) {
        setError(
          `Error ${error.response.status}: ${
            error.response.data.message || 'Unknown error'
          }`
        )
      } else if (error.request) {
        setError('No response received from the server. Please try again.')
      } else {
        setError(`An error occurred: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <Head>
        <title>
          {syllabusName ? `${syllabusName} - View` : 'Syllabus View'} | Paragon
          School
        </title>
      </Head>
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Syllabus View"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.home },
            {
              name: 'Syllabi Listing',
              href: PATH_DASHBOARD.syllabus.list
            },
            { name: `${syllabusName}` }
          ]}
        />
        <Typography variant="h4" sx={{ mb: 5 }}>
          Syllabus View: {syllabusName}
        </Typography>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '70vh'
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Paper
            elevation={3}
            sx={{
              height: 'calc(100vh - 250px)',
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
              <Typography>No preview available</Typography>
            )}
          </Paper>
        )}
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => router.push(PATH_DASHBOARD.syllabus.list)}
          >
            Back to Syllabi
          </Button>
        </Box>
      </Container>
    </DashboardLayout>
  )
}

export default SyllabusView
