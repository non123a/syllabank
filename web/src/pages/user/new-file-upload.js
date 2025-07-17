// @mui
import { Container, Card, Box, Button, Stack, Typography } from '@mui/material'
import * as Yup from 'yup'
// routes
import { PATH_DASHBOARD } from 'src/routes/paths'
// hooks
import useSettings from 'src/hooks/useSettings'
// layouts
import Layout from 'src/layouts'
// components
import Page from 'src/components/Page'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
// sections
import useAcademicPeriod from 'src/hooks/queries/useAcademicPeriod'
import { fDateYear } from 'src/utils/formatTime'
import {
  FormProvider,
  RHFSelect,
  RHFUploadSingleFile
} from 'src/components/hook-form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { useCallback } from 'react'
import { fShortenNumber } from 'src/utils/formatNumber'
import { registerStudentWithSpreadsheet } from 'src/apis/student'
import { useSnackbar } from 'notistack'

// ----------------------------------------------------------------------

UserCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings()

  const academicPeriods = useAcademicPeriod.getAll()

  const { enqueueSnackbar } = useSnackbar()

  const NewStudentViaFileSchema = Yup.object().shape({
    academicPeriod: Yup.string().required('Academic Period is required'),
    file: Yup.mixed().required('File is required')
  })

  const methods = useForm({
    resolver: yupResolver(NewStudentViaFileSchema),
    defaultValues: {
      academicPeriod: '',
      file: null
    }
  })

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('academicPeriod', data.academicPeriod)
    formData.append('file', data.file)
    try {
      await registerStudentWithSpreadsheet(formData)
    } catch (errror) {
      enqueueSnackbar(errror.response.data.message, { variant: 'error' })
      console.error(errror.response.data.message)
    }
  }

  const { file } = watch()

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setValue(
        'file',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )[0]
      )
    },
    [setValue]
  )

  return (
    <Page title="Register students with spreadsheet file">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Register Student"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Student Management', href: PATH_DASHBOARD.student.list },
            { name: 'New user' }
          ]}
        />
        <Card
          sx={{
            p: 3
          }}
        >
          <Stack direction="column" spacing={3}>
            <Box
              display="flex"
              flexDirection={{
                xs: 'column',
                sm: 'row'
              }}
              gap={1}
              sx={(theme) => ({
                justifyContent: 'space-between',
                [theme.breakpoints.down('sm')]: {
                  alignItems: 'flex-start'
                }
              })}
            >
              <h2>File Upload</h2>
              {/* <Button variant="contained" sx={{ maxWidth: 200 }}>
                Download Sample File
              </Button> */}
            </Box>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack direction="column" spacing={3}>
                <RHFSelect
                  name="academicPeriod"
                  label="Academic Period"
                  placeholder="Academic Period"
                  fullWidth
                >
                  <option value="" />
                  {academicPeriods.data?.data?.map((academicYear) => {
                    return academicYear.semesters?.map((semester) => {
                      const academicPeriod = String(academicYear.id).concat(
                        '|',
                        String(semester.id)
                      )
                      return (
                        <option key={academicPeriod} value={academicPeriod}>
                          {`${fDateYear(academicYear.start_date)} -
                    ${fDateYear(academicYear.end_date)} / ${
                            semester.semester_number
                          }`}
                        </option>
                      )
                    })
                  })}
                </RHFSelect>
                <RHFUploadSingleFile
                  name="file"
                  accept="text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  showPreview={false}
                  onDrop={handleDrop}
                />
                <Typography variant="body2">
                  {file
                    ? `${file.name} ${fShortenNumber(
                        file.size / (1024 * 1024)
                      )} MB`
                    : 'No file selected'}
                </Typography>

                <Box alignSelf="end">
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Upload
                  </LoadingButton>
                </Box>
              </Stack>
            </FormProvider>
          </Stack>
        </Card>
      </Container>
    </Page>
  )
}
