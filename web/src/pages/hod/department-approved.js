import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'src/utils/axios'
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Paper,
  Typography,
  Checkbox
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
  TableNoData,
  TableSelectedActions
} from 'src/components/table'
import ApprovedSyllabiTableToolbar from 'src/sections/@dashboard/syllabus/approved-syllabi/ApprovedSyllabiTableToolbar'
import ApprovedSyllabiTableRow from 'src/sections/@dashboard/syllabus/approved-syllabi/ApprovedSyllabiTableRow'
import { queryApprovedSyllabi } from 'src/apis/syllabus'
import { useSnackbar } from 'notistack'
import useDebouncedState from 'src/hooks/useDebounceState'
import Iconify from 'src/components/Iconify'
import SyllabiMultiSelectModal from 'src/sections/@dashboard/syllabus/approved-syllabi/SyllabiMultiSelectModal'
import SyllabusTimelineModal from 'src/sections/@dashboard/syllabus/SyllabusTimelineModal'

const TABLE_HEAD = [
  { id: 'author_name', label: 'Instructor Name', align: 'left' },
  { id: 'syllabus_name', label: 'Syllabus Name', align: 'left' },
  { id: 'course', label: 'Course', align: 'left' },
  { id: 'sections', label: 'Sections', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'center' }
]

DepartmentSyllabiApproved.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default function DepartmentSyllabiApproved() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [filterName, setFilterName] = useDebouncedState('', 500)
  const [filterStatus, setFilterStatus] = useState('all')
  const { themeStretch } = useSettings()
  const { enqueueSnackbar } = useSnackbar()
  const [selected, setSelected] = useState([])
  const [openMultiSelectModal, setOpenMultiSelectModal] = useState(false)
  const [openTimelineModal, setOpenTimelineModal] = useState(false)
  const [selectedSyllabus, setSelectedSyllabus] = useState(null)
  const [allSyllabi, setAllSyllabi] = useState([])

  const {
    dense,
    page,
    rowsPerPage,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage
  } = useTable({
    defaultDense: true,
    defaultRowsPerPage: 5
  })

  const {
    data: syllabiRequestsQuery,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['approved-syllabi', page, rowsPerPage, filterName, filterStatus],
    queryFn: () =>
      queryApprovedSyllabi(
        {
          search: filterName,
          status: 'approved'
        },
        {
          page: page + 1,
          rowsPerPage
        }
      ),
    keepPreviousData: true
  })

  useEffect(() => {
    if (syllabiRequestsQuery?.data?.data) {
      setAllSyllabi(syllabiRequestsQuery.data.data)
    }
  }, [syllabiRequestsQuery])

  useEffect(() => {
    refetch()
  }, [page, rowsPerPage, filterName, filterStatus])

  const handleOnFilterName = (value) => {
    setFilterName(value || '')
  }

  const handleOnFilterStatus = (event) => {
    setFilterStatus(event.target.value)
  }

  const handleViewDetails = (request) => {
    router.push(`/provost/${request.id}/preview`)
  }

  const handleViewTimeline = (syllabus) => {
    setSelectedSyllabus(syllabus)
    setOpenTimelineModal(true)
  }

  const handleDownloadSyllabus = async (id) => {
    try {
      const response = await axios.get(
        `/syllabus/download-with-watermark/${id}`,
        {
          responseType: 'blob'
        }
      )
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `syllabus_${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    } catch (error) {
      console.error('Error downloading syllabus:', error)
      enqueueSnackbar('Failed to download syllabus', { variant: 'error' })
    }
  }

  const handleOpenMultiSelectModal = () => {
    setOpenMultiSelectModal(true)
  }

  const handleCloseMultiSelectModal = () => {
    setOpenMultiSelectModal(false)
  }

  const handleBulkDownload = async (selectedSyllabi) => {
    try {
      const ids = selectedSyllabi.map((syllabus) => syllabus.id)
      const response = await axios.post(
        '/syllabus/download',
        { ids },
        {
          responseType: 'blob'
        }
      )
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'syllabi.zip')
      document.body.appendChild(link)
      link.click()
      link.remove()
      enqueueSnackbar('Syllabi downloaded successfully', { variant: 'success' })
    } catch (error) {
      console.error('Error downloading syllabi:', error)
      enqueueSnackbar('Failed to download syllabi', { variant: 'error' })
    }
    handleCloseMultiSelectModal()
  }

  const handleCloseTimelineModal = () => {
    setOpenTimelineModal(false)
    setSelectedSyllabus(null)
  }

  const handleCommentAdded = () => {
    refetch()
  }

  const syllabi = syllabiRequestsQuery?.data?.data || []
  const total = syllabiRequestsQuery?.data?.meta?.total || 0
  const isNotFound = !isFetching && syllabi.length === 0

  return (
    <Page title="Approved Syllabi">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Approved Syllabi"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Provost', href: PATH_DASHBOARD.provost.syllabiRequests },
            { name: 'Approved Syllabi' }
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:download-outline" />}
              onClick={handleOpenMultiSelectModal}
            >
              Bulk Download
            </Button>
          }
        />
        <Card>
          <Divider />
          <ApprovedSyllabiTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleOnFilterName}
            onFilterStatus={handleOnFilterStatus}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {syllabi.map((row) => (
                    <ApprovedSyllabiTableRow
                      key={row.id}
                      row={row}
                      onViewDetails={handleViewDetails}
                      onViewTimeline={() => handleViewTimeline(row)}
                      onDownloadSyllabus={() => handleDownloadSyllabus(row.id)}
                    />
                  ))}
                  <TableEmptyRows
                    height={dense ? 52 : 72}
                    emptyRows={Math.max(0, rowsPerPage - syllabi.length)}
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
              onPageChange={(event, newPage) => onChangePage(newPage)}
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

      <SyllabiMultiSelectModal
        open={openMultiSelectModal}
        onClose={handleCloseMultiSelectModal}
        onSubmit={handleBulkDownload}
        syllabi={allSyllabi}
      />

      <SyllabusTimelineModal
        open={openTimelineModal}
        onClose={handleCloseTimelineModal}
        syllabus={selectedSyllabus}
        onCommentAdded={handleCommentAdded}
      />
    </Page>
  )
}
