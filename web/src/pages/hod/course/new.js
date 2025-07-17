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
import CourseNewEditForm from 'src/sections/@dashboard/hod/new/NewEditCourseForm'

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
            { name: 'Home', href: PATH_DASHBOARD.general.home },
            { name: 'HoD', href: PATH_DASHBOARD.hod.root },
            { name: 'Assign Courses', href: PATH_DASHBOARD.hod.assignCourses },
            { name: 'New Course for Assigning Instructors' }
          ]}
        />
        <CourseNewEditForm />
      </Container>
    </Page>
  )
}
