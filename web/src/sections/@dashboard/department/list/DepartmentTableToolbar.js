import PropTypes from 'prop-types'
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Stack,
  InputAdornment,
  TextField,
  MenuItem,
  CircularProgress
} from '@mui/material'
import Iconify from 'src/components/Iconify'
import useDebounce from 'src/hooks/useDebounce'
import useFaculty from 'src/hooks/queries/useFaculty'

DepartmentTableToolbar.propTypes = {
  filterSearch: PropTypes.string,
  filterActive: PropTypes.string,
  filterFaculty: PropTypes.string,
  onFilterSearch: PropTypes.func,
  onFilterActive: PropTypes.func,
  onFilterFaculty: PropTypes.func
}

export default function DepartmentTableToolbar({
  filterSearch,
  filterActive,
  filterFaculty,
  onFilterSearch,
  onFilterActive,
  onFilterFaculty
}) {
  const [searchTerm, setSearchTerm] = useState(filterSearch)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const prevSearchTermRef = useRef('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const {
    data: facultiesData,
    isLoading: isFacultiesLoading,
    isError,
    error,
    refetch
  } = useFaculty.queryFilterFaculties({ enabled: isDropdownOpen })

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const memoizedOnFilterSearch = useCallback(onFilterSearch, [onFilterSearch])

  useEffect(() => {
    if (debouncedSearchTerm !== prevSearchTermRef.current) {
      prevSearchTermRef.current = debouncedSearchTerm
      memoizedOnFilterSearch(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm, memoizedOnFilterSearch])

  const handleDropdownOpen = () => {
    setIsDropdownOpen(true)

    refetch()
  }

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
        placeholder="Search department..."
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
