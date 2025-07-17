import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Stack,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from '@mui/material'
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import DashboardLayout from '../../layouts/dashboard'
import axios from '../../utils/axios'
import { PATH_DASHBOARD } from '../../routes/paths'
import Breadcrumbs from '../../components/Breadcrumbs'

const SyllabusTemplates = () => {
  const [templates, setTemplates] = useState([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState(null)
  const [loading, setLoading] = useState(true)
  const [disabling, setDisabling] = useState(false)
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/syllabus/templates', {
        params: { is_active: true }
      })
      const templatesArray = Array.isArray(response.data)
        ? response.data
        : Object.values(response.data)
      setTemplates(templatesArray)
    } catch (error) {
      console.error('Error fetching templates:', error)
      enqueueSnackbar('Failed to fetch templates. Please try again later.', {
        variant: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = () => {
    router.push(PATH_DASHBOARD.syllabus.createTemplate)
  }

  const handleViewTemplate = (template) => {
    const previewUrl = PATH_DASHBOARD.syllabus.viewTemplate(template.id)
    router.push(previewUrl)
  }

  const handleDeleteClick = (template) => {
    setTemplateToDelete(template)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (templateToDelete) {
      try {
        setDisabling(true)
        await axios.patch(`/syllabus/templates/${templateToDelete.id}/disable`)
        enqueueSnackbar('Template disabled successfully', {
          variant: 'success'
        })
        setDeleteDialogOpen(false)
        fetchTemplates() // Refresh the list after deletion
      } catch (error) {
        console.error(
          'Error disabling template:',
          error.response?.data || error
        )
        if (error.response?.status === 404) {
          enqueueSnackbar(
            'Template not found. It may have been already deleted.',
            { variant: 'warning' }
          )
        } else {
          enqueueSnackbar('Failed to delete the template. Please try again.', {
            variant: 'error'
          })
        }
      } finally {
        setDisabling(false)
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setTemplateToDelete(null)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh'
            }}
          >
            <CircularProgress />
          </Box>
        </Container>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Syllabus Templates | Paragon School</title>
      </Head>
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4">Syllabus Templates</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateTemplate}
          >
            Create New Template
          </Button>
        </Stack>

        <Breadcrumbs
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Syllabus Templates' }
          ]}
          sx={{ mb: 5 }}
        />

        {templates.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h6" gutterBottom>
              No syllabus templates found.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create a new template to get started.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {templates.map((template) => (
              <Grid item key={template.id} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      component="div"
                      gutterBottom
                    >
                      <strong>Name:</strong> {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Description:</strong>{' '}
                      {template.description || 'Not Set'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewTemplate(template)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(template)}
                      color="error"
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the template "
            {templateToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={disabling}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            autoFocus
            disabled={disabling}
          >
            {disabling ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}

export default SyllabusTemplates
