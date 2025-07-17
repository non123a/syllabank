// @mui
import { Container } from '@mui/material'
// routes
import { PATH_DASHBOARD } from 'src/routes/paths'
// layouts
import Layout from 'src/layouts'
// components
import Page from 'src/components/Page'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
// sections
import { useRouter } from 'next/router'
import useAdmin from 'src/hooks/queries/useAdmin'
import { EditAdminForm } from 'src/sections/@dashboard/admin/edit'

// ----------------------------------------------------------------------

Edit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function Edit() {
  const router = useRouter()

  const { id } = router.query

  const adminQuery = useAdmin.getAdminById(
    id,
    {},
    {
      enabled: !!id
    }
  )

  return (
    <Page title="Edit Admin">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Edit HoD"
          links={[
            { name: 'HoD Management', href: PATH_DASHBOARD.hod.root },
            { name: 'List', href: PATH_DASHBOARD.hod.list },
            {
              name: adminQuery.isLoading
                ? 'Loading...'
                : String(adminQuery.data?.data?.email)
            }
          ]}
        />
        <EditAdminForm />
      </Container>
    </Page>
  )
}
