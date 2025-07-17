import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { useCallback, useEffect, useMemo } from 'react'
import { useSnackbar } from 'notistack'
// next
import { useRouter } from 'next/router'
// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// @mui
import { LoadingButton } from '@mui/lab'
import { Box, Card, Stack } from '@mui/material'
// utils

// routes
import { PATH_DASHBOARD } from 'src/routes/paths'
// components
import { FormProvider, RHFTextField } from 'src/components/hook-form'
import { registerInstructor } from 'src/apis/instructor'
import { useQueryClient } from '@tanstack/react-query'
import useInstructor from 'src/hooks/queries/useInstructor'

// ----------------------------------------------------------------------

NewEditInstructorForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object
}

export default function NewEditInstructorForm({ isEdit = false, currentUser }) {
  const { push } = useRouter()

  const { enqueueSnackbar } = useSnackbar()

  const queryClient = useQueryClient()

  const updateInstructorMutation = useInstructor.updateInstructor(queryClient)

  const NewInstructorSchema = Yup.object().shape({
    identification: isEdit
      ? Yup.string()
      : Yup.string().required('Instructor ID is required'),
    email: isEdit
      ? Yup.string()
      : Yup.string().required('Instructor Email is required').email(),
    name: Yup.string().required('Name is required')
  })

  const defaultValues = useMemo(
    () => ({
      identification: currentUser?.identification || '',
      email: currentUser?.email || '',
      name: currentUser?.name || ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  )

  const methods = useForm({
    resolver: yupResolver(NewInstructorSchema),
    defaultValues
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues])

  const onSubmit = async (values) => {
    try {
      if (!isEdit) {
        await registerInstructor(values)
        await queryClient.invalidateQueries({ queryKey: ['users/instructors'] })
      }
      if (isEdit) {
        await updateInstructorMutation.mutateAsync({
          id: currentUser.id,
          data: {
            name: values.name
          }
        })
      }
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card sx={{ p: 2 }}>
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
          {!isEdit && (
            <>
              <RHFTextField name="identification" label="Instructor ID" />
              <RHFTextField name="email" label="Instructor Email" />
            </>
          )}
          <RHFTextField name="name" label="Full Name" />
        </Box>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {!isEdit ? 'Create Instructor' : 'Save Changes'}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  )
}
