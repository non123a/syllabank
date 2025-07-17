import PropTypes from 'prop-types'
import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material'
import Iconify from 'src/components/Iconify'
import { useState, useEffect } from 'react'
import useDebounce from 'src/hooks/useDebounce'

SyllabiRequestVouchingTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterStatus: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterStatus: PropTypes.func
}

export default function SyllabiRequestVouchingTableToolbar({
  filterName,
  filterStatus,
  onFilterName,
  onFilterStatus
}) {
  const [searchTerm, setSearchTerm] = useState(filterName)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    onFilterName(debouncedSearchTerm)
  }, [debouncedSearchTerm, onFilterName])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
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
        placeholder="Search syllabi request..."
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
        value={filterStatus}
        onChange={onFilterStatus}
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
        <MenuItem value="approved">Approved</MenuItem>
        <MenuItem value="draft">Draft</MenuItem>
        <MenuItem value="submit_to_head_of_department">
          Submit to Head of Department
        </MenuItem>
        <MenuItem value="vouched_to_dean">Vouched to Dean</MenuItem>
        <MenuItem value="accepted_by_provost">Accepted by Provost</MenuItem>
      </TextField>
    </Stack>
  )
}
