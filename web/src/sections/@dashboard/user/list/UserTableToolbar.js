import PropTypes from 'prop-types'
import { useState } from 'react'
import {
  Stack,
  InputAdornment,
  TextField,
  MenuItem,
  CircularProgress
} from '@mui/material'
// components
import Iconify from 'src/components/Iconify'
import useDepartment from 'src/hooks/queries/useDepartment'
import useFaculty from 'src/hooks/queries/useFaculty'

// ----------------------------------------------------------------------

UserTableToolbar.propTypes = {
  filterDepartment: PropTypes.string,
  filterFaculty: PropTypes.string,
  filterActive: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterDepartment: PropTypes.func,
  onFilterFaculty: PropTypes.func,
  onFilterActive: PropTypes.func
}

export default function UserTableToolbar({
  filterDepartment,
  filterFaculty,
  filterActive,
  onFilterName,
  onFilterDepartment,
  onFilterFaculty,
  onFilterActive
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const {
    data: departmentsData,
    isLoading: isDepartmentsLoading,
    isError,
    error
  } = useDepartment.getAll({ enabled: isDropdownOpen })

  const {
    data: facultiesData,
    isLoading: isFacultiesLoading,
    isError: isFacultiesError,
    error: facultiesError
  } = useFaculty.getAll({ enabled: isDropdownOpen })

  const handleDropdownOpen = () => {
    setIsDropdownOpen(true)
  }

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ py: 2.5, px: 3 }}
    >
      <TextField
        fullWidth
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Search user..."
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
      />
      <TextField
        fullWidth
        select
        label="Status"
        value={filterActive}
        onChange={onFilterActive}
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
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="inactive">Inactive</MenuItem>
      </TextField>
      <TextField
        fullWidth
        select
        label="Department"
        value={filterDepartment}
        onChange={onFilterDepartment}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } }
          },
          onOpen: handleDropdownOpen
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize'
        }}
      >
        <MenuItem value="all">All Departments</MenuItem>
        {isDepartmentsLoading || departmentsData?.isFetching ? (
          <MenuItem disabled>Loading...</MenuItem>
        ) : isError ? (
          <MenuItem disabled>Error loading departments</MenuItem>
        ) : departmentsData?.data && departmentsData.data.length > 0 ? (
          departmentsData.data
            .filter((department) => !/staff/i.test(department.code_name))
            .map((department) => (
              <MenuItem key={department.id} value={department.code_name}>
                {department.code_name}
              </MenuItem>
            ))
        ) : (
          <MenuItem disabled>No departments available</MenuItem>
        )}
      </TextField>
      <TextField
        fullWidth
        select
        label="Faculty"
        value={filterFaculty}
        onChange={onFilterFaculty}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } }
          },
          onOpen: handleDropdownOpen
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize'
        }}
      >
        <MenuItem value="all">All Faculties</MenuItem>
        {isFacultiesLoading || facultiesData?.isFetching ? (
          <MenuItem disabled>Loading...</MenuItem>
        ) : isError ? (
          <MenuItem disabled>Error loading faculties</MenuItem>
        ) : facultiesData?.data && facultiesData.data.length > 0 ? (
          facultiesData.data.map((faculty) => (
            <MenuItem key={faculty.id} value={faculty.code_name}>
              {faculty.code_name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No faculties available</MenuItem>
        )}
      </TextField>
    </Stack>
  )
}
