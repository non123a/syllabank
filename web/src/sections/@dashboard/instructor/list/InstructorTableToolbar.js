import PropTypes from 'prop-types'
import { Box, InputAdornment, TextField } from '@mui/material'
// components
import Iconify from 'src/components/Iconify'
import useResponsive from 'src/hooks/useResponsive'

// ----------------------------------------------------------------------

InstructorTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterRole: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterRole: PropTypes.func,
  optionsRole: PropTypes.arrayOf(PropTypes.string)
}

export default function InstructorTableToolbar({ filterName, onFilterName }) {
  const isMobile = useResponsive('down', 'md')
  return (
    <Box sx={{ py: 1, px: 1 }}>
      <TextField
        size={isMobile ? 'small' : 'medium'}
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Email, name, or identification"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon={'eva:search-fill'}
                sx={{
                  color: 'text.disabled',
                  width: 20,
                  height: 200,
                  margin: '10px'
                }}
              />
            </InputAdornment>
          )
        }}
      />
    </Box>
  )
}
