// @mui
import { Container } from '@mui/material'
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
import NewEditInstructorForm from 'src/sections/@dashboard/instructor/NewEditInstructorForm'

// ----------------------------------------------------------------------

UserCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings()

  return (
    <Page title="Register Instructor">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Register Instructor"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Instructor List', href: PATH_DASHBOARD.instructor.list },
            { name: 'New user' }
          ]}
        />

        <NewEditInstructorForm />
      </Container>
    </Page>
  )
}
