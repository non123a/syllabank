import PropTypes from 'prop-types'
import { Fragment, useMemo } from 'react'
import { useSnackbar } from 'notistack'
import { useQueryClient } from '@tanstack/react-query'
// next
// form
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import { useForm } from 'react-hook-form'
// @mui
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography
} from '@mui/material'
// components
import {
  FormProvider,
  RHFDatePicker,
  RHFTextField
} from 'src/components/hook-form'
// hooks
import useResponsive from 'src/hooks/useResponsive'
import useToggle from 'src/hooks/useToggle'
// utils
import { fDateField } from 'src/utils/formatTime'
// api
import { createSemesterForAcademicYear } from 'src/apis/academicPeriod'

// ----------------------------------------------------------------------

EditSemesterForAcademicYearForm.propTypes = {
  currentAcademicYear: PropTypes.object.isRequired
}

export default function EditSemesterForAcademicYearForm({
  currentAcademicYear
}) {
  const queryClient = useQueryClient()

  const isMobile = useResponsive('down', 'sm')

  const { toggle, onOpen, onClose } = useToggle()

  const { enqueueSnackbar } = useSnackbar()

  const defaultValues = useMemo(
    () => ({
      name: '',
      startDate: undefined,
      endDate: undefined
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const AddSemesterForAcademicYearSchema = Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'Name is required',
      'string.base': 'Invalid name value',
      'string.empty': 'Name is required'
    }),
    startDate: Joi.date().required().messages({
      'any.required': 'Start date is required',
      'date.base': 'Invalid date value'
    }),
    endDate: Joi.date().required().messages({
      'any.required': 'End date is required',
      'date.base': 'Invalid date value'
    })
  })

  const methods = useForm({
    resolver: joiResolver(AddSemesterForAcademicYearSchema),
    defaultValues
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  const onSubmit = async (data) => {
    try {
      await createSemesterForAcademicYear({
        academicYearId: currentAcademicYear.id,
        semester: data.name,
        startDate: fDateField(data.startDate),
        endDate: fDateField(data.endDate)
      })
      reset(defaultValues, {
        keepValues: false
      })
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!')
      await queryClient.invalidateQueries({
        queryKey: ['academic-periods', currentAcademicYear.id]
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Fragment>
      <Button
        sx={{ mt: 2 }}
        variant="contained"
        onClick={onOpen}
        disabled={!currentAcademicYear}
      >
        Add Semester
      </Button>
      <FormProvider methods={methods}>
        <Dialog fullWidth open={toggle} onClose={onClose}>
          <DialogActions>
            <Typography variant="subtitle1">Semester</Typography>
            <Box flexGrow={1}></Box>
          </DialogActions>
          <DialogContent
            sx={{
              display: 'grid',
              rowGap: {
                xs: 2
              },
              columnGap: {
                md: 2
              }
            }}
          >
            <RHFTextField name="name" label="Name" placeholder="1" />
            <RHFDatePicker
              name="startDate"
              label="Start Date"
              slotProps={{
                field: {
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
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <LoadingButton
              onClick={() => handleSubmit(onSubmit)()}
              variant="contained"
              loading={isSubmitting}
            >
              Create
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </FormProvider>
    </Fragment>
  )
}
