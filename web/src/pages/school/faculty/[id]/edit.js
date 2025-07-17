// @mui
import { Box, CircularProgress, Container } from '@mui/material'
// routes
import { PATH_DASHBOARD } from 'src/routes/paths'
// hooks
import useSettings from 'src/hooks/useSettings'
// layouts
import Layout from 'src/layouts'
// components
import Page from 'src/components/Page'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
// sections
import NewEditFacultyForm from 'src/sections/@dashboard/faculty/NewEditFacultyForm'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { queryFacultyById } from 'src/apis/faculty'

// ----------------------------------------------------------------------

FacultyEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function FacultyEdit() {
  const { themeStretch } = useSettings()

  const router = useRouter()

  const id = router.query.id

  const query = useQuery({
    queryKey: ['faculty', id],
    queryFn: async () => await queryFacultyById(id),
    enabled: Boolean(id),
    retry: 1
  })

  const currentFaculty = query?.data

  if (query.isLoading) {
    return (
      <Page title="Edit Faculty">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit Faculty"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
              {
                name: 'Faculty List',
                href: PATH_DASHBOARD.school.faculty.list
              },
              { name: 'Edit Faculty' }
            ]}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Page>
    )
  }

  if (query.isSuccess && currentFaculty) {
    return (
      <Page title="Edit Faculty">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit Faculty"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
              {
                name: 'Faculty List',
                href: PATH_DASHBOARD.school.faculty.list
              },
              { name: 'Edit Faculty' }
            ]}
          />
          <NewEditFacultyForm isEdit currentFaculty={currentFaculty} />
        </Container>
      </Page>
    )
  }

  return <></>
}
