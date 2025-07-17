// @mui
import { Container } from '@mui/material'
// routes
import { PATH_DASHBOARD } from 'src/routes/paths'
// hooks
import useSettings from 'src/hooks/useSettings'
// layouts
import Layout from 'src/layouts'
// components
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import NewAcademicPeriodForm from 'src/sections/@dashboard/academic/NewAcademicPeriodForm'
// sections

// ----------------------------------------------------------------------

AcademicPeriodNew.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function AcademicPeriodNew() {
  const { themeStretch } = useSettings()

  return (
    <Page title="Add Academic Period">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Add Academic Period"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Academic Period Management List',
              href: PATH_DASHBOARD.academic.list
            },
            { name: 'New Academic Period' }
          ]}
        />
        <NewAcademicPeriodForm />
      </Container>
    </Page>
  )
}
