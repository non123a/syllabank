import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
// form
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
// @mui
import {
  Stack,
  Card,
  CardContent,
  CardActionArea,
  CardActions
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
// components
import { FormProvider, RHFTextField } from 'src/components/hook-form'
import { ChangePassWord } from 'src/apis/setting'

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar()

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string()
      .required('New Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmNewPassword: Yup.string()
      .required('Confirm New Password is required')
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
  })

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  }

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  const onSubmit = async (data) => {
    try {
      await ChangePassWord(data)
      reset()
      enqueueSnackbar('Update success!')
    } catch (error) {
      enqueueSnackbar(error.response.data.message, {
        variant: 'error'
      })
      console.error(error)
    }
  }

  return (
    <Card>
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} alignItems="flex-end">
            <RHFTextField
              fullWidth
              name="oldPassword"
              type="password"
              label="Old Password"
            />

            <RHFTextField
              fullWidth
              name="newPassword"
              type="password"
              label="New Password"
            />

            <RHFTextField
              fullWidth
              name="confirmNewPassword"
              type="password"
              label="Confirm New Password"
            />

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Save Changes
            </LoadingButton>
          </Stack>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
