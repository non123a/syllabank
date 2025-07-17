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
import { queryUserById } from 'src/apis/user'

// ----------------------------------------------------------------------

UserEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function UserEdit() {
  const { themeStretch } = useSettings()

  const router = useRouter()

  const id = router.query.id

  const query = useQuery({
    queryKey: ['users', id],
    queryFn: async () => await queryUserById(id),
    enabled: Boolean(id),
    retry: 1
  })

  const currentUser = query.data?.data

  if (query.isLoading) {
    return (
      <Page title="Edit User">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit User"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
              { name: 'User List', href: PATH_DASHBOARD.user.list },
              { name: 'Edit User' }
            ]}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Page>
    )
  }

  if (query.isSuccess && currentUser) {
    return (
      <Page title="Edit User">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit User"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
              { name: 'User List', href: PATH_DASHBOARD.user.list },
              { name: 'Edit User' }
            ]}
          />
          <UserNewEditForm isEdit currentUser={currentUser} />
        </Container>
      </Page>
    )
  }

  return <></>
}
