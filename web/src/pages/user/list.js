import { useState } from 'react'
// next
import NextLink from 'next/link'
import { useRouter } from 'next/router'
// @mui
import {
  Box,
  Tab,
  Tabs,
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
// routes
import { PATH_DASHBOARD } from 'src/routes/paths'
// hooks
import useTabs from 'src/hooks/useTabs'
import useSettings from 'src/hooks/useSettings'
import useTable from 'src/hooks/useTable'
// layouts
import Layout from 'src/layouts'
// components
import Page from 'src/components/Page'
import Iconify from 'src/components/Iconify'
import Scrollbar from 'src/components/Scrollbar'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions
} from 'src/components/table'
// sections
import {
  UserTableToolbar,
  UserTableRow
} from 'src/sections/@dashboard/user/list'
import styled from '@emotion/styled'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useDebouncedState from 'src/hooks/useDebounceState'
import useUser from 'src/hooks/queries/useUser'
import { queryFilterUsers } from 'src/apis/user'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Email & ID', align: 'left' },
  { id: 'email', label: 'Username', align: 'left' },
  { id: 'department', label: 'Department', align: 'left' },
  { id: 'faculty', label: 'Faculty', align: 'left' },
  { id: 'roles', label: 'Roles', align: 'left' },
  { id: 'activeStatus', label: 'Status', align: 'left' },
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

// ----------------------------------------------------------------------

UserList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
// ----------------------------------------------------------------------

export default function UserList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage
  } = useTable({
    defaultDense: true
  })

  const { themeStretch } = useSettings()

  const { push } = useRouter()

  const [filterAcademicPeriod, setFilterAcademicPeriod] = useState('all')

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } =
    useTabs('all')

  const [filterName, setFilterName] = useDebouncedState('', 700)

  const [filterDepartment, setFilterDepartment] = useState('all')

  const [filterFaculty, setFilterFaculty] = useState('all')

  const [filterActive, setFilterActive] = useState('all')

  const queryClient = useQueryClient()

  const disableAUserMutation = useUser.disableAUser(queryClient)

  const enableAUserMutation = useUser.enableAUser(queryClient)

  const {
    data: usersQuery,
    isSuccess,
    isFetching,
    isFetched,
    refetch
  } = useQuery({
    queryKey: [
      'users',
      page,
      rowsPerPage,
      filterAcademicPeriod,
      filterStatus,
      filterName,
      filterDepartment,
      filterFaculty,
      filterActive
    ],
    queryFn: async () =>
      await queryFilterUsers(
        {
          role: filterStatus === 'all' ? null : filterStatus,
          department: filterDepartment === 'all' ? null : filterDepartment,
          faculty: filterFaculty === 'all' ? null : filterFaculty,
          is_active: filterActive === 'all' ? null : filterActive === 'active',
          search: filterName || null
        },
        {
          page: page + 1,
          rowsPerPage
        }
      )
  })

  const tableData = usersQuery && usersQuery.data && usersQuery.data.data

  const total = isFetching
    ? -1
    : (usersQuery && usersQuery.data && usersQuery.data.total) || 0

  const onFilterName = (filterName) => {
    setFilterName(filterName)
    setPage(0)
  }

  const onFilterDepartment = (e) => {
    setFilterDepartment(e.target.value)
    setPage(0)
  }

  const onFilterFaculty = (e) => {
    setFilterFaculty(e.target.value)
    setPage(0)
  }

  const onFilterActive = (e) => {
    setFilterActive(e.target.value)
    setPage(0)
  }

  const onFilterStatus = (...event) => {
    onChangeFilterStatus(...event)
    setPage(0)
  }

  const handleDeleteRow = (id) => {
    setSelected([])
  }

  const handleDeleteRows = (selected) => {
    setSelected([])
  }

  const handleOnViewRow = (id) => {
    push(PATH_DASHBOARD.user.profile(id))
  }

  const handleEditRow = (id) => {
    push(PATH_DASHBOARD.user.edit(id))
  }

  const handleDisableRow = async (id) => {
    try {
      await disableAUserMutation.mutateAsync({ id })
    } catch (error) {
      console.error(error)
    }
  }

  const handleEnableRow = async (id) => {
    try {
      await enableAUserMutation.mutateAsync({ id })
    } catch (error) {
      console.error(error)
    }
  }

  const dataCount = tableData?.length ?? 0

  const denseHeight = dense ? 52 : 72

  const isNotFound =
    isSuccess &&
    isFetched &&
    ((!dataCount && !!filterName) ||
      (!dataCount && !!filterAcademicPeriod) ||
      (!dataCount && !!filterStatus))

  const renderRegisterUserButton = () => {
    return (
      <NextLink href={PATH_DASHBOARD.user.new} passHref>
        <Button
          variant="contained"
          startIcon={<Iconify icon={'eva:edit-fill'} />}
        >
          Register User
        </Button>
      </NextLink>
    )
  }

  return (
    <Page title="User: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="User List"
          links={[
            { name: 'Home' },
            { name: 'User Management' },
            { name: 'User List' }
          ]}
          action={
            <HeaderBreadcrumbsActionContainerStyle>
              {renderRegisterUserButton()}
            </HeaderBreadcrumbsActionContainerStyle>
          }
        />

        <Box
          sx={(theme) => ({
            display: 'none',
            [theme.breakpoints.down('md')]: {
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              mb: 3,
              justifyContent: 'flex-end',
              [theme.breakpoints.down('sm')]: {
                flexDirection: 'column'
              }
            }
          })}
        >
          {renderRegisterUserButton()}
        </Box>

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {['all', 'Provost', 'Dean', 'hod', 'Instructor', 'Student'].map(
              (tab) => (
                <Tab
                  disableRipple
                  key={tab}
                  label={
                    tab.toLowerCase() === 'hod' ? 'Head of Department' : tab
                  }
                  value={tab}
                />
              )
            )}
          </Tabs>

          <Divider />

          <UserTableToolbar
            filterName={filterName}
            filterDepartment={filterDepartment}
            filterActive={filterActive}
            onFilterName={onFilterName}
            onFilterDepartment={onFilterDepartment}
            onFilterActive={onFilterActive}
            filterFaculty={filterFaculty}
            onFilterFaculty={onFilterFaculty}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {/* {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  rowCount={total}
                  numSelected={selected.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData?.map((row) => row.id)
                    )
                  }
                  onDeleteRows={() => handleDeleteRows(selected)}
                />
              )} */}
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  //   numSelected={selected.length}
                  //   rowCount={total}
                  //   order={order}
                  //   orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  //   onSelectAllRows={(checked) =>
                  //     onSelectAllRows(
                  //       checked,
                  //       tableData?.map((row) => row.id)
                  //     )
                  //   }
                />
                <TableBody>
                  {tableData?.map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onViewRow={() => handleOnViewRow(row.id)}
                      onDisableRow={handleDisableRow}
                      onEnableRow={handleEnableRow}
                      onRefetch={refetch}
                    />
                  ))}
                  <TableEmptyRows
                    emptyRows={dataCount > 0 ? rowsPerPage - dataCount : 0}
                    height={denseHeight}
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
