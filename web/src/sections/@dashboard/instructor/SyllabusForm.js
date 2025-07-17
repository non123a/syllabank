import React, { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Link,
  Autocomplete
} from '@mui/material'
import CodeMirror from '@uiw/react-codemirror'
import { StreamLanguage } from '@codemirror/language'
import { stex } from '@codemirror/legacy-modes/mode/stex'
import LatexRenderer from '../../../components/LatexRenderer'
import { useQuery } from '@tanstack/react-query'
import { getMyAssignedCourses } from 'src/apis/me'

// Fake data for templates
const templates = [
  { id: 1, name: 'Default Template', previewUrl: '/preview/default' },
  { id: 2, name: 'Science Template', previewUrl: '/preview/science' },
  { id: 3, name: 'Humanities Template', previewUrl: '/preview/humanities' }
]

export default function SyllabusForm({
  onCreateSyllabus,
  onSaveProgress,
  onSubmitToHOD,
  onUploadFile,
  onPreviewTemplate,
  selectedSyllabus
}) {
  const [formData, setFormData] = useState({
    course_id: '',
    sections: '',
    credits: '',
    template_id: '',
    content: '',
    syllabus_name: '',
    pdf_file: null
  })

  const {
    data: assignedCourses,
    isLoading: isLoadingCourses,
    error
  } = useQuery({
    queryKey: ['assignedCourses'],
    queryFn: getMyAssignedCourses,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    onSuccess: (data) => console.log('Assigned Courses:', data),
    onError: (error) => console.error('Error fetching assigned courses:', error)
  })

  console.log('Assigned Courses in render:', assignedCourses) // Add this line

  useEffect(() => {
    if (selectedSyllabus) {
      setFormData(selectedSyllabus)
    }
  }, [selectedSyllabus])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCourseChange = (event, newValue) => {
    setFormData({
      ...formData,
      course_id: newValue ? newValue.id : '',
      sections: newValue ? newValue.sections?.join(', ') || '' : '',
      credits: newValue ? newValue.credits || '' : ''
    })
    console.log('Selected course:', newValue) // Add this line for debugging
  }

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedSyllabus) {
      onSaveProgress(formData)
    } else {
      onCreateSyllabus(formData)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    setFormData({ ...formData, pdf_file: file })
  }

  const handleUpload = () => {
    const formDataToSend = new FormData()
    formDataToSend.append('course_id', formData.course_id)
    formDataToSend.append('sections', formData.sections)
    formDataToSend.append('credits', formData.credits)
    formDataToSend.append('syllabus_name', formData.syllabus_name)
    formDataToSend.append('pdf_file', formData.pdf_file)

    onUploadFile(formDataToSend)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="syllabus_name"
            label="Syllabus Name"
            value={formData.syllabus_name}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            options={assignedCourses?.data || []}
            getOptionLabel={(option) =>
              `${option.course_code} - ${option.course_name}`
            }
            loading={isLoadingCourses}
            value={
              formData.course_id
                ? assignedCourses?.data?.find(
                    (course) => course.id === formData.course_id
                  )
                : null
            }
            onChange={(event, newValue) => handleCourseChange(event, newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Course"
                required
                error={!formData.course_id}
                helperText={!formData.course_id ? 'Please select a course' : ''}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                {option.course_code} - {option.course_name}
              </li>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="sections"
            label="Sections"
            value={formData.sections}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="credits"
            label="Credits"
            type="number"
            value={formData.credits}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Autocomplete
              options={templates}
              getOptionLabel={(option) => option.name}
              value={
                templates.find(
                  (template) => template.id === formData.template_id
                ) || null
              }
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  template_id: newValue ? newValue.id : ''
                })
              }}
              renderInput={(params) => (
                <TextField {...params} label="Template" required />
              )}
            />
          </FormControl>
          {formData.template_id && (
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPreviewTemplate(formData.template_id)
              }}
              sx={{ mt: 1, display: 'inline-block' }}
            >
              Preview Template
            </Link>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">LaTeX Editor</Typography>
          <CodeMirror
            value={formData.content}
            height="200px"
            extensions={[StreamLanguage.define(stex)]}
            onChange={handleContentChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Preview</Typography>
          <LatexRenderer content={formData.content} />
        </Grid>
        <Grid item xs={12}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="pdf-file-upload"
          />
          <label htmlFor="pdf-file-upload">
            <Button variant="contained" component="span">
              Choose PDF File
            </Button>
          </label>
          {formData.pdf_file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected file: {formData.pdf_file.name}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {selectedSyllabus ? 'Save Progress' : 'Create Syllabus'}
          </Button>
          {selectedSyllabus && (
            <Button
              onClick={() => onSubmitToHOD(formData)}
              variant="contained"
              color="secondary"
              sx={{ ml: 2 }}
            >
              Submit to HOD
            </Button>
          )}
          <Button
            onClick={handleUpload}
            variant="contained"
            color="info"
            sx={{ ml: 2 }}
            disabled={!formData.pdf_file}
          >
            Upload PDF
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}
