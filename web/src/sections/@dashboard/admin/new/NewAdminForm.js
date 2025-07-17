import { useSnackbar } from 'notistack'
import { useEffect, useMemo } from 'react'
import * as Yup from 'yup'
// form
import { useForm } from 'react-hook-form'
// @mui
import { LoadingButton } from '@mui/lab'
import { Box, Card, Stack } from '@mui/material'

// components
import { useQueryClient } from '@tanstack/react-query'
import { FormProvider, RHFTextField } from 'src/components/hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useAdmin from 'src/hooks/queries/useAdmin'

// ----------------------------------------------------------------------

export default function NewAdminForm() {
  const queryClient = useQueryClient()

  const { enqueueSnackbar } = useSnackbar()

  const NewAdminSchema = Yup.object().shape({
    userId: Yup.string().required('ID is required'),
    email: Yup.string().required('Email is required').email(),
    name: Yup.string().required('Full Name is required')
  })

  const createAdminMutation = useAdmin.createAdmin(queryClient)

  const defaultValues = useMemo(
    () => ({
      userId: '',
      name: '',
      email: ''
    }),
    []
  )

  const methods = useForm({
    resolver: yupResolver(NewAdminSchema),
    defaultValues
  })

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = methods

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues])

  const onSubmit = async (data) => {
    try {
      await createAdminMutation.mutateAsync({
        identification: data.userId,
        email: data.email,
        name: data.name
      })
      enqueueSnackbar('Create success!')
    } catch (error) {
      enqueueSnackbar(error.response?.data.message, { variant: 'error' })
      reset(defaultValues)
      console.error(error)
    }
  }

  return (
    <Card
      sx={{
        p: 3
      }}
    >
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
          <RHFTextField name="userId" label="ID" />
          <RHFTextField name="email" label="Email" />
          <RHFTextField name="name" label="Full Name" />
        </Box>

        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-end"
          justifyContent="flex-end"
          sx={{ mt: 3 }}
        >
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Create Admin
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  )
}
