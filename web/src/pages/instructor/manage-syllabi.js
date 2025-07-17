'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  InputAdornment,
  MenuItem,
  IconButton,
  Button,
  Divider,
  TextField,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import Logo from 'src/components/Logo'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import ReactDOM from 'react-dom'

const fakeTemplates = [
  { id: 1, name: 'Basic Template' },
  { id: 2, name: 'Advanced Template' }
]

const ManageSyllabi = () => {
  const [templates] = useState(fakeTemplates)
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      courseTitle: '',
      courseCode: '',
      instructor: '',
      templateId: '',
      sections: [{ title: '', content: '', hours: 0 }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections'
  })

  const selectedTemplateId = watch('templateId')

  useEffect(() => {
    if (selectedTemplateId) {
      // In a real application, you would fetch the template details here
      // and update the form accordingly
    }
  }, [selectedTemplateId, setValue])

  const onSubmit = async (data) => {
    console.log('Syllabus data:', data)
    enqueueSnackbar('Syllabus created successfully', { variant: 'success' })
  }

  const renderToPDF = async () => {
    const data = watch() // Get current form data
    const printElement = document.createElement('div')
    document.body.appendChild(printElement)
    ReactDOM.render(<SyllabusPrintView data={data} />, printElement)

    try {
      const canvas = await html2canvas(printElement)
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('syllabus.pdf')
    } finally {
      ReactDOM.unmountComponentAtNode(printElement)
      printElement.remove()
    }
  }

  const SyllabusPrintView = ({ data }) => (
    <Box id="syllabus-print-view" className="p-8">
      <Typography variant="h4" gutterBottom>
        {data.courseTitle}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Course Code: {data.courseCode}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Instructor: {data.instructor}
      </Typography>
      <Divider className="my-4" />
      {data.sections.map((section, index) => (
        <Box key={index} className="mb-4">
          <Typography variant="h6">{section.title}</Typography>
          <Typography>{section.content}</Typography>
          <Typography>Hours: {section.hours}</Typography>
        </Box>
      ))}
      <Divider className="my-4" />
      <Typography variant="h6">
        Total Hours:{' '}
        {data.sections.reduce((sum, section) => sum + (section.hours || 0), 0)}
      </Typography>
      <Typography variant="body1" className="mt-4">
        Additional Notes: {data.additionalNotes}
      </Typography>
    </Box>
  )

  return (
    <Card>
      <CardContent className="sm:!p-12">
        <Box id="syllabus-content">
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Box className="p-6 rounded bg-gray-100">
                <Box className="flex justify-between gap-4 flex-col sm:flex-row">
                  <Box className="flex flex-col gap-6">
                    <Box className="flex items-center gap-2.5">
                      <Logo />
                    </Box>
                    <Box>
                      <Typography color="text.primary">
                        Paragon School
                      </Typography>
                      <Typography color="text.primary">
                        123 Education St, Knowledge City
                      </Typography>
                      <Typography color="text.primary">
                        +1 (234) 567-8901
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="flex flex-col gap-2">
                    <Box className="flex items-center gap-4">
                      <Typography variant="h5" className="min-w-[95px]">
                        Syllabus
                      </Typography>
                      <Controller
                        name="courseCode"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            placeholder="Course Code"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  #
                                </InputAdornment>
                              )
                            }}
                          />
                        )}
                      />
                    </Box>
                    <Box className="flex items-center">
                      <Typography
                        className="min-w-[95px] mr-4"
                        color="text.primary"
                      >
                        Date Created:
                      </Typography>
                      <TextField
                        type="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        fullWidth
                      />
                    </Box>
                    <Box className="flex items-center">
                      <Typography
                        className="min-w-[95px] mr-4"
                        color="text.primary"
                      >
                        Semester:
                      </Typography>
                      <TextField select fullWidth defaultValue="Fall 2023">
                        <MenuItem value="Fall 2023">Fall 2023</MenuItem>
                        <MenuItem value="Spring 2024">Spring 2024</MenuItem>
                      </TextField>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box className="flex justify-between flex-col gap-4 sm:flex-row">
                <Box className="flex flex-col gap-4">
                  <Typography className="font-medium" color="text.primary">
                    Course Details:
                  </Typography>
                  <Controller
                    name="courseTitle"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Course Title"
                        className="w-full sm:w-64"
                      />
                    )}
                  />
                  <Controller
                    name="instructor"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Instructor"
                        className="w-full sm:w-64"
                      />
                    )}
                  />
                  <Controller
                    name="templateId"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Select Template"
                        className="w-full sm:w-64"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {templates.map((template) => (
                          <MenuItem key={template.id} value={template.id}>
                            {template.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider className="border-dashed" />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className="mb-4">
                Syllabus Sections
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Section Title</TableCell>
                      <TableCell>Content</TableCell>
                      <TableCell>Hours</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Controller
                            name={`sections.${index}.title`}
                            control={control}
                            render={({ field }) => (
                              <TextField {...field} fullWidth />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`sections.${index}.content`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={2}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`sections.${index}.hours`}
                            control={control}
                            render={({ field }) => (
                              <TextField {...field} type="number" fullWidth />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => remove(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                startIcon={<AddIcon />}
                onClick={() => append({ title: '', content: '', hours: 0 })}
                className="mt-4"
              >
                Add Section
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Divider className="border-dashed" />
            </Grid>
            <Grid item xs={12} className="flex justify-between">
              <Box>
                <Typography className="font-medium" color="text.primary">
                  Additional Notes:
                </Typography>
                <Controller
                  name="additionalNotes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      multiline
                      rows={4}
                      fullWidth
                      placeholder="Enter any additional notes here..."
                      className="mt-2 w-full sm:w-96"
                    />
                  )}
                />
              </Box>
              <Box className="text-right">
                <Typography className="font-medium" color="text.primary">
                  Total Hours:
                </Typography>
                <Typography variant="h6">
                  {fields.reduce((sum, field) => sum + (field.hours || 0), 0)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box className="mt-8 flex justify-end gap-4">
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
          >
            Create Syllabus
          </Button>
          <Button onClick={renderToPDF} variant="contained" color="secondary">
            Generate PDF
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ManageSyllabi
