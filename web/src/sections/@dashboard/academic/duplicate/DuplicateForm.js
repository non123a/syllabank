import { joiResolver } from '@hookform/resolvers/joi'
import { LoadingButton } from '@mui/lab'
import { Box, Divider, Stack, Typography } from '@mui/material'
import Joi, { ref } from 'joi'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { FormProvider, RHFDatePicker } from 'src/components/hook-form'
import useResponsive from 'src/hooks/useResponsive'

// ----------------------------------------------------------------------

DuplicateForm.propTypes = {
  handleDuplicate: PropTypes.func,
  academicYearFrom: PropTypes.string
}

export default function DuplicateForm({ handleDuplicate, academicYearFrom }) {
  const isDesktop = useResponsive('up', 'lg')

  const isMobile = useResponsive('down', 'sm')

  const DuplicateSchema = Joi.object({
    startDate: Joi.date().required().messages({
      'any.required': 'Start date is required',
      'date.base': 'Invalid date value'
    }),

    endDate: Joi.date().greater(ref('startDate')).required().messages({
      'any.required': 'End date is required',
      'date.base': 'Invalid date value',
      'date.greater': 'End date must be greater than start date'
    })
  })

  const methods = useForm({
    resolver: joiResolver(DuplicateSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined
    }
  })

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty, isLoading, isValid, errors }
  } = methods

  return (
    <>
      <Stack
        direction={{
          xs: 'column',
          lg: 'row'
        }}
        spacing={2}
      >
        <Box>
          <Typography variant="overline" color="text.disabled" noWrap>
            From
          </Typography>
          <Typography variant="subtitle2" noWrap>
            {academicYearFrom}
          </Typography>
        </Box>
        <Divider orientation={isDesktop ? 'vertical' : 'horizontal'} flexItem />
        <Box flex={1}>
          <FormProvider methods={methods}>
            <Stack
              spacing={2}
              direction={{
                xs: 'column',
                lg: 'row'
              }}
              useFlexGap
            >
              <RHFDatePicker
                name="startDate"
                label="Start Date"
                views={['year']}
                openTo="year"
                helperText="Choose a new start date"
                slotProps={{
                  field: {
                    clearable: true,
                    size: isMobile ? 'small' : 'medium'
                  }
                }}
              />

              <RHFDatePicker
                name="endDate"
                label="End Date"
                views={['year']}
                openTo="year"
                helperText="Choose a new end date"
                slotProps={{
                  field: {
                    clearable: true,
                    size: isMobile ? 'small' : 'medium'
                  }
                }}
              />
            </Stack>
          </FormProvider>
        </Box>
      </Stack>
      <LoadingButton
        loading={isSubmitting || isLoading}
        variant="contained"
        onClick={() => handleSubmit(handleDuplicate)()}
        disabled={isSubmitting || !isDirty || !isValid}
        sx={{
          mt: 2
        }}
      >
        Duplicate
      </LoadingButton>
    </>
  )
}
