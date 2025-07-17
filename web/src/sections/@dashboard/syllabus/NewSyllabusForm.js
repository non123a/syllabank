import React, { useState, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Card,
  Stack,
  Button,
  Typography,
  Alert,
  MenuItem,
  Grid,
  Divider,
  IconButton,
  Link,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  CircularProgress
} from '@mui/material'
import { PATH_DASHBOARD } from 'src/routes/paths'
import FormProvider from 'src/components/hook-form/FormProvider'
import RHFTextField from 'src/components/hook-form/RHFTextField'
import RHFSelect from 'src/components/hook-form/RHFSelect'
import RHFAutoComplete from 'src/components/hook-form/RHFAutoComplete'
import { useQueryClient } from '@tanstack/react-query'
import useResponsive from 'src/hooks/useResponsive'
import Iconify from 'src/components/Iconify'
import { RHFUploadSingleFile } from 'src/components/hook-form/RHFUpload'
import { useTheme } from '@mui/material/styles'
import useSyllabus, { useCreateSyllabus } from 'src/hooks/queries/useSyllabus'
import LatexRenderer from 'src/components/LatexRenderer'
import {
  getTemplates,
  getTemplateContent,
  previewTemplate,
  previewLatexTemplate
} from 'src/apis/syllabus'
import { useQuery } from '@tanstack/react-query'
import { getMyAssignedCourses } from 'src/apis/me'
import LatexTemplateEditor from 'src/components/LatexTemplateEditor'
import RHFSwitch from 'src/components/hook-form/RHFSwitch'
import axios from 'src/utils/axios'

export default function NewSyllabusForm() {
  const { push } = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const isMobile = useResponsive('down', 'sm')
  const theme = useTheme()

  const [isDuplicate, setIsDuplicate] = useState(false)
  const [duplicateMessage, setDuplicateMessage] = useState('')
  const [isFileUpload, setIsFileUpload] = useState(false)
  const [templates, setTemplates] = useState([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [latexPreviewOpen, setLatexPreviewOpen] = useState(false)
  const [latexPreviewContent, setLatexPreviewContent] = useState('')
  const [latexTemplate, setLatexTemplate] = useState(null)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null)

  const createSyllabusMutation = useCreateSyllabus()

  const NewSyllabusSchema = Yup.object().shape({
    course: Yup.object().required('Course is required'),
    credits: Yup.number()
      .required('Credits are required')
      .integer('Credits must be an integer')
      .min(1, 'Credits must be at least 1')
      .max(10, 'Credits cannot exceed 10'),
    sections: Yup.array()
      .of(Yup.string().matches(/^\d+$/, 'Must be a number'))
      .min(1, 'At least one section is required'),
    template: Yup.string().when(['isFileUpload', 'useLatexTemplate'], {
      is: (isFileUpload, useLatexTemplate) =>
        !isFileUpload && !useLatexTemplate,
      then: Yup.string().required('Template is required'),
      otherwise: Yup.string()
    }),
    syllabusFile: Yup.mixed().when('isFileUpload', {
      is: true,
      then: Yup.mixed()
        .required('File is required')
        .test('fileFormat', 'Only PDF files are allowed', (value) => {
          return value && value.type === 'application/pdf'
        })
        .test('fileSize', 'File size must be less than 10MB', (value) => {
          return value && value.size <= 10485760 // 10MB
        }),
      otherwise: Yup.mixed()
    }),
    useLatexTemplate: Yup.boolean(),
    isFileUpload: Yup.boolean()
  })

  const defaultValues = useMemo(
    () => ({
      course: '',
      credits: 0,
      sections: [''],
      template: '',
      syllabusFile: null,
      useLatexTemplate: false,
      isFileUpload: false
    }),
    []
  )

  const methods = useForm({
    resolver: yupResolver(NewSyllabusSchema),
    defaultValues
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting }
  } = methods
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections'
  })

  const selectedTemplateId = watch('template')

  const handleLatexTemplateSave = (template) => {
    setLatexTemplate(template)
  }

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data)
    try {
      const formData = new FormData()
      formData.append('assignmentId', data.course.id)
      formData.append('sections', JSON.stringify(data.sections))
      formData.append('credits', data.credits) // Add credits to formData
      formData.append('isFileUpload', data.isFileUpload)

      if (data.isFileUpload) {
        formData.append('pdfFile', data.syllabusFile)
      } else {
        if (data.useLatexTemplate && latexTemplate) {
          formData.append('latexTemplate', latexTemplate)
        } else {
          formData.append('templateId', data.template)
        }
      }

      const result = await createSyllabusMutation.mutateAsync(formData)

      enqueueSnackbar('Syllabus created successfully!', {
        variant: 'success'
      })
      push(PATH_DASHBOARD.syllabus.list)
    } catch (error) {
      console.error('Error creating syllabus:', error)
      enqueueSnackbar(
        error.response?.data?.message || error.message || 'An error occurred',
        {
          variant: 'error'
        }
      )
    }
  }

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoadingTemplates(true)
      try {
        const response = await getTemplates()
        setTemplates(response.data)
      } catch (error) {
        enqueueSnackbar('Failed to fetch templates', { variant: 'error' })
      } finally {
        setIsLoadingTemplates(false)
      }
    }
    fetchTemplates()
  }, [enqueueSnackbar])

  const handleTemplateChange = (newValue) => {
    setSelectedTemplate(newValue)
    methods.setValue('template', newValue ? newValue.id : '')
    setPdfPreviewUrl(null) // Clear the PDF preview when a new template is selected
  }

  const handlePreviewTemplate = async () => {
    try {
      if (!selectedTemplate || !selectedTemplate.content) {
        enqueueSnackbar('No template content available for preview', {
          variant: 'error'
        })
        return
      }

      const response = await axios.post('/syllabus/render-custom', {
        content: selectedTemplate.content
      })

      if (response.data && response.data.pdf) {
        const pdfPreviewUrl = `data:application/pdf;base64,${response.data.pdf}`
        setPdfPreviewUrl(pdfPreviewUrl)
      } else {
        console.error('PDF data not found in the response')
        enqueueSnackbar('Failed to generate PDF preview', { variant: 'error' })
      }
    } catch (error) {
      console.error('Error previewing template:', error)
      enqueueSnackbar('Failed to preview template', { variant: 'error' })
    }
  }

  const handleLatexPreviewClose = () => {
    setLatexPreviewOpen(false)
  }

  const { data: assignedCourses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['assignedCourses'],
    queryFn: getMyAssignedCourses
  })

  useEffect(() => {
    const selectedTemplateId = methods.watch('template')
    if (selectedTemplateId) {
      const template = templates.find(
        (t) => t.id === parseInt(selectedTemplateId)
      )
      setSelectedTemplate(template)
    } else {
      setSelectedTemplate(null)
    }
  }, [methods.watch('template'), templates])

  const handleDownloadLogo = async () => {
    try {
      const response = await axios.get('/syllabus/logo-image', {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'logo.png')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading logo:', error)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get('/syllabus/download/template', {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'PIUTemplate.docx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading template:', error)
    }
  }

  const handleModeSwitch = () => {
    const newIsFileUpload = !isFileUpload
    setIsFileUpload(newIsFileUpload)
    methods.setValue('isFileUpload', newIsFileUpload)
    if (newIsFileUpload) {
      methods.setValue('syllabusFile', null)
      methods.setValue('template', '')
    } else {
      methods.setValue('syllabusFile', null)
      methods.setValue('template', '')
      setSelectedTemplate(null)
    }
    setPdfPreviewUrl(null)
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h6">Create New Syllabus</Typography>
          <Button
            variant="outlined"
            onClick={handleModeSwitch}
            startIcon={
              <Iconify
                icon={
                  isFileUpload
                    ? 'eva:file-text-outline'
                    : 'eva:cloud-upload-outline'
                }
              />
            }
          >
            {isFileUpload ? 'Switch to Form Fill' : 'Switch to File Upload'}
          </Button>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <RHFAutoComplete
              name="course"
              label="Course"
              options={assignedCourses || []}
              getOptionLabel={(option) =>
                option
                  ? `${option.course_subject} ${option.course_code} - ${option.course_name}`
                  : ''
              }
              isOptionEqualToValue={(option, value) =>
                option && value && option.id === value.id
              }
              loading={isLoadingCourses}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>
                    <Typography variant="body1">
                      {`${option.course_subject} ${option.course_code} - ${option.course_name}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {`AY ${option.academic_year_start.substring(
                        0,
                        4
                      )} - ${option.academic_year_end.substring(
                        0,
                        4
                      )}, Semester ${option.semester_number}`}
                    </Typography>
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Course"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingCourses ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          </Grid>
          {isFileUpload && (
            <Grid item xs={12}>
              <RHFUploadSingleFile
                name="syllabusFile"
                accept="application/pdf"
                maxSize={10485760} // 10MB
                onDrop={(acceptedFiles) => {
                  const file = acceptedFiles[0]
                  methods.setValue('syllabusFile', file)
                }}
              />
              {methods.watch('syllabusFile') && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Iconify
                    icon="eva:checkmark-circle-2-fill"
                    color="success.main"
                    width={20}
                    height={20}
                  />
                  <Typography
                    variant="body2"
                    sx={{ ml: 1, color: 'success.main' }}
                  >
                    File selected: {methods.watch('syllabusFile').name}
                  </Typography>
                </Box>
              )}
            </Grid>
          )}
          {!isFileUpload && (
            <Grid item xs={12} md={6}>
              <RHFAutoComplete
                name="template"
                label="Template"
                options={templates}
                value={selectedTemplate}
                getOptionLabel={(option) => option.name || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                loading={isLoadingTemplates}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body2">{option?.name}</Typography>
                      {option?.description ? (
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          {option.description.length > 100
                            ? option.description.substring(0, 100) + '...'
                            : option.description}
                        </Typography>
                      ) : (
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          Description is not available
                        </Typography>
                      )}
                    </Box>
                  </li>
                )}
                onChange={(event, newValue) => handleTemplateChange(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Template"
                    error={!!methods.formState.errors.template}
                    helperText={methods.formState.errors.template?.message}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingTemplates ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
            </Grid>
          )}
          {selectedTemplate && (
            <>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={handlePreviewTemplate}
                  disabled={!selectedTemplate}
                >
                  Preview Template
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Template Description:
                </Typography>
                <Typography variant="body2">
                  {selectedTemplate.description || 'No description available'}
                </Typography>
              </Grid>
            </>
          )}
          {pdfPreviewUrl && (
            <Box mt={4} sx={{ width: '100%' }}>
              <Typography variant="h6" mb={2}>
                Template Preview
              </Typography>
              <Paper
                elevation={3}
                sx={{
                  height: '70vh',
                  width: '100%',
                  overflow: 'hidden'
                }}
              >
                <embed
                  src={pdfPreviewUrl}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                />
              </Paper>
            </Box>
          )}
          {selectedTemplate && methods.watch('useLatexTemplate') && (
            <Grid item xs={12}>
              <LatexTemplateEditor
                initialTemplate={selectedTemplate.content}
                onSave={handleLatexTemplateSave}
              />
            </Grid>
          )}
        </Grid>
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" sx={{ mb: 3 }}>
            Course Sections
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {fields.length === 0 ? (
              <Box
                key="default-section"
                sx={{
                  position: 'relative',
                  width: '100px',
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 1
                }}
              >
                <RHFTextField
                  name="sections.0"
                  sx={{
                    width: '100%',
                    height: '100%',
                    '& .MuiInputBase-root': {
                      height: '100%'
                    },
                    '& .MuiInputBase-input': {
                      textAlign: 'center',
                      fontSize: '1.75rem',
                      fontWeight: 'bold',
                      padding: '8px',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.875rem',
                      top: '-8px'
                    }
                  }}
                />
              </Box>
            ) : (
              fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{
                    position: 'relative',
                    width: '100px',
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                >
                  <RHFTextField
                    name={`sections.${index}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      '& .MuiInputBase-root': {
                        height: '100%'
                      },
                      '& .MuiInputBase-input': {
                        textAlign: 'center',
                        fontSize: '1.75rem',
                        fontWeight: 'bold',
                        padding: '8px',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '0.875rem',
                        top: '-8px'
                      }
                    }}
                  />
                  {index > 0 && (
                    <IconButton
                      onClick={() => remove(index)}
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        right: -12,
                        padding: '6px',
                        backgroundColor: 'background.paper',
                        boxShadow: 1,
                        '&:hover': {
                          backgroundColor: 'error.lighter'
                        }
                      }}
                    >
                      <Iconify icon="eva:close-fill" width={20} height={20} />
                    </IconButton>
                  )}
                </Box>
              ))
            )}
            <Button
              onClick={() => append('')}
              variant="outlined"
              sx={{
                width: '100px',
                height: '100px',
                minWidth: 'unset',
                padding: 0,
                borderStyle: 'dashed',
                '&:hover': {
                  borderStyle: 'solid'
                }
              }}
            >
              <Iconify icon="eva:plus-fill" width={32} height={32} />
            </Button>
          </Box>
        </>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 3, width: '20%' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Course Credits
          </Typography>
          <RHFTextField
            name="credits"
            label="Credits"
            type="number"
            InputProps={{ inputProps: { min: 1, max: 10 } }}
            fullWidth
          />
        </Box>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{ mt: 3 }}
        >
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Create Syllabus
          </LoadingButton>
        </Stack>
        {/* The Below was for Latex */}
        {/* {!isFileUpload && (
          <Box
            sx={{
              backgroundColor: 'warning.lighter',
              border: 1,
              borderColor: 'warning.main',
              borderRadius: 1,
              p: 2,
              mt: 4
            }}
          >
            <Typography variant="subtitle1" color="warning.dark" gutterBottom>
              <Iconify
                icon="mdi:alert"
                sx={{ mr: 1, verticalAlign: 'bottom' }}
              />
              Important Note for Logo Usage
            </Typography>
            <Typography variant="body2" color="warning.dark">
              To use the Paragon International University logo in your Latex
              syllabus, please ensure you name your image file exactly as &nbsp;
              <strong>logo.png</strong>. This specific naming is crucial for the
              system to render the logo correctly. Download the below image if
              you need to use with other latex rendering applications.
            </Typography>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              startIcon={<Iconify icon="mdi:download" />}
              onClick={handleDownloadLogo}
              sx={{ mt: 1 }}
            >
              Download Paragon Logo
            </Button>
          </Box>
        )} */}
        {isFileUpload && (
          <Box
            sx={{
              backgroundColor: 'info.lighter',
              border: 1,
              borderColor: 'info.main',
              borderRadius: 1,
              p: 2,
              mt: 4
            }}
          >
            <Typography variant="subtitle1" color="info.dark" gutterBottom>
              <Iconify
                icon="mdi:information"
                sx={{ mr: 1, verticalAlign: 'bottom' }}
              />
              Template Usage Information
            </Typography>
            <Typography variant="body2" color="text.primary">
              To create your syllabus, you can download and use the Paragon
              International University template. This template is compatible
              with Microsoft Word and other similar applications.
            </Typography>
            <Button
              variant="outlined"
              color="info"
              size="small"
              startIcon={<Iconify icon="mdi:download" />}
              onClick={handleDownloadTemplate}
              sx={{ mt: 1 }}
            >
              Download Template
            </Button>
          </Box>
        )}
      </Card>

      <Dialog
        open={latexPreviewOpen}
        onClose={handleLatexPreviewClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>LaTeX Template Preview</DialogTitle>
        <DialogContent>
          <LatexRenderer content={latexPreviewContent} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLatexPreviewClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  )
}
