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
import UserNewEditForm from 'src/sections/@dashboard/user/UserNewEditForm'

// ----------------------------------------------------------------------

UserCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings()

  return (
    <Page title="Register User">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Register User"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
            { name: 'User List', href: PATH_DASHBOARD.user.list },
            { name: 'New user' }
          ]}
        />
        <UserNewEditForm />
      </Container>
    </Page>
  )
}
