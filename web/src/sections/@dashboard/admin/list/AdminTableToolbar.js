import PropTypes from 'prop-types'
import { Stack, InputAdornment, TextField } from '@mui/material'
// components
import Iconify from 'src/components/Iconify'
import useResponsive from 'src/hooks/useResponsive'

// ----------------------------------------------------------------------

AdminTableToolbar.propTypes = {
  onFilterName: PropTypes.func
}

export default function AdminTableToolbar({ onFilterName }) {
  const isMobile = useResponsive('down', 'sm')

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ py: 2.5, px: 3 }}
    >
      <TextField
        fullWidth
        size={isMobile ? 'small' : 'medium'}
        onChange={onFilterName}
        placeholder="Search"
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
    </Stack>
  )
}
