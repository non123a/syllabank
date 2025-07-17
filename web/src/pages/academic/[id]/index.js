import { useEffect, useState } from 'react'
// @mui
import { Box, CircularProgress, Container } from '@mui/material'
// routes
import { PATH_DASHBOARD } from 'src/routes/paths'
// hooks
import useSettings from 'src/hooks/useSettings'
// layouts
import Layout from 'src/layouts'
// components
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
// sections
import { getAcademicYear } from 'src/apis/academicPeriod'
import SemesterTable from 'src/sections/@dashboard/academic/semester/SemesterTable'
import { fDateYear } from 'src/utils/formatTime'
// third-parties
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

// ----------------------------------------------------------------------

AcademicYearEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function AcademicYearEdit() {
  //
  const { themeStretch } = useSettings()

  const [currentAcademicYear, setCurrentAcademicYear] = useState(null)

  const router = useRouter()

  const { id } = router.query

  const query = useQuery({
    queryKey: ['academic-periods', id],
    queryFn: async () => await getAcademicYear(id),
    enabled: Boolean(id),
    retry: 1
  })

  const {
    data: academicYear,
    isFetching,
    isLoading,
    error,
    isError,
    isSuccess
  } = query

  useEffect(() => {
    if (isSuccess) {
      setCurrentAcademicYear(academicYear.data)
    }
    if (isError) {
      switch (error.response.status) {
        case 404:
          router.push(PATH_DASHBOARD.academic.list)
          break
        default:
          console.error(error)
      }
    }
  }, [isSuccess, isError, isFetching])

  if (isLoading) {
    return (
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (isSuccess && currentAcademicYear) {
    return (
      <Page
        title={`Edit Academic Period - ${fDateYear(
          currentAcademicYear.start_date
        )}-${fDateYear(currentAcademicYear.end_date)}`}
      >
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit Academic Period"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
              {
                name: 'Academic Period List',
                href: PATH_DASHBOARD.academic.list
              },
              { name: 'Edit Academic Period' }
            ]}
          />

          <SemesterTable
            currentAcademicYear={currentAcademicYear}
            semesters={currentAcademicYear?.semesters}
          />
        </Container>
      </Page>
    )
  }

  return <></>
}
