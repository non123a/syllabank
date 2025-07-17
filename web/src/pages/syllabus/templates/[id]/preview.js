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
import DashboardLayout from '../../../../layouts/dashboard'
import axios from '../../../../utils/axios'
import { PATH_DASHBOARD } from '../../../../routes/paths'
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs'

const TemplatePreview = () => {
  const [pdfPreview, setPdfPreview] = useState(null)
  const [templateName, setTemplateName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) {
      fetchTemplateAndRender()
    }
  }, [id])

  const fetchTemplateAndRender = async () => {
    try {
      setLoading(true)
      const templateResponse = await axios.get(`/syllabus/templates/${id}`)
      const { name, content } = templateResponse.data

      setTemplateName(name)

      const renderResponse = await axios.post('/syllabus/render-custom', {
        content: content
      })

      if (renderResponse.data && renderResponse.data.pdf) {
        setPdfPreview(`data:application/pdf;base64,${renderResponse.data.pdf}`)
      } else {
        setError('Failed to render PDF. Please check the template content.')
      }
    } catch (error) {
      console.error('Error fetching or rendering template:', error)
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
          {templateName ? `${templateName} - Preview` : 'Template Preview'} |
          Paragon School
        </title>
      </Head>
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Template Preview"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.home },
            {
              name: 'Syllabus Templates',
              href: PATH_DASHBOARD.provost.syllabusTemplate
            },
            { name: `${templateName}` }
          ]}
        />
        <Typography variant="h4" sx={{ mb: 5 }}>
          Template Preview: {templateName}
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
            onClick={() => router.push(PATH_DASHBOARD.provost.syllabusTemplate)}
          >
            Back to Templates
          </Button>
        </Box>
      </Container>
    </DashboardLayout>
  )
}

export default TemplatePreview
