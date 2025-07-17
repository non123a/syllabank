import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Card,
  Stack,
  TextField,
  MenuItem,
  InputAdornment
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { FormProvider, RHFTextField } from 'src/components/hook-form'
import { useQueryClient } from '@tanstack/react-query'
import useDepartment from 'src/hooks/queries/useDepartment'
import useFaculty from 'src/hooks/queries/useFaculty'

NewEditDepartmentForm.propTypes = {
  isEdit: PropTypes.bool,
  currentDepartment: PropTypes.object
}

export default function NewEditDepartmentForm({
  isEdit = false,
  currentDepartment
}) {
  const { push } = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')

  const createDepartmentMutation = useDepartment.createDepartment(queryClient)
  const updateDepartmentMutation = useDepartment.updateDepartment(queryClient)

  const {
    data: facultiesData,
    isLoading: isFacultiesLoading,
    isError,
    error
  } = useFaculty.queryFilterFaculties({ enabled: true })

  const faculties = facultiesData?.data || []

  const NewDepartmentSchema = Yup.object().shape({
    full_name: Yup.string().required('Department name is required'),
    code_name: Yup.string().required('Department code is required'),
    faculty_id: Yup.string().required('Faculty is required'),
    description: Yup.string().nullable()
  })

  const defaultValues = useMemo(
    () => ({
      full_name: currentDepartment?.full_name || '',
      code_name: currentDepartment?.code_name || '',
      description: currentDepartment?.description || '',
      faculty_id: currentDepartment?.faculty_id || ''
    }),
    [currentDepartment]
  )

  const methods = useForm({
    resolver: yupResolver(NewDepartmentSchema),
    defaultValues
  })

  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = methods

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateDepartmentMutation.mutateAsync({
          departmentId: currentDepartment.id,
          full_name: data.full_name,
          code_name: data.code_name,
          description: data.description,
          facultyId: data.faculty_id
        })
        enqueueSnackbar('Update success!', { variant: 'success' })
      } else {
        await createDepartmentMutation.mutateAsync(data)
        enqueueSnackbar('Department created successfully!', {
          variant: 'success'
        })
      }
      push(PATH_DASHBOARD.school.department.list)
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'An error occurred', {
        variant: 'error'
      })
    }
  }

  const filteredFaculties = faculties.filter((faculty) =>
    faculty.code_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <RHFTextField name="full_name" label="Department Name" />
          <RHFTextField name="code_name" label="Department Code" />
          <Controller
            name="faculty_id"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Faculty"
                disabled={isFacultiesLoading}
                error={Boolean(methods.formState.errors.faculty_id)}
              >
                {faculties.map((faculty) => (
                  <MenuItem key={faculty.id} value={faculty.id}>
                    {faculty.code_name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <RHFTextField
            name="description"
            label="Description"
            multiline
            rows={4}
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
            {!isEdit ? 'Create Department' : 'Save Changes'}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  )
}
