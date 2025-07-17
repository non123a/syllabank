// @mui
import { Container, Skeleton } from '@mui/material'
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
import NewEditInstructorForm from 'src/sections/@dashboard/instructor/NewEditInstructorForm'
import useInstructor from 'src/hooks/queries/useInstructor'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

// ----------------------------------------------------------------------

InstructorEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function InstructorEdit() {
  const { themeStretch } = useSettings()

  const router = useRouter()

  const { id } = router.query

  const instructorQuery = useInstructor.getById(
    id,
    {},
    {
      enabled: !!id
    }
  )

  useEffect(() => {
    ;(async () => {
      if (
        instructorQuery.isError &&
        instructorQuery.error?.response?.status === 404
      ) {
        await router.push('/404')
      }
    })()
  })

  return (
    <Page title="Edit Instructor">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Edit Instructor"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Instructor List', href: PATH_DASHBOARD.instructor.list },
            {
              name: instructorQuery.isLoading
                ? 'Loading...'
                : String(instructorQuery.data?.data.id)
            }
          ]}
        />
        {(() => {
          if (instructorQuery.isSuccess) {
            return (
              <NewEditInstructorForm
                isEdit
                currentUser={instructorQuery.data?.data}
              />
            )
          }
        })()}
      </Container>
    </Page>
  )
}
