// next
import NextLink from 'next/link'
import { useRouter } from 'next/router'
// @mui
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  styled
} from '@mui/material'
// routes
import { PATH_DASHBOARD } from 'src/routes/paths'
// hooks
import useSettings from 'src/hooks/useSettings'
import useTable from 'src/hooks/useTable'
// layouts
import Layout from 'src/layouts'
// components
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/Iconify'
import Page from 'src/components/Page'
import Scrollbar from 'src/components/Scrollbar'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData
} from 'src/components/table'
// sections

import { useQuery } from '@tanstack/react-query'
import { queryFilterInstructors } from 'src/apis/instructor'
import useDebouncedState from 'src/hooks/useDebounceState'
import {
  InstructorTableRow,
  InstructorTableToolbar
} from 'src/sections/@dashboard/instructor/list'

// ----------------------------------------------------------------------

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

const TABLE_HEAD = [
  { id: 'instructorId', label: 'Instructor ID', align: 'left' },
  { id: 'name', label: 'Instructor Name', align: 'left' },
  { id: 'active_status', label: 'Status', align: 'left' },
  { id: '' }
]

// ----------------------------------------------------------------------

Instructorlist.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
// ----------------------------------------------------------------------

export default function Instructorlist() {
  const {
    dense,
    page,
    rowsPerPage,
    setPage,
    //
    setSelected,
    //
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage
  } = useTable({
    defaultDense: true
  })

  const { themeStretch } = useSettings()

  const { push } = useRouter()

  const [filterName, setFilterName] = useDebouncedState('', 700)

  const {
    data: usersQuery,
    isSuccess,
    isFetching,
    isFetched
  } = useQuery({
    queryKey: ['users/instructors', page, rowsPerPage, filterName],
    queryFn: async () =>
      await queryFilterInstructors(
        {
          name: filterName
        },
        {
          page: page + 1,
          rowsPerPage
        }
      )
  })

  const tableData = usersQuery && usersQuery.data && usersQuery.data.data

  const total = (usersQuery && usersQuery.data && usersQuery.data.total) || 0

  const denseHeight = dense ? 52 : 72

  const onFilterName = (filterName) => {
    setFilterName(filterName)
    setPage(0)
  }

  const handleDeleteRow = (id) => {
    setSelected([])
  }

  const handleEditRow = (id) => {
    push(PATH_DASHBOARD.instructor.edit(id))
  }

  const dataCount = tableData?.length ?? 0

  const isNotFound = isSuccess && isFetched && (!dataCount || !!filterName)

  const renderRegisterButton = () => {
    return (
      <NextLink href={PATH_DASHBOARD.instructor.new} passHref>
        <Button
          variant="contained"
          startIcon={<Iconify icon={'eva:edit-fill'} />}
        >
          Register Instructor
        </Button>
      </NextLink>
    )
  }

  return (
    <Page title="Instructor: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Instructor List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
            {
              name: 'Instructor Management',
              href: PATH_DASHBOARD.instructor.root
            },
            { name: 'Instructor List' }
          ]}
          action={
            <HeaderBreadcrumbsActionContainerStyle>
              {renderRegisterButton()}
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
          {renderRegisterButton()}
        </Box>
        <Card>
          <InstructorTableToolbar
            filterName={filterName}
            onFilterName={onFilterName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom headLabel={TABLE_HEAD} />

                <TableBody>
                  {tableData?.map((row) => (
                    <InstructorTableRow
                      key={row.id}
                      row={row}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
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
              rowsPerPageOptions={[1, 5, 10, 25]}
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
