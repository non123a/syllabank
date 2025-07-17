import { joiResolver } from '@hookform/resolvers/joi'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import Joi from 'joi'
import { useSnackbar } from 'notistack'
import PropTypes from 'prop-types'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { updateSemesterForAcademicYear } from 'src/apis/academicPeriod'
import { fDateField } from 'src/utils/formatTime'
import EditSemesterForm from './EditSemesterForm'

// ----------------------------------------------------------------------

SemesterEditDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  semester: PropTypes.object,
  academicYearId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default function SemesterEditDialog({
  open,
  onClose,
  semester,
  academicYearId
}) {
  const queryClient = useQueryClient()

  const { enqueueSnackbar } = useSnackbar()

  const defaultValues = useMemo(
    () => ({
      name: String(semester?.number),
      startDate: semester?.start_date,
      endDate: semester?.end_date
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [semester]
  )

  const EditSemesterForAcademicYearSchema = Joi.object({
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
    resolver: joiResolver(EditSemesterForAcademicYearSchema),
    defaultValues
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isLoading, isDirty, isValid }
  } = methods

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const handleOnFormSubmit = async (data) => {
    try {
      await updateSemesterForAcademicYear({
        academicYearId: academicYearId,
        semesterId: semester.id,
        semester: data.name,
        startDate: fDateField(data.startDate),
        endDate: fDateField(data.endDate)
      })
      enqueueSnackbar('Academic year updated', { variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['academic-periods'] })
      onClose()
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: 'error' })
    }
  }

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogActions>
        <Typography variant="subtitle1">Edit Semester</Typography>
        <Box flex={1}></Box>
      </DialogActions>
      <DialogContent>
        {(() => {
          if (semester === null) {
            return null
          }

          return <EditSemesterForm methods={methods} />
        })()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" disabled={isSubmitting}>
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading || !isValid || !isDirty}
          onClick={() => handleSubmit(handleOnFormSubmit)()}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
