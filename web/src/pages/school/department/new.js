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
import DepartmentNewEditForm from 'src/sections/@dashboard/department/NewEditDepartmentForm'

// ----------------------------------------------------------------------

DepartmentCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function DepartmentCreate() {
  const { themeStretch } = useSettings()

  return (
    <Page title="Create Department">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create Department"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
            {
              name: 'Department List',
              href: PATH_DASHBOARD.school.department.list
            },
            { name: 'New Department' }
          ]}
        />
        <DepartmentNewEditForm />
      </Container>
    </Page>
  )
}
