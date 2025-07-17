import PropTypes from 'prop-types'

import {
  Box,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow
} from '@mui/material'

import SemesterTableRow from './SemesterTableRow'
import SemesterTableToolbar from './SemesterTableToolbar'
import { SemesterEditDialog } from '.'
import useToggle from 'src/hooks/useToggle'
import { useState } from 'react'

// ----------------------------------------------------------------------

SemesterTable.propTypes = {
  currentAcademicYear: PropTypes.object,
  semesters: PropTypes.array
}

const TABLE_HEAD = ['Semester', 'Start Date', 'End Date', 'Actions']

export default function SemesterTable({ currentAcademicYear, semesters = [] }) {
  const [dialogSemester, setDialogSemester] = useState(null)

  const {
    toggle: isEditDialogOpen,
    onOpen: openEditDialog,
    onClose: closeEditDialog
  } = useToggle()

  const handleRowEdit = (semester) => {
    setDialogSemester(semester)
    openEditDialog()
  }

  return (
    <Card>
      <SemesterTableToolbar currentAcademicYear={currentAcademicYear} />
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: (theme) => theme.breakpoints.values.md }}
          size="small"
        >
          <TableHead>
            {
              <TableRow>
                {TABLE_HEAD.map((head) => (
                  <TableCell key={head} align="left">
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            }
          </TableHead>
          <TableBody>
            {semesters.map((row) => (
              <SemesterTableRow
                key={row.number}
                row={row}
                onRowDelete={() => console.log('delete')}
                onRowEdit={() => handleRowEdit(row)}
              />
            ))}

            {semesters.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No semesters found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Box my={4}></Box>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <SemesterEditDialog
        semester={dialogSemester}
        open={isEditDialogOpen}
        onClose={() => {
          setDialogSemester(null)
          closeEditDialog()
        }}
        academicYearId={currentAcademicYear.id}
      />
    </Card>
  )
}
