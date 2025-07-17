import {
  Box,
  Card,
  CircularProgress,
  Container,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import React from 'react'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import Scrollbar from 'src/components/Scrollbar'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData
} from 'src/components/table'
import useAdmin from 'src/hooks/queries/useAdmin'
import useDebouncedState from 'src/hooks/useDebounceState'
import useTable from 'src/hooks/useTable'
import Layout from 'src/layouts'
import { PATH_DASHBOARD } from 'src/routes/paths'
import {
  AdminTableRow,
  AdminTableToolbar
} from 'src/sections/@dashboard/admin/list'

List.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default function List() {
  const router = useRouter()

  const queryClient = useQueryClient()

  const [filterName, setFilterName] = useDebouncedState('', 500)

  const {
    dense,
    page,
    rowsPerPage,
    //
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage
  } = useTable({
    defaultDense: true
  })

  const adminsQuery = useAdmin.queryFilterAdmins(
    {},
    {
      name: filterName
    },
    {
      rowsPerPage,
      page: page + 1
    }
  )

  const enableAdminMutation = useAdmin.enableAdmin(queryClient)

  const disableAdminMutation = useAdmin.disableAdmin(queryClient)

  const handleOnFilterName = (event) => {
    setFilterName(event.target.value)
  }

  const handleEditRow = (id) => {
    router.push(PATH_DASHBOARD.admin.edit(id))
  }

  const handleDeleteRow = () => {}

  const handleDisableRow = async (id) => {
    try {
      await disableAdminMutation.mutateAsync(id)
    } catch (error) {
      console.error(error)
    }
  }

  const handleEnableRow = async (id) => {
    try {
      await enableAdminMutation.mutateAsync(id)
    } catch (error) {
      console.error(error)
    }
  }

  const dataCount = adminsQuery.data?.data?.data?.length || 0

  const isNotFound = dataCount === 0 && adminsQuery.isFetched

  const total = adminsQuery.isFetching ? 0 : adminsQuery?.data?.data.total || 0

  const denseHeight = dense ? 52 : 72

  return (
    <Page title="Admin List">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="List"
          links={[
            { name: 'Provost Management', href: PATH_DASHBOARD.admin.root },
            { name: 'List' }
          ]}
        />
        <Card>
          <AdminTableToolbar onFilterName={handleOnFilterName} />
          <Scrollbar>
            <TableContainer
              sx={{ minWidth: (theme) => theme.breakpoints.values.sm }}
            >
              <Table size="small">
                <TableHeadCustom
                  headLabel={[
                    { id: 'identification', label: 'Identification' },
                    { id: 'name', label: 'Name' },
                    { id: 'is_active', label: 'Status' },
                    { id: '' }
                  ]}
                />
                <TableBody>
                  {adminsQuery.data?.data?.data.map((row) => (
                    <AdminTableRow
                      key={row.id}
                      row={row}
                      onEditRow={() => handleEditRow(row.id)}
                      onDeleteRow={handleDeleteRow}
                      onDisableRow={() => handleDisableRow(row.id)}
                      onEnableRow={() => handleEnableRow(row.id)}
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
              page={adminsQuery.isFetching ? 0 : page}
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
              {adminsQuery.isFetching && <CircularProgress size="1rem" />}
            </Box>
          </Box>
        </Card>
      </Container>
    </Page>
  )
}
