import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Box, Card, Stack, Button, Typography, Alert } from '@mui/material'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { FormProvider, RHFTextField } from 'src/components/hook-form'
import { useQueryClient } from '@tanstack/react-query'
import useCourse from 'src/hooks/queries/useCourse'
import { updateCourse } from 'src/apis/course'

NewEditCourseForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCourse: PropTypes.object
}

export default function NewEditCourseForm({ isEdit = false, currentCourse }) {
  const { push } = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  const [isDuplicate, setIsDuplicate] = useState(false)
  const [duplicateMessage, setDuplicateMessage] = useState('')

  const createCourseMutation = useCourse.createCourse(queryClient)
  const createCourseAnywayMutation = useCourse.createCourseAnyway(queryClient)

  const NewCourseSchema = Yup.object().shape({
    subject: Yup.string()
      .matches(/^[A-Z]+$/, 'Only accept Capital Letters')
      .required('Course subject is required'),
    code: Yup.string()
      .matches(/^[0-9]+$/, 'Only accept number')
      .length(3, 'Course code must be 3 characters')
      .required('Course code is required'),
    name: Yup.string().required('Course name is required'),
    description: Yup.string().nullable()
  })

  const defaultValues = useMemo(
    () => ({
      subject: currentCourse?.course_subject || '',
      name: currentCourse?.course_name || '',
      code: currentCourse?.course_code || '',
      description: currentCourse?.description || ''
    }),
    [currentCourse]
  )

  const methods = useForm({
    resolver: yupResolver(NewCourseSchema),
    defaultValues
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateCourse(currentCourse.id, data)
        enqueueSnackbar('Update success!', { variant: 'success' })
        push(PATH_DASHBOARD.course.list)
      } else {
        const result = await createCourseMutation.mutateAsync(data)

        if (result.status === 'success') {
          enqueueSnackbar('Course created successfully!', {
            variant: 'success'
          })
          push(PATH_DASHBOARD.course.list)
        } else {
        }
      }
    } catch (error) {
      if (
        error.response?.status === 409 &&
        error.response?.data?.status === 'duplicate'
      ) {
        setIsDuplicate(true)
        setDuplicateMessage(error.response.data.message)
        // enqueueSnackbar(error.response.data.message, { variant: 'warning' })
      } else {
        enqueueSnackbar(error.response?.data?.message || 'An error occurred', {
          variant: 'error'
        })
      }
    }
  }

  const handleCreateAnyway = async () => {
    try {
      const currentData = methods.getValues()
      const result = await createCourseAnywayMutation.mutateAsync(currentData)

      if (result.status === 'success') {
        enqueueSnackbar('Course created successfully!', { variant: 'success' })
        push(PATH_DASHBOARD.course.list)
      }
    } catch (error) {
      console.error('Error in handleCreateAnyway:', error)
      enqueueSnackbar(error.message || 'An error occurred', {
        variant: 'error'
      })
    }
  }

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: 'grid',
            columnGap: 2,
            rowGap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)'
            }
          }}
        >
          <RHFTextField name="subject" label="Course Subject" />
          <RHFTextField name="code" label="Course Code" />
          <RHFTextField name="name" label="Course Name" />
          <RHFTextField
            name="description"
            label="Description"
            multiline
            rows={4}
          />
        </Box>

        {isDuplicate && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            <Typography>{duplicateMessage}</Typography>
          </Alert>
        )}

        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{ mt: 3 }}
        >
          <LoadingButton
            type="submit"
            variant="contained"
            loading={
              createCourseMutation.isLoading ||
              createCourseAnywayMutation.isLoading
            }
          >
            {!isEdit ? 'Create Course' : 'Save Changes'}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  )
}
