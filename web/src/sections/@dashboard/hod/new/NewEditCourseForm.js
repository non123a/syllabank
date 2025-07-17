import React, { useState, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Box, Card, Stack } from '@mui/material'
import { PATH_DASHBOARD } from 'src/routes/paths'
import FormProvider from 'src/components/hook-form/FormProvider'
import { useQueryClient } from '@tanstack/react-query'
import useCourse from 'src/hooks/queries/useCourse'
import useAcademicPeriod from 'src/hooks/queries/useAcademicPeriod'
import { RHFAutoComplete } from 'src/components/hook-form'
import { useQuery } from '@tanstack/react-query'
import { getSemestersInAcademicYear } from 'src/apis/academicPeriod'
import { assignCourseToAcademicPeriod } from 'src/apis/course'
import { assignCourse } from '../../../../apis/course'

NewEditCourseForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCourse: PropTypes.object
}

export default function NewEditCourseForm({ isEdit = false, currentCourse }) {
  const { push } = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null)

  const { data: academicYears, isLoading: isLoadingAcademicYears } =
    useAcademicPeriod.getAll()
  const { data: courses, isLoading: isLoadingCourses } = useCourse.getAll()

  const { data: semesters, isLoading: isLoadingSemesters } = useQuery(
    ['semesters', selectedAcademicYear],
    () => getSemestersInAcademicYear(selectedAcademicYear),
    {
      enabled: !!selectedAcademicYear
    }
  )

  const NewCourseSchema = Yup.object().shape({
    academicYear: Yup.object().required('Academic Year is required'),
    semester: Yup.object().required('Semester is required'),
    course: Yup.object().required('Course is required')
  })

  const defaultValues = useMemo(
    () => ({
      academicYear: null,
      semester: null,
      course: null
    }),
    []
  )

  const methods = useForm({
    resolver: yupResolver(NewCourseSchema),
    defaultValues
  })

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting }
  } = methods

  const academicYearValue = watch('academicYear')

  useEffect(() => {
    if (academicYearValue) {
      setSelectedAcademicYear(academicYearValue.id)
      setValue('semester', null) // Clear the semester field when academic year changes
    }
  }, [academicYearValue, setValue])

  const onSubmit = async (data) => {
    try {
      const payload = {
        course_id: data.course.id,
        academic_year_id: data.academicYear.id,
        semester_id: data.semester.id
      }

      const response = await assignCourse(payload)

      if (response.success) {
        enqueueSnackbar(response.data.message, { variant: 'success' })
        push(PATH_DASHBOARD.hod.course.new)
      } else {
        enqueueSnackbar(response.error, { variant: 'error' })
      }
    } catch (error) {
      console.error('Error assigning course:', error)
      enqueueSnackbar(
        error.message || 'An error occurred while assigning the course',
        {
          variant: 'error'
        }
      )
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
          <RHFAutoComplete
            name="course"
            label="Course"
            options={
              courses?.data?.data?.map((course) => ({
                ...course,
                label: `${course.course_subject} ${course.course_code} - ${course.course_name}`
              })) || []
            }
            loading={isLoadingCourses}
          />
          <RHFAutoComplete
            name="academicYear"
            label="Academic Year"
            options={academicYears?.data || []}
            getOptionLabel={(option) => {
              const startYear = new Date(option.start_date).getFullYear()
              const endYear = new Date(option.end_date).getFullYear()
              return `${startYear} - ${endYear}`
            }}
            loading={isLoadingAcademicYears}
          />
          <RHFAutoComplete
            name="semester"
            label="Semester"
            options={
              semesters?.data?.map((semester) => ({
                id: semester.id,
                label: `Semester ${semester.semester_number}`
              })) || []
            }
            loading={isLoadingSemesters}
            disabled={!selectedAcademicYear}
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
            Assign Course
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  )
}
