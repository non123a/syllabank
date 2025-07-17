import * as Yup from 'yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Stack,
  InputAdornment,
  Alert,
  Snackbar,
  TextField
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import useAuth from 'src/hooks/useAuth'
import useIsMountedRef from 'src/hooks/useIsMountedRef'
import { useQuery } from '@tanstack/react-query'
import { listAcademicYearPreRegistraion } from 'src/apis/academicPeriod'
import { listDepartmentPreRegistration } from 'src/apis/department'
import {
  FormProvider,
  RHFTextField,
  RHFAutoComplete
} from 'src/components/hook-form'

export default function RegisterForm() {
  const { register } = useAuth()
  const isMountedRef = useIsMountedRef()
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string()
      .matches(
        /^[a-z0-9]+$/,
        'Email should only contain lowercase letters and numbers'
      )
      .required('Email is required'),
    identification: Yup.string()
      .required('School ID is required')
      .matches(/^[0-9]+$/, 'ID must be a number')
      .min(5, 'ID must be at least 5 characters long')
      .max(15, "Is this a bit too long? Don't you think? XD"),
    enrollmentYear: Yup.string().required('Enrollment Year is required'),
    department: Yup.number().required('Department is required')
  })

  const defaultValues = {
    emailData: '',
    nameData: '',
    firstName: '',
    lastName: '',
    email: '',
    identification: '',
    enrollmentYear: '',
    department: ''
  }

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues
  })

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = methods

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  const onSubmit = async (data) => {
    try {
      const nameData = `${data.firstName} ${data.lastName}`
      const emailData = `${data.email}@paragoniu.edu.kh`
      const enrollmentYear = new Date(data.enrollmentYear).getFullYear()
      await register({
        email: emailData,
        name: nameData,
        identification_number: data.identification,
        department_id: data.department,
        metadata: {
          enrollment_year: enrollmentYear
        }
      })

      setSnackbarMessage('Account created, check your mail inbox')
      setSnackbarSeverity('success')
      setOpenSnackbar(true)
    } catch (error) {
      console.error(error)
      reset()
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message })
      }

      setSnackbarMessage('Registration failed')
      setSnackbarSeverity('error')
      setOpenSnackbar(true)
    }
  }

  const { data: academicYears } = useQuery({
    queryKey: ['academicYears'],
    queryFn: listAcademicYearPreRegistraion
  })

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: listDepartmentPreRegistration
  })

  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [selectedEnrollmentYear, setSelectedEnrollmentYear] = useState(null)

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {!!errors.afterSubmit && (
            <Alert severity="error">{errors.afterSubmit.message}</Alert>
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="firstName" label="First name" fullWidth />
            <RHFTextField name="lastName" label="Last name" fullWidth />
          </Stack>

          <RHFTextField
            name="email"
            label="Email address"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  @paragoniu.edu.kh
                </InputAdornment>
              )
            }}
          />

          <RHFTextField name="identification" label="School ID" />

          <RHFAutoComplete
            name="enrollmentYear"
            label="Enrollment Year"
            options={academicYears?.data || []}
            getOptionLabel={(option) =>
              `${new Date(option.start_date).getFullYear()} - ${new Date(
                option.end_date
              ).getFullYear()}`
            }
            isOptionEqualToValue={(option, value) => option.id === value}
            value={selectedEnrollmentYear}
            onChange={(event, newValue) => {
              setSelectedEnrollmentYear(newValue)
              methods.setValue(
                'enrollmentYear',
                newValue ? newValue.start_date : null
              )
            }}
          />
          <RHFAutoComplete
            name="department"
            label="Department"
            options={(departments?.data || []).filter(
              (dept) => !dept.code_name.toLowerCase().includes('staff')
            )}
            getOptionLabel={(option) =>
              `${option.code_name} - ${option.full_name}`
            }
            isOptionEqualToValue={(option, value) => option.code_name === value}
            value={selectedDepartment}
            onChange={(event, newValue) => {
              setSelectedDepartment(newValue)
              methods.setValue('department', newValue ? newValue.id : null)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Department"
                error={!!methods.formState.errors.department}
                helperText={methods.formState.errors.department?.message}
              />
            )}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Register
          </LoadingButton>
        </Stack>
      </FormProvider>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
