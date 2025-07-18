import * as Yup from 'yup'
import { useState } from 'react'
// next
import NextLink from 'next/link'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// @mui
import {
  Link,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Typography
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
// routes
import { PATH_AUTH } from '../../../routes/paths'
// hooks
import useAuth from '../../../hooks/useAuth'
import useIsMountedRef from '../../../hooks/useIsMountedRef'
// components
import Iconify from '../../../components/Iconify'
import {
  FormProvider,
  RHFTextField,
  RHFCheckbox
} from '../../../components/hook-form'

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login } = useAuth()

  const isMountedRef = useIsMountedRef()

  const [showPassword, setShowPassword] = useState(false)

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email must be a valid email address')
      .matches(
        /^[a-z0-9@.]+$/,
        'Email should only contain lowercase letters and numbers'
      )
      .required('Email is required'),
    password: Yup.string().required('Password is required')
  })

  const defaultValues = {
    email: '',
    password: '',
    remember: false
  }

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues
  })

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = methods

  const onSubmit = async (data) => {
    await login({ email: data.email, password: data.password }, (error) => {
      reset()
      if (isMountedRef.current) {
        setError('afterSubmit', {
          ...error,
          message: error.response?.data?.message
        })
      }
    })
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
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
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 2 }}
      >
        <RHFCheckbox name="remember" label="Remember me" />
        <Stack
          direction="row"
          alighItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
          spacing={2}
        >
          <Typography variant="subtitle2">Are you a student?</Typography>
          <NextLink href={PATH_AUTH.register} passHref>
            <Link variant="subtitle2">Register</Link>
          </NextLink>
          <NextLink href={PATH_AUTH.resetPassword} passHref>
            <Link variant="subtitle2">Forgot password?</Link>
          </NextLink>
        </Stack>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
    </FormProvider>
  )
}
