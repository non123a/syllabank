import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  OutlinedInput,
  Stack,
  Typography,
  Button,
  TextField
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { verify2FA } from 'src/apis/auth'
import useAuth from 'src/hooks/useAuth'

export default function VerifyCodeForm() {
  const { push } = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [isRecoveryCode, setIsRecoveryCode] = useState(false)
  const { refetchUserProfile } = useAuth()

  const VerifyCodeSchema = Yup.object().shape(
    isRecoveryCode
      ? {
          recovery_code: Yup.string().required('Recovery code is required')
        }
      : {
          code1: Yup.string().required('Code is required'),
          code2: Yup.string().required('Code is required'),
          code3: Yup.string().required('Code is required'),
          code4: Yup.string().required('Code is required'),
          code5: Yup.string().required('Code is required'),
          code6: Yup.string().required('Code is required')
        }
  )

  const defaultValues = isRecoveryCode
    ? { recovery_code: '' }
    : {
        code1: '',
        code2: '',
        code3: '',
        code4: '',
        code5: '',
        code6: ''
      }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues
  })

  const onSubmit = async (data) => {
    try {
      let payload
      if (isRecoveryCode) {
        payload = { recovery_code: data.recovery_code }
      } else {
        payload = { code: Object.values(data).join('') }
      }
      await verify2FA(payload)
      await refetchUserProfile()
      enqueueSnackbar('Verification successful!')
    } catch (error) {
      console.error(error)
      enqueueSnackbar(
        error.response?.data?.message ||
          'Verification failed. Please try again.',
        {
          variant: 'error'
        }
      )
    }
  }

  const handleChangeWithNextField = (event, handleChange, fieldIndex) => {
    const { value } = event.target
    handleChange(event)

    if (value.length === 1 && fieldIndex < 6) {
      const nextField = document.querySelector(
        `input[name=code${fieldIndex + 1}]`
      )
      if (nextField) {
        nextField.focus()
      }
    }
  }

  const handleKeyDown = (event, fieldIndex) => {
    if (event.key === 'Backspace' && !event.target.value && fieldIndex > 1) {
      const prevField = document.querySelector(
        `input[name=code${fieldIndex - 1}]`
      )
      if (prevField) {
        prevField.focus()
      }
    }
  }

  const toggleCodeType = () => {
    setIsRecoveryCode(!isRecoveryCode)
    reset(isRecoveryCode ? defaultValues : { recovery_code: '' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Typography variant="h6" align="center">
          {isRecoveryCode ? 'Enter Recovery Code' : 'Enter 6-Digit Code'}
        </Typography>

        {isRecoveryCode ? (
          <Controller
            name="recovery_code"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Recovery Code"
                variant="outlined"
              />
            )}
          />
        ) : (
          <Stack direction="row" spacing={2} justifyContent="center">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Controller
                key={`code${index}`}
                name={`code${index}`}
                control={control}
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    id={`field-code-${index}`}
                    autoFocus={index === 1}
                    placeholder="-"
                    onChange={(event) =>
                      handleChangeWithNextField(event, field.onChange, index)
                    }
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    inputProps={{
                      maxLength: 1,
                      sx: {
                        p: 0,
                        textAlign: 'center',
                        width: { xs: 36, sm: 56 },
                        height: { xs: 36, sm: 56 }
                      }
                    }}
                  />
                )}
              />
            ))}
          </Stack>
        )}

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={!isValid}
        >
          Verify
        </LoadingButton>

        <Button onClick={toggleCodeType} variant="text">
          {isRecoveryCode ? 'Use 6-Digit Code' : 'Use Recovery Code'}
        </Button>
      </Stack>
    </form>
  )
}
