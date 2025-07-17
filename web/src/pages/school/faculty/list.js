import { useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import {
  Box,
  Card,
  Table,
  Switch,
  Button,
  Divider,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  FormControlLabel,
  CircularProgress
} from '@mui/material'
import { PATH_DASHBOARD } from 'src/routes/paths'
import useSettings from 'src/hooks/useSettings'
import useTable from 'src/hooks/useTable'
import Layout from 'src/layouts'
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
  FacultyTableToolbar,
  FacultyTableRow
} from 'src/sections/@dashboard/faculty/list'
import styled from '@emotion/styled'
import { useQueryClient } from '@tanstack/react-query'
import useDebouncedState from 'src/hooks/useDebounceState'
import useFaculty from 'src/hooks/queries/useFaculty'

const TABLE_HEAD = [
  { id: 'code_name', label: 'Faculty Code', align: 'left' },
  { id: 'full_name', label: 'Faculty Name', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'is_active', label: 'Status', align: 'left' },
  { id: '' }
]

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

FacultyList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default function FacultyList() {
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
  const { push } = useRouter()
  const queryClient = useQueryClient()

  const [filterSearch, setFilterSearch] = useDebouncedState('', 700)
  const [filterActive, setFilterActive] = useState('all')

  const toggleFacultyStatusMutation =
    useFaculty.toggleFacultyStatus(queryClient)
  const disableAFacultyMutation = useFaculty.disableAFaculty(queryClient)
  const enableAFacultyMutation = useFaculty.enableAFaculty(queryClient)

  const {
    data: facultiesQuery,
    isSuccess,
    isFetching,
    isFetched
  } = useFaculty.queryFilterFaculties(
    {
      page,
      rowsPerPage,
      filterSearch,
      filterActive
    },
    {
      search: filterSearch || null,
      status: filterActive === 'all' ? null : filterActive === 'active'
    },
    {
      page: page + 1,
      rowsPerPage
    }
  )

  const facultyData = facultiesQuery?.data || []

  const total = isFetching ? -1 : facultiesQuery?.total || 0

  const handleFilterSearch = (newFilterSearch) => {
    setFilterSearch(newFilterSearch)
    setPage(0)
  }

  const handleFilterActive = (event) => {
    const value = event.target.value
    setFilterActive(value)
    setPage(0)
  }

  const handleFilterFaculty = (event) => {
    const facultyValue = event.target.value
    setFilterSearch(facultyValue !== 'all' ? facultyValue : '')
    setPage(0)
  }

  const handleViewRow = (id) => {
    push(PATH_DASHBOARD.school.faculty.view(id))
  }

  const handleEditRow = (id) => {
    push(PATH_DASHBOARD.school.faculty.edit(id))
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleFacultyStatusMutation.mutateAsync({
        id,
        is_active: !currentStatus
      })
    } catch (error) {
      console.error('Failed to toggle faculty status:', error)
    }
  }

  const handleDisableRow = async (id) => {
    try {
      await disableAFacultyMutation.mutateAsync(id)
    } catch (error) {
      console.error('Failed to disable faculty:', error)
    }
  }

  const handleEnableRow = async (id) => {
    try {
      await enableAFacultyMutation.mutateAsync(id)
    } catch (error) {
      console.error('Failed to enable faculty:', error)
    }
  }

  const isNotFound =
    isSuccess &&
    isFetched &&
    (!facultyData.length ||
      (!!filterSearch && !facultyData.length) ||
      (!!filterActive && !facultyData.length))

  const renderCreateFacultyButton = () => (
    <NextLink href={PATH_DASHBOARD.school.faculty.new} passHref>
      <Button
        variant="contained"
        startIcon={<Iconify icon={'eva:plus-fill'} />}
      >
        Create Faculty
      </Button>
    </NextLink>
  )

  return (
    <Page title="Faculty: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Faculty List"
          links={[
            { name: 'Home' },
            {
              name: 'Faculty Management'
            },
            { name: 'Faculty List' }
          ]}
          action={
            <HeaderBreadcrumbsActionContainerStyle>
              {renderCreateFacultyButton()}
            </HeaderBreadcrumbsActionContainerStyle>
          }
        />

        <Card>
          <Divider />
          <FacultyTableToolbar
            filterSearch={filterSearch}
            filterActive={filterActive}
            onFilterSearch={handleFilterSearch}
            onFilterActive={handleFilterActive}
            onFilterFaculty={handleFilterFaculty}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {facultyData?.map((row) => (
                    <FacultyTableRow
                      key={row.id}
                      row={row}
                      onEditRow={() => handleEditRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      onDisableRow={() => handleDisableRow(row.id)}
                      onEnableRow={() => handleEnableRow(row.id)}
                      onToggleStatus={() =>
                        handleToggleStatus(row.id, row.is_active)
                      }
                    />
                  ))}
                  <TableEmptyRows
                    height={dense ? 52 : 72}
                    emptyRows={Math.max(0, rowsPerPage - facultyData.length)}
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
