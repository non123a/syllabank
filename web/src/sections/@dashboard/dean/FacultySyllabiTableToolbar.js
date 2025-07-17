import PropTypes from 'prop-types'
import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material'
import Iconify from 'src/components/Iconify'
import { useState, useEffect, useCallback } from 'react'
import useAcademicPeriod from 'src/hooks/queries/useAcademicPeriod'
import useDebounce from 'src/hooks/useDebounce'
import { fAcademicYear } from 'src/utils/formatTime'
import { getSemestersInAcademicYear } from 'src/apis/academicPeriod'
import { useQuery } from '@tanstack/react-query'

FacultySyllabiTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterAcademicYear: PropTypes.string,
  filterSemester: PropTypes.string,
  filterStatus: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterAcademicYear: PropTypes.func,
  onFilterSemester: PropTypes.func,
  onFilterStatus: PropTypes.func
}

export default function FacultySyllabiTableToolbar({
  filterName,
  filterAcademicYear,
  filterSemester,
  filterStatus,
  onFilterName,
  onFilterAcademicYear,
  onFilterSemester,
  onFilterStatus,
  setPage
}) {
  const [searchTerm, setSearchTerm] = useState(filterName)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const academicYearsQuery = useAcademicPeriod.getAll()

  const semestersQuery = useQuery({
    queryKey: ['semesters', filterAcademicYear],
    queryFn: () => getSemestersInAcademicYear(filterAcademicYear),
    enabled: !!filterAcademicYear && filterAcademicYear !== 'all'
  })

  useEffect(() => {
    onFilterName(debouncedSearchTerm)
  }, [debouncedSearchTerm, onFilterName])

  useEffect(() => {
    if (filterAcademicYear === 'all' || !filterAcademicYear) {
      onFilterSemester('all')
    }
  }, [filterAcademicYear, onFilterSemester])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const memoizedOnFilterStatus = useCallback(
    (event) => {
      onFilterStatus(event)
      setPage(0)
    },
    [onFilterStatus, setPage]
  )

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ py: 2.5, px: 3 }}
    >
      <TextField
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search course, instructor..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon={'eva:search-fill'}
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          )
        }}
        sx={{ flexGrow: 1 }}
      />

      <TextField
        fullWidth
        select
        label="Academic Year"
        value={filterAcademicYear}
        onChange={onFilterAcademicYear}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } }
          }
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize'
        }}
      >
        <MenuItem value="all">All</MenuItem>
        {academicYearsQuery.data?.data?.map((year) => (
          <MenuItem key={year.id} value={year.id.toString()}>
            {fAcademicYear(year.start_date, year.end_date)}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        select
        label="Semester"
        value={filterSemester}
        onChange={onFilterSemester}
        disabled={!filterAcademicYear || filterAcademicYear === 'all'}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } }
          }
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize'
        }}
      >
        <MenuItem value="all">All</MenuItem>
        {semestersQuery.data?.data?.map((semester) => (
          <MenuItem key={semester.id} value={semester.id.toString()}>
            Semester {semester.semester_number}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        select
        label="Status"
        value={filterStatus}
        onChange={memoizedOnFilterStatus}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } }
          }
        }}
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="inactive">Inactive</MenuItem>
      </TextField>
    </Stack>
  )
}
