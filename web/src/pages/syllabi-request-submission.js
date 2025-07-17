import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Container,
  MenuItem,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Autocomplete
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import Layout from 'src/layouts'
import SyllabiRequestForm from '../sections/@dashboard/syllabus/SyllabiRequestForm'
import useSettings from 'src/hooks/useSettings'
import useResponsive from 'src/hooks/useResponsive'
import useAcademicPeriod from 'src/hooks/queries/useAcademicPeriod'
import { coursesData } from '../sections/@dashboard/syllabus/SyllabiRequestForm'
import { useQuery } from '@tanstack/react-query'
import { getSemestersInAcademicYear } from 'src/apis/academicPeriod'
import { fAcademicYear } from 'src/utils/formatTime'
import axios from 'src/utils/axios'
import { useSnackbar } from 'notistack'

SyllabiRequestSubmission.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default function SyllabiRequestSubmission() {
  const { themeStretch } = useSettings()
  const [forms, setForms] = useState([])
  const [academicYear, setAcademicYear] = useState('')
  const [semester, setSemester] = useState('')
  const [semesterNumber, setSemesterNumber] = useState('')
  const [description, setDescription] = useState('')
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [syllabi, setSyllabi] = useState([])
  const { enqueueSnackbar } = useSnackbar()

  const isMobile = useResponsive('down', 'md')

  const { data: academicYears, isLoading: isLoadingAcademicYears } =
    useAcademicPeriod.getAll()

  const semestersQuery = useQuery({
    queryKey: ['semesters', academicYear],
    queryFn: () => getSemestersInAcademicYear(academicYear),
    enabled: !!academicYear && academicYear !== 'all'
  })

  const syllabusQuery = useQuery({
    queryKey: ['student-syllabi', academicYear, semesterNumber],
    queryFn: () =>
      axios.get('/syllabus/student-syllabi', {
        params: {
          academic_year_start: academicYear
            ? new Date(
                academicYears.data.find(
                  (year) => year.id === parseInt(academicYear)
                ).start_date
              ).getFullYear()
            : undefined,
          semester_number: semesterNumber
        }
      }),
    enabled: !!academicYear && !!semesterNumber,
    onSuccess: (data) => {
      setSyllabi(data.data)
    }
  })

  const handleOnFilterAcademicYear = (event, newValue) => {
    setAcademicYear(newValue ? newValue.id : '')
    setSemester('')
    setForms([])
  }

  const handleSemesterChange = (event) => {
    setSemester(event.target.value)
    const selectedSemester = semestersQuery.data?.data?.find(
      (sem) => sem.id === parseInt(event.target.value)
    )
    if (selectedSemester) {
      setSemesterNumber(selectedSemester.semester_number)
    }
  }

  useEffect(() => {
    if (academicYear === 'all' || !academicYear) {
      setSemester('')
    }
  }, [academicYear])

  const handleCreateForm = () => {
    if (academicYear && semester && syllabi.length > 0) {
      const selectedYear = academicYears?.data?.find(
        (year) => year.id === parseInt(academicYear)
      )
      const selectedSemester = semestersQuery.data?.data?.find(
        (sem) => sem.id === parseInt(semester)
      )
      if (selectedYear && selectedSemester) {
        const isDuplicate = forms.some(
          (form) =>
            form.academicYear.id === selectedYear.id &&
            form.semester.id === selectedSemester.id
        )
        if (!isDuplicate) {
          const newForm = {
            id: Date.now(),
            academicYear: selectedYear,
            semester: selectedSemester,
            syllabi: syllabi,
            courses: [] // Initialize courses as an empty array
          }
          setForms([...forms, newForm])
          setSemester('')
        } else {
          enqueueSnackbar('This semester form already exists', {
            variant: 'error'
          })
        }
      }
    } else if (syllabi.length === 0) {
      enqueueSnackbar(
        'No syllabi available for the selected academic year and semester',
        {
          variant: 'warning'
        }
      )
    }
  }

  const handleDeleteForm = (id) => {
    setForms(forms.filter((form) => form.id !== id))
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handleSubmit = () => {
    if (forms.length > 0) {
      setOpenConfirmDialog(true)
    }
  }

  const handleConfirmDialogClose = () => {
    setOpenConfirmDialog(false)
  }

  const handleFinalSubmit = async () => {
    const validForms = forms.filter(
      (form) => form.courses && form.courses.length > 0
    )

    if (validForms.length === 0) {
      enqueueSnackbar(
        'Please add at least one course to a form before submitting.',
        { variant: 'error' }
      )
      handleConfirmDialogClose()
      return
    }

    const payload = {
      description: description,
      forms: validForms.map((form) => ({
        academicYear: form.academicYear,
        semester: form.semester,
        courses: form.courses.filter((course) => course.id !== null)
      }))
    }

    try {
      const response = await axios.post(
        '/syllabus/submit-request-form',
        payload
      )
      if (response.status >= 200 && response.status < 300) {
        handleConfirmDialogClose()
        enqueueSnackbar('Syllabus request submitted successfully', {
          variant: 'success'
        })
        // Reset the form state
        setForms([])
        setDescription('')
        setAcademicYear('')
        setSemester('')
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      console.error('Error submitting syllabus request:', error)
      enqueueSnackbar('Failed to submit syllabus request', { variant: 'error' })
    }
  }

  const getFormTitle = (academicYear, semester) => {
    return `${fAcademicYear(
      academicYear.start_date,
      academicYear.end_date
    )} - Semester ${semester.semester_number}`
  }

  return (
    <Page title="Syllabi Request">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="Syllabi Request Form" />
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add New Request Form
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  fullWidth
                  size={isMobile ? 'small' : 'medium'}
                  options={academicYears?.data || []}
                  getOptionLabel={(option) =>
                    fAcademicYear(option.start_date, option.end_date)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Academic Year"
                      disabled={isLoadingAcademicYears || forms.length > 0}
                    />
                  )}
                  value={
                    academicYears?.data?.find(
                      (year) => year.id === academicYear
                    ) || null
                  }
                  onChange={handleOnFilterAcademicYear}
                  disabled={isLoadingAcademicYears || forms.length > 0}
                  ListboxProps={{
                    style: {
                      maxHeight: 260
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  size={isMobile ? 'small' : 'medium'}
                  label="Select Semester"
                  value={semester}
                  onChange={handleSemesterChange}
                  disabled={!academicYear || academicYear === 'all'}
                >
                  {semestersQuery.data?.data?.map((semester) => (
                    <MenuItem key={semester.id} value={semester.id.toString()}>
                      Semester {semester.semester_number}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleCreateForm}
                  disabled={!academicYear || !semester}
                >
                  Add Request Form
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Request Forms
              </Typography>
              <Grid container spacing={2}>
                {forms.map((form) => (
                  <Grid item xs={12} sm={12} key={form.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item xs>
                            <Typography variant="subtitle1" gutterBottom>
                              {getFormTitle(form.academicYear, form.semester)}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <IconButton
                              onClick={() => handleDeleteForm(form.id)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                        <SyllabiRequestForm
                          academicYear={form.academicYear}
                          semester={form.semester}
                          syllabi={form.syllabi}
                          onCoursesChange={(updatedCourses) => {
                            const updatedForms = forms.map((f) =>
                              f.id === form.id
                                ? { ...f, courses: updatedCourses, error: '' }
                                : f
                            )
                            setForms(updatedForms)
                          }}
                        />
                        {form.error && (
                          <Typography color="error" sx={{ mt: 2 }}>
                            {form.error}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {forms.length > 0 && (
              <Box mt={4}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  label="Description"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Enter a description for all the request forms"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{ mt: 2 }}
                  disabled={forms.some(
                    (form) =>
                      !form.courses ||
                      form.courses.length === 0 ||
                      !form.courses.some((course) => course.id !== null)
                  )}
                >
                  {forms.length === 1 ? 'Submit Form' : 'Submit All Forms'}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      <Dialog open={openConfirmDialog} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit{' '}
            {forms.length === 1 ? 'this form' : 'these forms'}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose}>Cancel</Button>
          <Button
            onClick={handleFinalSubmit}
            color="primary"
            variant="contained"
          >
            Confirm Submission
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  )
}
