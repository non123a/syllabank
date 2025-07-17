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
import CourseNewEditForm from 'src/sections/@dashboard/course/NewEditCourseForm'

// ----------------------------------------------------------------------

CourseNew.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function CourseNew() {
  const { themeStretch } = useSettings()

  return (
    <Page title="Create Course">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create Course"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
            { name: 'Course List', href: PATH_DASHBOARD.course.list },
            { name: 'New Course' }
          ]}
        />
        <CourseNewEditForm />
      </Container>
    </Page>
  )
}
