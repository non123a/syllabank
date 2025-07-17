import PropTypes from 'prop-types'
// form
import { useFormContext, Controller } from 'react-hook-form'
// @mui
import { TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

// ----------------------------------------------------------------------

RHFDateTimePicker.propTypes = {
  name: PropTypes.string,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  onError: PropTypes.func
}

export default function RHFDateTimePicker({
  name,
  required,
  readOnly = false,
  onError,
  ...other
}) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DateTimePicker
          {...field}
          {...other}
          PopperProps={{
            placement: 'top-start'
          }}
          onError={onError}
          renderInput={(params) => (
            <TextField
              {...params}
              error={!!error}
              helperText={error?.message}
              required={required}
              inputProps={{
                ...params.inputProps,
                readOnly
              }}
            />
          )}
        />
      )}
    />
  )
}
