import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled
} from '@mui/material'
import PropTypes from 'prop-types'
import Scrollbar from 'src/components/Scrollbar'
import SectionTableRow from './SectionTableRow'

const HEADER = [
  'Class',
  'Type'
  // 'Action'
]

const CustomTableStyle = styled(Table)(({ theme }) => ({
  '& .MuiTableRow-root': {
    borderBottom: `solid 1px ${theme.palette.divider}`,
    '&:last-of-type': {
      borderBottom: 'none'
    },
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.action.hover
    }
  },
  '& .MuiTableCell-head': {
    '&:first-of-type': {
      boxShadow: `inset 8px 0 0 ${theme.palette.background.neutral}`
    },
    '&:last-of-type': {
      boxShadow: `inset 8px 0 0 ${theme.palette.background.neutral}`
    }
  }
}))

// ----------------------------------------------------------------------

SectionTable.propTypes = {
  sections: PropTypes.array
}

export default function SectionTable({ sections }) {
  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: (theme) => theme.breakpoints.values.sm }}>
        <CustomTableStyle padding="normal" size="small">
          <TableHead>
            <TableRow>
              {HEADER.map((item) => (
                <TableCell key={item}>{item}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map((row) => (
              <SectionTableRow key={row.id} row={row} onViewRow={() => {}} />
            ))}
          </TableBody>
        </CustomTableStyle>
      </TableContainer>
    </Scrollbar>
  )
}
