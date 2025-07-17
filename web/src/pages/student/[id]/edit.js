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
import UserNewEditForm from 'src/sections/@dashboard/user/UserNewEditForm'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { queryStudentById } from 'src/apis/student'

// ----------------------------------------------------------------------

StudentEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function StudentEdit() {
  const { themeStretch } = useSettings()

  const router = useRouter()

  const id = router.query.id

  const query = useQuery({
    queryKey: ['users/students', id],
    queryFn: async () => await queryStudentById(id),
    enabled: Boolean(id),
    retry: 1
  })

  const currentStudent = query.data?.data

  if (query.isLoading) {
    return (
      <Page title="Edit Student">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit Student"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
              { name: 'Student List', href: PATH_DASHBOARD.student.list },
              { name: 'Edit Student' }
            ]}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Page>
    )
  }

  if (query.isSuccess && currentStudent) {
    return (
      <Page title="Edit Student">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit Student"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
              { name: 'Student List', href: PATH_DASHBOARD.student.list },
              { name: 'Edit Student' }
            ]}
          />
          <UserNewEditForm isEdit currentUser={currentStudent} />
        </Container>
      </Page>
    )
  }

  return <></>
}
