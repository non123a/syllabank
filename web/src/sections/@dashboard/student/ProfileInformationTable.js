import PropTypes from 'prop-types'
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.selected
  },
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

const TABLE_HEAD = [
  { id: 'studentId', label: 'Student ID', align: 'left' },
  { id: 'name', label: 'Student Name', align: 'left' },
  { id: 'studentLevel', label: 'English Level', align: 'left' },
  { id: 'activeStatus', label: 'Status', align: 'left' },
  { id: 'dateRegistered', label: 'Registered On', align: 'left' },
  { id: 'lastEnrolled', label: 'Last Enrolled', align: 'left' }
]

ProfileInformationTable.propTypes = {
  studentId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  studentLevel: PropTypes.string.isRequired,
  activeStatus: PropTypes.string.isRequired,
  dateRegistered: PropTypes.string.isRequired,
  lastEnrolled: PropTypes.string
}

export default function ProfileInformationTable({
  studentId,
  name,
  studentLevel,
  activeStatus,
  dateRegistered,
  lastEnrolled
}) {
  const data = {
    studentId,
    name,
    studentLevel,
    activeStatus,
    dateRegistered,
    lastEnrolled
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableBody>
          {TABLE_HEAD.map((headCell) => (
            <StyledTableRow key={headCell.id}>
              <TableCell align="left">{headCell.label}</TableCell>
              <TableCell align="left">{data[headCell.id]}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
