import { Container } from '@mui/material'
import React from 'react'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import Layout from 'src/layouts'
import { PATH_DASHBOARD } from 'src/routes/paths'
import { NewAdminForm } from 'src/sections/@dashboard/admin/new'
import useSettings from 'src/hooks/useSettings'


New.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}

export default function New() {

    const themeStretch = useSettings()

    return (
        <Page title="HoD New">
        <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
        heading="New"
        links={[
            { name: 'HoD Management', href: PATH_DASHBOARD.hod.root },
            { name: 'New' }
        ]}
        />
        <NewAdminForm />
        </Container>
        </Page>
    )
}
