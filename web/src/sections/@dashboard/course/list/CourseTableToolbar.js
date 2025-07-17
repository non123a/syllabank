import PropTypes from 'prop-types'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material'
import Iconify from 'src/components/Iconify'
import useDebounce from 'src/hooks/useDebounce'

CourseTableToolbar.propTypes = {
  filterSearch: PropTypes.string,
  filterSemester: PropTypes.string,
  filterActive: PropTypes.string,
  onFilterSearch: PropTypes.func,
  onFilterSemester: PropTypes.func,
  onFilterActive: PropTypes.func,
  semesterOptions: PropTypes.array
}

export default function CourseTableToolbar({
  filterSearch,
  filterSemester,
  filterActive,
  onFilterSearch,
  onFilterSemester,
  onFilterActive,
  semesterOptions
}) {
  const [searchTerm, setSearchTerm] = useState(filterSearch)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const prevSearchTermRef = useRef('')

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
        placeholder="Search course subject, name, code, or author..."
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
    </Stack>
  )
}
