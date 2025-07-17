import Joi from 'joi'
import { parseISO, startOfYear, endOfYear } from 'date-fns'
import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
// form
import { joiResolver } from '@hookform/resolvers/joi'
import { useFieldArray, useForm } from 'react-hook-form'
// @mui
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Card,
  CardActions,
  Divider,
  FormLabel,
  Stack,
  Typography
} from '@mui/material'
// components
// hooks
import useResponsive from 'src/hooks/useResponsive'
import {
  FormProvider,
  RHFDatePicker,
  RHFTextField
} from 'src/components/hook-form'
// utils
import { fDateField } from 'src/utils/formatTime'
// apis
import { createAcademicYearWithSemesters } from 'src/apis/academicPeriod'
import { IconButtonAnimate } from 'src/components/animate'
import Iconify from 'src/components/Iconify'
import { useSnackbar } from 'notistack'

// ----------------------------------------------------------------------

NewAcademicPeriodForm.propTypes = {}

export default function NewAcademicPeriodForm() {
  const isMobile = useResponsive('down', 'sm')

  const { enqueueSnackbar } = useSnackbar()

  const NewAcademicPeriodFormSchema = Joi.object({
    startDate: Joi.date().required().messages({
      'any.required': 'Start date is required',
      'date.base': 'Invalid date value'
    }),

    endDate: Joi.date().required().messages({
      'any.required': 'End date is required',
      'date.base': 'Invalid date value'
    }),

    semesters: Joi.array()
      .required()
      .min(1)
      .items(
        Joi.object({
          name: Joi.string().required().messages({
            'string.base': 'Semester name must be a string',
            'string.empty': 'Semester name cannot be empty',
            'any.required': 'Semester name is required'
          }),
          startDate: Joi.date().required().messages({
            'any.required': 'Semester start date is required',
            'date.base': 'Invalid date value'
          }),
          endDate: Joi.date().required().messages({
            'any.required': 'Semester end date is required',
            'date.base': 'Invalid date value'
          })
        }).messages({
          'array.base': 'Semesters must be an array',
          'array.empty': 'Semesters cannot be empty',
          'array.min': 'At least one semester is required'
        })
      )
  })

  const defaultValues = useMemo(
    () => ({
      startDate: undefined,
      endDate: undefined,
      semesters: []
    }),
    []
  )

  const methods = useForm({
    resolver: joiResolver(NewAcademicPeriodFormSchema),
    defaultValues
  })

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'semesters'
  })

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = methods

  const values = watch()

  const queryClient = useQueryClient()

  const onSubmit = async (data) => {
    try {
      const startYear = startOfYear(new Date(data.startDate))
      const endYear = endOfYear(new Date(data.endDate))
      await createAcademicYearWithSemesters({
        startDate: fDateField(startYear),
        endDate: fDateField(endYear),
        semesters: data.semesters.map((semester) => ({
          name: semester.name,
          startDate: fDateField(semester.startDate),
          endDate: fDateField(semester.endDate)
        }))
      })
      enqueueSnackbar('Create successfully', { variant: 'success' })
      reset(defaultValues, { keepValues: false })
      await queryClient.invalidateQueries('academic-periods')
      return
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
      console.error(error)
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', rowGap: 2 }}>
        <Box>
          <FormLabel>Academic Year</FormLabel>
          <Stack
            direction={{
              xs: 'column',
              sm: 'row'
            }}
            spacing={2}
            useFlexGap
            mt={2}
          >
            <RHFDatePicker
              name="startDate"
              label="Start Year"
              views={['year']}
              openTo="year"
              slotProps={{
                field: {
                  sx: {
                    flexGrow: 1
                  },
                  clearable: true,
                  size: isMobile ? 'small' : 'medium'
                }
              }}
              onChange={(newValue) => {
                if (newValue) {
                  const startOfYearDate = startOfYear(newValue)
                  methods.setValue('startDate', startOfYearDate)
                }
              }}
            />
            <RHFDatePicker
              name="endDate"
              label="End Year"
              views={['year']}
              openTo="year"
              slotProps={{
                field: {
                  sx: {
                    flexGrow: 1
                  },
                  clearable: true,
                  size: isMobile ? 'small' : 'medium'
                }
              }}
              onChange={(newValue) => {
                if (newValue) {
                  const endOfYearDate = endOfYear(newValue)
                  methods.setValue('endDate', endOfYearDate)
                }
              }}
            />
          </Stack>
        </Box>
        <Box
          sx={{
            border: 1,
            borderRadius: 1,
            padding: 2,
            borderColor: 'text.disabled'
          }}
        >
          <FormLabel>Academic Semesters</FormLabel>
          {fields.map((field, index) => (
            <Stack
              name={`semesters[${index}]`}
              direction={{
                xs: 'column',
                sm: 'row'
              }}
              spacing={2}
              key={field.id}
              sx={{ mt: 2 }}
              useFlexGap
              position="relative"
            >
              <RHFTextField
                fullWidth
                size={isMobile ? 'small' : 'medium'}
                name={`semesters[${index}].name`}
                label={`Semester Name`}
              />

              <RHFDatePicker
                fullWidth
                name={`semesters[${index}].startDate`}
                label={`Start Date`}
                openTo="year"
                slotProps={{
                  field: {
                    clearable: true,
                    size: isMobile ? 'small' : 'medium'
                  }
                }}
              />

              <RHFDatePicker
                fullWidth
                name={`semesters[${index}].endDate`}
                label={`End Date`}
                openTo="year"
                slotProps={{
                  field: {
                    clearable: true,
                    size: isMobile ? 'small' : 'medium'
                  }
                }}
              />

              <Divider
                sx={{
                  opacity: 0.6
                }}
                orientation="horizontal"
                flexItem
                variant="middle"
              />
            </Stack>
          ))}
          <Stack
            direction={{
              xs: 'column',
              sm: 'row'
            }}
            alignItems={{
              xs: 'flex-start',
              sm: 'center'
            }}
            justifyContent={{
              xs: 'flex-start'
            }}
            spacing={2}
            mt={2}
          >
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={() =>
                append({
                  name: '',
                  startDate: undefined,
                  endDate: undefined
                })
              }
            >
              Add
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => remove(fields.length - 1)}
              disabled={fields.length === 0}
            >
              Remove
            </Button>

            {errors?.semesters?.type === 'array.min' && (
              <Typography
                variant="overline"
                sx={{
                  color: 'error.main',
                  mt: 1
                }}
              >
                At least 1 semester is required
              </Typography>
            )}
          </Stack>
        </Box>
        <CardActions
          sx={{
            justifyContent: 'flex-end'
          }}
        >
          <LoadingButton
            startIcon={<Iconify icon="mdi:plus" />}
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Create
          </LoadingButton>
        </CardActions>
      </Card>
    </FormProvider>
  )
}
