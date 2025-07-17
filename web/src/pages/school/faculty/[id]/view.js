import React from 'react'
import {
  Box,
  Card,
  Table,
  Switch,
  Divider,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  FormControlLabel,
  CircularProgress
} from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryFilterCourses } from 'src/apis/course'
import useSettings from 'src/hooks/useSettings'
import useTable from 'src/hooks/useTable'
import useDebouncedState from 'src/hooks/useDebounceState'
import Page from 'src/components/Page'
import Iconify from 'src/components/Iconify'
import Scrollbar from 'src/components/Scrollbar'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData
} from 'src/components/table'
import {
  CourseTableToolbar,
  CourseTableRow
} from 'src/sections/@dashboard/course/list'
import { PATH_DASHBOARD } from 'src/routes/paths'

const TABLE_HEAD = [
  { id: 'course_subject', label: 'Department / Subject', align: 'left' },
  { id: 'course_code', label: 'Course Code', align: 'left' },
  { id: 'course_name', label: 'Course Name', align: 'left' },
  { id: 'is_active', label: 'Status', align: 'left' },
  { id: '' }
]

const ViewOnlyCourseList = () => {
  const {
    dense,
    page,
    rowsPerPage,
    setPage,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage
  } = useTable({
    defaultDense: true
  })

  const { themeStretch } = useSettings()

  const [filterSemester, setFilterSemester] = React.useState('all')
  const [filterSearch, setFilterSearch] = useDebouncedState('', 700)
  const [filterActive, setFilterActive] = React.useState('all')

  const queryClient = useQueryClient()

  const {
    data: coursesQuery,
    isSuccess,
    isFetching,
    isFetched
  } = useQuery({
    queryKey: [
      'courses',
      page,
      rowsPerPage,
      filterSemester,
      filterSearch,
      filterActive
    ],
    queryFn: async () =>
      await queryFilterCourses(
        {
          semester_id: filterSemester === 'all' ? null : filterSemester,
          search: filterSearch || null,
          is_active: filterActive === 'all' ? null : filterActive === 'active'
        },
        {
          page: page + 1,
          rowsPerPage
        }
      )
  })

  const courseData = coursesQuery?.data?.data
  const total = isFetching ? -1 : coursesQuery?.data?.total || 0

  const onFilterSearch = (filterSearch) => {
    setFilterSearch(filterSearch)
    setPage(0)
  }

  const onFilterSemester = (event) => {
    setFilterSemester(event.target.value)
    setPage(0)
  }

  const onFilterActive = (event) => {
    setFilterActive(event.target.value)
    setPage(0)
  }

  const dataCount = courseData?.length ?? 0

  const denseHeight = dense ? 52 : 72

  const isNotFound =
    isSuccess &&
    isFetched &&
    ((!dataCount && !!filterSearch) ||
      (!dataCount && !!filterSemester) ||
      (!dataCount && !!filterActive))

  return (
    <Page title="Course: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Course List"
          links={[
            { name: 'Home', href: PATH_DASHBOARD.root },
            { name: 'Course Management', href: PATH_DASHBOARD.course.root },
            { name: 'Course List' }
          ]}
        />

        <Card>
          <Divider />

          <CourseTableToolbar
            filterSearch={filterSearch}
            filterSemester={filterSemester}
            filterActive={filterActive}
            onFilterSearch={onFilterSearch}
            onFilterSemester={onFilterSemester}
            onFilterActive={onFilterActive}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {courseData?.map((row) => (
                    <CourseTableRow key={row.id} row={row} />
                  ))}
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={dataCount > 0 ? rowsPerPage - dataCount : 0}
                  />
                  <TableNoData isNotFound={isNotFound} />
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

export default ViewOnlyCourseList
