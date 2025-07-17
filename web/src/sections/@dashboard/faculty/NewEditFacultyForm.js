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
import useFaculty from 'src/hooks/queries/useFaculty'

NewEditFacultyForm.propTypes = {
  isEdit: PropTypes.bool,
  currentFaculty: PropTypes.object
}

export default function NewEditFacultyForm({ isEdit = false, currentFaculty }) {
  const { push } = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')

  const createFacultyMutation = useFaculty.createFaculty(queryClient)
  const updateFacultyMutation = useFaculty.updateFaculty(queryClient)

  const NewFacultySchema = Yup.object().shape({
    full_name: Yup.string().required('Faculty name is required'),
    code_name: Yup.string().required('Faculty code is required'),
    description: Yup.string().nullable()
  })

  const defaultValues = useMemo(
    () => ({
      full_name: currentFaculty?.full_name || '',
      code_name: currentFaculty?.code_name || '',
      description: currentFaculty?.description || ''
    }),
    [currentFaculty]
  )

  const methods = useForm({
    resolver: yupResolver(NewFacultySchema),
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
        await updateFacultyMutation.mutateAsync({
          facultyId: currentFaculty.id,
          full_name: data.full_name,
          code_name: data.code_name,
          description: data.description
        })
        enqueueSnackbar('Update success!', { variant: 'success' })
      } else {
        await createFacultyMutation.mutateAsync(data)
        enqueueSnackbar('Faculty created successfully!', {
          variant: 'success'
        })
      }
      push(PATH_DASHBOARD.school.faculty.list)
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'An error occurred', {
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
          <RHFTextField name="full_name" label="Faculty Name" />
          <RHFTextField name="code_name" label="Faculty Code" />
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
            {!isEdit ? 'Create Faculty' : 'Save Changes'}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  )
}
