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
import NewEditDepartmentForm from 'src/sections/@dashboard/department/NewEditDepartmentForm'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { queryDepartmentById } from 'src/apis/department'

// ----------------------------------------------------------------------

DepartmentEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function DepartmentEdit() {
  const { themeStretch } = useSettings()

  const router = useRouter()

  const id = router.query.id

  const query = useQuery({
    queryKey: ['departments', id],
    queryFn: async () => await queryDepartmentById(id),
    enabled: Boolean(id),
    retry: 1
  })

  const currentDepartment = query?.data

  if (query.isLoading) {
    return (
      <Page title="Edit Department">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit Department"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
              {
                name: 'Department List',
                href: PATH_DASHBOARD.school.department.list
              },
              { name: 'Edit Department' }
            ]}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Page>
    )
  }

  if (query.isSuccess && currentDepartment) {
    return (
      <Page title="Edit Department">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit Department"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
              {
                name: 'Department List',
                href: PATH_DASHBOARD.school.department.list
              },
              { name: 'Edit Department' }
            ]}
          />
          <NewEditDepartmentForm isEdit currentDepartment={currentDepartment} />
        </Container>
      </Page>
    )
  }

  return <></>
}
