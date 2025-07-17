import { Autocomplete, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

export default function RHFAutoComplete({ name, options, label, ...other }) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          onChange={(_, data) => {
            field.onChange(data)
          }}
          options={options}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!error}
              helperText={error?.message}
            />
          )}
          {...other}
        />
      )}
    />
  )
}
