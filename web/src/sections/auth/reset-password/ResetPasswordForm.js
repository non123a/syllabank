import PropTypes from 'prop-types'
import * as Yup from 'yup'
// form
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
// @mui
import { Stack } from '@mui/material'
import { LoadingButton } from '@mui/lab'
// hooks
import useIsMountedRef from 'src/hooks/useIsMountedRef'
// components
import { FormProvider, RHFTextField } from 'src/components/hook-form'
// apis
import { forgotPassword } from 'src/apis/auth'

// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func
}

export default function ResetPasswordForm({ onSent, onGetEmail }) {
  const isMountedRef = useIsMountedRef()

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required')
  })

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: '' }
  })

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  const onSubmit = async (data) => {
    try {
      await forgotPassword({
        email: data.email
      })
      if (isMountedRef.current) {
        onSent()
        onGetEmail(data.email)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email address" />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Reset Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  )
}
