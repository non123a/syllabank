import { Container } from '@mui/material'
import React from 'react'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import Layout from 'src/layouts'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { NewAdminForm } from 'src/sections/@dashboard/admin/new'

New.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default function New() {
  return (
    <Page title="Admin New">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="New"
          links={[
            { name: 'Admin Management', href: PATH_DASHBOARD.admin.root },
            { name: 'New' }
          ]}
        />
        <NewAdminForm />
      </Container>
    </Page>
  )
}
