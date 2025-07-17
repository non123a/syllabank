import React from 'react'
import PropTypes from 'prop-types'
import { DateField, DatePicker } from '@mui/x-date-pickers'
import { Controller, useFormContext } from 'react-hook-form'
import _, { isNull } from 'lodash'
import { fDateField } from 'src/utils/formatTime'
import { parseISO } from 'date-fns'

RHFDateField.propTypes = {
  name: PropTypes.string
}

export function RHFDateField({ name, ...other }) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DateField
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  )
}

export function RHFDatePicker({ name, slotProps, helperText, ...other }) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, ref, value, ...field },
        fieldState: { error }
      }) => (
        <DatePicker
          defaultValue={value}
          value={parseISO(value)}
          inputRef={ref}
          slotProps={_.merge(
            {
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message || helperText,
                ...field
              }
            },
            slotProps
          )}
          onChange={(value) => {
            if (isNull(value)) {
              value = undefined
              onChange(value)
              return
            }
            onChange(fDateField(value))
          }}
          {...other}
        />
      )}
    />
  )
}
