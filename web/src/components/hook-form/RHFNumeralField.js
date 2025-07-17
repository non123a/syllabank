import PropTypes from 'prop-types'
import { formatNumeral } from 'cleave-zen'
// form
import { useFormContext, Controller } from 'react-hook-form'
// @mui
import { TextField } from '@mui/material'

// ----------------------------------------------------------------------

RHFNumeralField.propTypes = {
  name: PropTypes.string
}

export default function RHFNumeralField({ name, numericalOptions, ...other }) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, ...restField },
        fieldState: { error }
      }) => (
        <TextField
          {...restField}
          onChange={(e) => {
            onChange(
              formatNumeral(e.target.value, {
                numeralPositiveOnly: true,
                stripLeadingZeroes: true,
                numeralDecimalScale: 0,
                numeralThousandsGroupStyle: 'none',
                ...numericalOptions
              })
            )
          }}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  )
}
