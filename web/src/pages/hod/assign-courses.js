import { useState, useEffect, useCallback } from 'react'
import NextLink from 'next/link'
import {
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Switch,
  Container,
  CircularProgress,
  Button,
  TableRow,
  TableCell
} from '@mui/material'
import { PATH_DASHBOARD } from 'src/routes/paths'
import useSettings from 'src/hooks/useSettings'
import useTable from 'src/hooks/useTable'
import Layout from 'src/layouts'
import Page from 'src/components/Page'
import Scrollbar from 'src/components/Scrollbar'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData
} from 'src/components/table'
import { useQuery } from '@tanstack/react-query'
import useDebouncedState from 'src/hooks/useDebounceState'
import AssignCourseTableRow from 'src/sections/@dashboard/hod/list/AssignCourseTableRow'
import AssignCourseTableToolbar from 'src/sections/@dashboard/hod/list/AssignCourseTableToolbar'
import {
  assignInstructorToCourse,
  fetchCourseAssignmentsData
} from 'src/apis/course'
import Iconify from 'src/components/Iconify'
import styled from '@emotion/styled'
import { useSnackbar } from 'notistack'
import { useQueryClient } from '@tanstack/react-query'
import useCourse from 'src/hooks/queries/useCourse'

AssignCourses.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

const TABLE_HEAD = [
  { id: 'code', label: 'Course Code', align: 'left' },
  { id: 'name', label: 'Course Name', align: 'left' },
  { id: 'academicYear', label: 'Academic Year', align: 'left' },
  { id: 'instructors', label: 'Assigned Instructors', align: 'left' },
  { id: 'headOfDepartment', label: 'Assigned by', align: 'left' },
  { id: 'is_active', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'center' }
]

export default function AssignCourses() {
  const { themeStretch } = useSettings()
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage
  } = useTable({
    defaultDense: true,
    defaultRowsPerPage: 5
  })

  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  const HeaderBreadcrumbsActionContainerStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    gap: theme.spacing(1),
    flexShrink: 0,
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  }))

  const [filterName, setFilterName] = useDebouncedState('', 700)
  const [filterAcademicYear, setFilterAcademicYear] = useState('all')
  const [filterSemester, setFilterSemester] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const {
    data: coursesQuery,
    isLoading,
    isSuccess,
    isFetched,
    isFetching,
    refetch
  } = useQuery(
    [
      'courseAssignments',
      filterName,
      filterAcademicYear,
      filterSemester,
      filterStatus,
      page,
      rowsPerPage
    ],
    () =>
      fetchCourseAssignmentsData(
        {
          search: filterName,
          academic_year_id:
            filterAcademicYear !== 'all' ? filterAcademicYear : undefined,
          semester_id: filterSemester !== 'all' ? filterSemester : undefined,
          is_active:
            filterStatus !== 'all' ? filterStatus === 'active' : undefined
        },
        {
          page: page + 1,
          rowsPerPage: rowsPerPage
        }
      ),
    {
      keepPreviousData: false,
      staleTime: 5000
    }
  )

  const courseData = coursesQuery?.data || []
  const total = coursesQuery?.total || 0
  const disableACourseAssignmentMutation =
    useCourse.disableACourseAssignment(queryClient)
  const enableACourseAssignmentMutation =
    useCourse.enableACourseAssignment(queryClient)

  const onFilterName = useCallback(
    (filterName) => {
      setFilterName(filterName)
      setPage(0)
    },
    [setFilterName, setPage]
  )

  const onFilterAcademicYear = useCallback(
    (event) => {
      setFilterAcademicYear(event.target.value)
      setFilterSemester('all')
      setPage(0)
    },
    [setFilterAcademicYear, setFilterSemester, setPage]
  )

  const onFilterSemester = useCallback(
    (event) => {
      if (event && event.target && event.target.value !== undefined) {
        setFilterSemester(event.target.value)
        setPage(0)
      } else {
        console.error('Invalid event or event.target.value is undefined')
      }
    },
    [setFilterSemester, setPage]
  )

  const onFilterStatus = useCallback(
    (event) => {
      setFilterStatus(event.target.value)
      setPage(0)
    },
    [setFilterStatus, setPage]
  )

  const handleAssignInstructor = async (courseAssignmentId, instructorIds) => {
    try {
      await assignInstructorToCourse(courseAssignmentId, instructorIds)
      enqueueSnackbar('Instructors assigned successfully', {
        variant: 'success'
      })
      refetch()
    } catch (error) {
      console.error('Error assigning instructors:', error)
      enqueueSnackbar(`Failed to assign instructors: ${error.message}`, {
        variant: 'error'
      })
    }
  }

  const handleDisableRow = async (id) => {
    try {
      await disableACourseAssignmentMutation.mutateAsync(id)
      refetch()
      enqueueSnackbar('Course assignment deactivated successfully', {
        variant: 'success'
      })
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Failed to deactivate course assignment', {
        variant: 'error'
      })
    }
  }

  const handleEnableRow = async (id) => {
    try {
      await enableACourseAssignmentMutation.mutateAsync(id)
      refetch()
      enqueueSnackbar('Course assignment activated successfully', {
        variant: 'success'
      })
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Failed to activate course assignment', {
        variant: 'error'
      })
    }
  }

  const renderCreateCourseButton = () => (
    <NextLink href={PATH_DASHBOARD.hod.course.new} passHref>
      <Button
        variant="contained"
        startIcon={<Iconify icon={'eva:plus-fill'} />}
      >
        Create Course
      </Button>
    </NextLink>
  )

  const dataCount = courseData?.length ?? 0
  const denseHeight = dense ? 52 : 72
  const isNotFound =
    (!isLoading && !dataCount) ||
    (isSuccess &&
      isFetched &&
      ((!dataCount && !!filterName) ||
        (!dataCount && !!filterAcademicYear) ||
        (!dataCount && !!filterSemester) ||
        (!dataCount && !!filterStatus)))

  useEffect(() => {
    refetch()
  }, [page, rowsPerPage, refetch])

  return (
    <Page title="Assign Courses">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Assign Courses to Instructors"
          links={[
            { name: 'Home', href: PATH_DASHBOARD.general.home },
            { name: 'HoD', href: PATH_DASHBOARD.hod.root },
            { name: 'Assign Courses' }
          ]}
          action={
            <HeaderBreadcrumbsActionContainerStyle>
              {renderCreateCourseButton()}
            </HeaderBreadcrumbsActionContainerStyle>
          }
        />

        <Card>
          <AssignCourseTableToolbar
            filterName={filterName}
            filterAcademicYear={filterAcademicYear}
            filterSemester={filterSemester}
            filterStatus={filterStatus}
            onFilterName={onFilterName}
            onFilterAcademicYear={onFilterAcademicYear}
            onFilterSemester={onFilterSemester}
            onFilterStatus={onFilterStatus}
            setPage={setPage}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={courseData?.length}
                />

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : isNotFound ? (
                    <TableNoData isNotFound={isNotFound} />
                  ) : (
                    <>
                      {courseData?.map((row) => (
                        <AssignCourseTableRow
                          key={row.assignment_id}
                          row={row}
                          onAssignInstructor={handleAssignInstructor}
                          onDisableRow={() =>
                            handleDisableRow(row.assignment_id)
                          }
                          onEnableRow={() => handleEnableRow(row.assignment_id)}
                        />
                      ))}
                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={Math.max(0, rowsPerPage - dataCount)}
                      />
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
            <Box
              sx={{
                px: 3,
                py: 1.5,
                top: 0,
                position: { md: 'absolute' },
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: {
                  xs: 'space-between',
                  md: 'flex-start'
                }
              }}
            >
              <FormControlLabel
                control={<Switch checked={dense} onChange={onChangeDense} />}
                label="Dense"
              />
              {isFetching && <CircularProgress size="1rem" />}
            </Box>
          </Box>
        </Card>
      </Container>
    </Page>
  )
}
