import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  CircularProgress,
  Typography
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { queryInstructors } from 'src/apis/user'

AssignInstructorDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  courseAssignmentId: PropTypes.string.isRequired,
  currentInstructors: PropTypes.array.isRequired
}

export default function AssignInstructorDialog({
  open,
  onClose,
  onConfirm,
  courseAssignmentId,
  currentInstructors
}) {
  const [search, setSearch] = useState('')
  const [selectedInstructors, setSelectedInstructors] = useState([])

  const { data: instructorsData, isLoading } = useQuery(
    ['instructors', search],
    () => queryInstructors({ search }),
    {
      enabled: open
    }
  )

  useEffect(() => {
    if (open) {
      setSelectedInstructors(currentInstructors)
    }
  }, [open, currentInstructors])

  const handleConfirm = () => {
    const selectedInstructorIds = selectedInstructors.map((instructor) =>
      Number(instructor.id)
    )
    onConfirm(courseAssignmentId, selectedInstructorIds)
    onClose()
  }

  const instructorOptions = useMemo(
    () =>
      instructorsData?.data?.data?.map((instructor) => ({
        id: instructor.id,
        name: instructor.name,
        email: instructor.email
      })) || [],
    [instructorsData]
  )

  const filteredOptions = useMemo(
    () =>
      instructorOptions.filter(
        (option) =>
          !selectedInstructors.some((selected) => selected.id === option.id)
      ),
    [instructorOptions, selectedInstructors]
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ mb: 2 }}>Assign Instructors</DialogTitle>
      <DialogContent>
        <Autocomplete
          multiple
          options={filteredOptions}
          getOptionLabel={(option) => option.name}
          value={selectedInstructors}
          onChange={(event, newValue) => setSelectedInstructors(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Search Instructors"
              fullWidth
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <div>
                <Typography variant="body1">{option.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.email}
                </Typography>
              </div>
            </li>
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
