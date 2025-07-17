import PropTypes from 'prop-types'
import { Stack, Box } from '@mui/material'
// components
import EditSemesterForAcademicYearForm from './EditSemesterForAcademicYearForm'
import { fDate } from 'src/utils/formatTime'

// ----------------------------------------------------------------------

SemesterTableToolbar.propTypes = {
  currentAcademicYear: PropTypes.object
}

export default function SemesterTableToolbar({ currentAcademicYear }) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 2.5 }}>
      <Box flexGrow={1}>
        <Box
          component="h4"
          sx={{ typography: 'overline', color: 'text.secondary' }}
        >
          {fDate(currentAcademicYear?.start_date)}
        </Box>
        <Box component="h2" sx={{ typography: 'h5', color: 'text.primary' }}>
          {fDate(currentAcademicYear?.end_date)}
        </Box>
      </Box>
      <EditSemesterForAcademicYearForm
        currentAcademicYear={currentAcademicYear}
      />
    </Stack>
  )
}
