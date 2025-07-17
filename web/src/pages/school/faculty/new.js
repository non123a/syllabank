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
import NewEditFacultyForm from 'src/sections/@dashboard/faculty/NewEditFacultyForm'

// ----------------------------------------------------------------------

FacultyCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function FacultyCreate() {
  const { themeStretch } = useSettings()

  return (
    <Page title="Create Faculty">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create Faculty"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
            {
              name: 'Faculty List',
              href: PATH_DASHBOARD.school.faculty.list
            },
            { name: 'New Faculty' }
          ]}
        />
        <NewEditFacultyForm />
      </Container>
    </Page>
  )
}
