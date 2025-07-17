import PropTypes from 'prop-types'
import { Stack, TableCell, TableRow, Typography } from '@mui/material'
import { capitalCase } from 'change-case'

// ----------------------------------------------------------------------

SectionTableRow.propTypes = {
  row: PropTypes.object,
  onViewRow: PropTypes.func
}

export default function SectionTableRow({ row, onViewRow }) {
  return (
    <TableRow>
      <TableCell align="left">
        <Stack>
          <Typography variant="overline">
            Section {row.sectionNumber}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontStyle: 'italic'
            }}
          >
            {row.class.class_name}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align="left">
        <ClassTypeLabel type={row.class.type}>
          {capitalCase(row.class.type)}
        </ClassTypeLabel>
      </TableCell>
      {/* <TableCell align="left">
        <LoadingButton
          variant="contained"
          size="small"
          startIcon={<Iconify icon={'eva:eye-fill'} />}
          onClick={() => {
            onViewRow()
          }}
        >
          View
        </LoadingButton>
      </TableCell> */}
    </TableRow>
  )
}
