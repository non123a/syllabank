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
  DepartmentTableToolbar,
  DepartmentTableRow
} from 'src/sections/@dashboard/department/list'
import styled from '@emotion/styled'
import { useQueryClient } from '@tanstack/react-query'
import useDebouncedState from 'src/hooks/useDebounceState'
import useDepartment from 'src/hooks/queries/useDepartment'

const TABLE_HEAD = [
  { id: 'code_name', label: 'Department Code', align: 'left' },
  { id: 'full_name', label: 'Department Name', align: 'left' },
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

DepartmentList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default function DepartmentList() {
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
  const [filterFaculty, setFilterFaculty] = useState('all')

  const toggleDepartmentStatusMutation =
    useDepartment.toggleDepartmentStatus(queryClient)
  const disableADepartmentMutation =
    useDepartment.disableADepartment(queryClient)
  const enableADepartmentMutation = useDepartment.enableADepartment(queryClient)

  const {
    data: departmentsQuery,
    isSuccess,
    isFetching,
    isFetched
  } = useDepartment.queryFilterDepartment(
    {
      page,
      rowsPerPage,
      filterSearch,
      filterActive,
      filterFaculty
    },
    {
      search: filterSearch || null,
      status: filterActive === 'all' ? null : filterActive === 'active',
      faculty_id: filterFaculty === 'all' ? null : filterFaculty
    },
    {
      page: page + 1,
      rowsPerPage
    }
  )

  const departmentData = departmentsQuery?.data || []

  const total = isFetching ? -1 : departmentsQuery?.total || 0

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
    setFilterFaculty(facultyValue)
    setFilterSearch(facultyValue !== 'all' ? facultyValue : '')
    setPage(0)
  }

  const handleViewRow = (id) => {
    push(PATH_DASHBOARD.school.department.view(id))
  }

  const handleEditRow = (id) => {
    push(PATH_DASHBOARD.school.department.edit(id))
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleDepartmentStatusMutation.mutateAsync({
        id,
        is_active: !currentStatus
      })
    } catch (error) {
      console.error('Failed to toggle department status:', error)
    }
  }

  const handleDisableRow = async (id) => {
    try {
      await disableADepartmentMutation.mutateAsync(id)
    } catch (error) {
      console.error('Failed to disable department:', error)
    }
  }

  const handleEnableRow = async (id) => {
    try {
      await enableADepartmentMutation.mutateAsync(id)
    } catch (error) {
      console.error('Failed to enable department:', error)
    }
  }

  const isNotFound =
    isSuccess &&
    isFetched &&
    (!departmentData.length ||
      (!!filterSearch && !departmentData.length) ||
      (!!filterActive && !departmentData.length))

  const renderCreateDepartmentButton = () => (
    <NextLink href={PATH_DASHBOARD.school.department.new} passHref>
      <Button
        variant="contained"
        startIcon={<Iconify icon={'eva:plus-fill'} />}
      >
        Create Department
      </Button>
    </NextLink>
  )

  return (
    <Page title="Department: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Department List"
          links={[
            { name: 'Home' },
            { name: 'Department Management' },
            { name: 'Department List' }
          ]}
          action={
            <HeaderBreadcrumbsActionContainerStyle>
              {renderCreateDepartmentButton()}
            </HeaderBreadcrumbsActionContainerStyle>
          }
        />

        <Card>
          <Divider />
          <DepartmentTableToolbar
            filterSearch={filterSearch}
            filterActive={filterActive}
            filterFaculty={filterFaculty}
            onFilterSearch={handleFilterSearch}
            onFilterActive={handleFilterActive}
            onFilterFaculty={handleFilterFaculty}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {departmentData?.map((row) => (
                    <DepartmentTableRow
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
                    emptyRows={Math.max(0, rowsPerPage - departmentData.length)}
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
