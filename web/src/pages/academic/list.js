import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
  TablePagination
} from '@mui/material'
// routes
import { PATH_DASHBOARD } from 'src/routes/paths'
// hooks
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
import {
  AcademicTableRow,
  DeleteAcademicYearDialog
} from 'src/sections/@dashboard/academic/list'
// api
import {
  deleteAcademicYear,
  queryFilterAcademicPeriods
} from 'src/apis/academicPeriod'
// hooks
import useToggle from 'src/hooks/useToggle'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'academicYear', label: 'Academic Year', align: 'left' },
  { id: 'SemesterNumber', label: 'Semester', align: 'left' },
  { id: '' }
]

// ----------------------------------------------------------------------

AcademicYearlist.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
// ----------------------------------------------------------------------

export default function AcademicYearlist() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    onSelectRow,
    //
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage
  } = useTable({
    defaultDense: true
  })

  const { push } = useRouter()

  const {
    data: usersQuery,
    isSuccess,
    isFetching,
    isFetched
  } = useQuery({
    queryKey: ['academic-periods', page, rowsPerPage],
    queryFn: async () =>
      await queryFilterAcademicPeriods(
        {},
        {
          page: page + 1,
          rowsPerPage
        }
      )
  })

  const tableData = usersQuery && usersQuery.data && usersQuery.data.data

  const total = isFetching ? 0 : usersQuery.data.total

  const denseHeight = dense ? 52 : 72

  const handleViewRow = (id) => {
    push(PATH_DASHBOARD.academic.edit(id))
  }

  const handleDuplicateRow = (id) => {
    push(PATH_DASHBOARD.academic.duplicate(id))
  }

  const [academicYearId, setAcademicYearId] = useState(null)

  const {
    toggle: deleteDialogOpened,
    onOpen: onOpenConfirmDelete,
    onClose: onCloseConfirmDelete
  } = useToggle()

  const handleDeleteRow = (id) => {
    setAcademicYearId(id)
    onOpenConfirmDelete()
  }

  const queryClient = useQueryClient()

  const deleteAcademicYearMutation = useMutation({
    mutationFn: async (id) => await deleteAcademicYear(id)
  })

  const handleDeleteAcademicYear = async (id) => {
    try {
      await deleteAcademicYearMutation.mutateAsync(id)
      await queryClient.invalidateQueries({ queryKey: ['academic-periods'] })
      onCloseConfirmDelete()
    } catch (error) {
      console.error(error)
    }
  }

  const dataCount = tableData?.length ?? 0

  const isNotFound = isSuccess && isFetched && !dataCount

  return (
    <Page title="Academic Period List">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Academic Period List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
            {
              name: 'Academic Period Management',
              href: PATH_DASHBOARD.academic.root
            },
            { name: 'Academic Period List' }
          ]}
          action={
            <>
              <NextLink href={PATH_DASHBOARD.academic.new} passHref>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon={'eva:plus-fill'} />}
                >
                  Add Acedemic Year Semester
                </Button>
              </NextLink>
            </>
          }
        />

        <Card>
          <Scrollbar
            sx={{
              my: 2
            }}
          >
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  numSelected={selected.length}
                  rowCount={total}
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                />

                <TableBody>
                  {tableData?.map((row) => (
                    <AcademicTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      onRowDuplicate={() => handleDuplicateRow(row.id)}
                      onRowDelete={() => handleDeleteRow(row.id)}
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
              page={isFetching ? 0 : page}
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
        <DeleteAcademicYearDialog
          open={deleteDialogOpened}
          onClose={onCloseConfirmDelete}
          onConfirm={() => handleDeleteAcademicYear(academicYearId)}
          loading={deleteAcademicYearMutation.isLoading}
        />
      </Container>
    </Page>
  )
}

// ----------------------------------------------------------------------
