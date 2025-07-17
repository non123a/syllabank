import PropTypes from 'prop-types'
import { Stack } from '@mui/material'
import { Fragment } from 'react'
import {
  FormProvider,
  RHFDatePicker,
  RHFTextField
} from 'src/components/hook-form'
import useResponsive from 'src/hooks/useResponsive'

// ----------------------------------------------------------------------

EditSemesterForm.propTypes = {
  methods: PropTypes.object
}

export default function EditSemesterForm({ methods }) {
  const isMobile = useResponsive('down', 'sm')

  return (
    <Fragment>
      <FormProvider methods={methods}>
        <Stack spacing={2}>
          <RHFTextField name="name" label="Name" placeholder="1" />
          <RHFDatePicker
            name="startDate"
            label="Start Date"
            slotProps={{
              field: {
                fullWidth: true,
                size: isMobile ? 'small' : 'medium',
                clearable: true
              }
            }}
          />
          <RHFDatePicker
            name="endDate"
            label="End Date"
            slotProps={{
              field: {
                size: isMobile ? 'small' : 'medium',
                clearable: true
              }
            }}
          />
        </Stack>
      </FormProvider>
    </Fragment>
  )
}
