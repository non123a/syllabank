import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'src/utils/axios'
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
  TablePagination,
  Button,
  Divider
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
import useDebouncedState from 'src/hooks/useDebounceState'
import { queryApprovedSyllabi } from 'src/apis/syllabus'
import ApprovedSyllabiTableToolbar from 'src/sections/@dashboard/syllabus/approved-syllabi/ApprovedSyllabiTableToolbar'
import ApprovedSyllabiTableRow from 'src/sections/@dashboard/syllabus/approved-syllabi/ApprovedSyllabiTableRow'
import { useSnackbar } from 'notistack'
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

FacultySyllabiList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default function FacultySyllabiList() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [filterName, setFilterName] = useDebouncedState('', 500)
  const [filterStatus, setFilterStatus] = useState('all')
  const { themeStretch } = useSettings()
  const { enqueueSnackbar } = useSnackbar()
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
    data: syllabiQuery,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['faculty-syllabi', page, rowsPerPage, filterName, filterStatus],
    queryFn: () =>
      queryApprovedSyllabi(
        {
          search: filterName,
          status: filterStatus !== 'all' ? filterStatus : undefined
        },
        {
          page: page + 1,
          rowsPerPage
        }
      ),
    keepPreviousData: true
  })

  useEffect(() => {
    refetch()
  }, [page, rowsPerPage, filterName, filterStatus])

  useEffect(() => {
    if (syllabiQuery?.data?.data) {
      setAllSyllabi(syllabiQuery.data.data)
    }
  }, [syllabiQuery])

  const handleOnFilterName = (value) => {
    setFilterName(value || '')
  }

  const handleOnFilterStatus = (event) => {
    setFilterStatus(event.target.value)
  }

  const handleViewDetails = (request) => {
    router.push(`/dean/${request.id}/preview`)
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

  const syllabi = syllabiQuery?.data?.data || []
  const total = syllabiQuery?.data?.meta?.total || 0
  const isNotFound = !isFetching && syllabi.length === 0

  return (
    <Page title="Faculty Syllabi">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Faculty Syllabi"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root
            },
            { name: 'Faculty Syllabi' }
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
