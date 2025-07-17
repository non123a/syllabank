import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
// form
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material'
import { LoadingButton } from '@mui/lab'
// hooks
import useIsMountedRef from 'src/hooks/useIsMountedRef'
// components
import { FormProvider, RHFTextField } from 'src/components/hook-form'
// apis
import { setPassword } from 'src/apis/auth'
import { useState } from 'react'
import Iconify from '../../../components/Iconify'

// ----------------------------------------------------------------------

SetPasswordForm.propTypes = {
  onSent: PropTypes.func
}

export default function SetPasswordForm({ onSent }) {
  const isMountedRef = useIsMountedRef()
  const { query } = useRouter()
  const token = query?.token
  const email = query?.email

  const [showPassword, setShowPassword] = useState(false)

  const ResetPasswordSchema = Yup.object().shape({
    newPassword: Yup.string().required('New Password is required'),
    confirmNewPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('newPassword'), null], 'Confirm Passwords must match')
  })

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { newPassword: '', confirmNewPassword: '' }
  })

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  const onSubmit = async (data) => {
    try {
      if (isMountedRef.current) {
        await setPassword({
          ...data,
          token,
          email
        })
        onSent()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField
          name="newPassword"
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                  />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <RHFTextField
          name="confirmNewPassword"
          label="Confirm New Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                  />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Set Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  )
}
