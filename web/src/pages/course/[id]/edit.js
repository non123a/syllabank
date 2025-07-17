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
import NewEditCourseForm from 'src/sections/@dashboard/course/NewEditCourseForm'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { queryCourseById } from 'src/apis/course'

// ----------------------------------------------------------------------

CourseEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function CourseEdit() {
  const { themeStretch } = useSettings()

  const router = useRouter()

  const id = router.query.id

  const query = useQuery({
    queryKey: ['courses', id],
    queryFn: async () => await queryCourseById(id),
    enabled: Boolean(id),
    retry: 1
  })

  const currentCourse = query.data?.data

  if (query.isLoading) {
    return (
      <Page title="Edit Course">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit Course"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
              { name: 'Course List', href: PATH_DASHBOARD.course.list },
              { name: 'Edit Course' }
            ]}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Page>
    )
  }

  if (query.isSuccess && currentCourse) {
    return (
      <Page title="Edit Course">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit Course"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
              { name: 'Course List', href: PATH_DASHBOARD.course.list },
              { name: 'Edit Course' }
            ]}
          />
          <NewEditCourseForm isEdit currentCourse={currentCourse} />
        </Container>
      </Page>
    )
  }

  return <></>
}
