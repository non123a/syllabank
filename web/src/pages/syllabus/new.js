import React, { useState, useEffect } from 'react'
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
import NewSyllabusForm from 'src/sections/@dashboard/syllabus/NewSyllabusForm'
import { queryAssignedCourses } from 'src/apis/syllabus'

// ----------------------------------------------------------------------

SyllabusNew.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function SyllabusNew() {
  const { themeStretch } = useSettings()

  useEffect(() => {
    const fetchAssignedCourses = async () => {
      try {
        const response = await queryAssignedCourses()
        setAssignedCourses(response.data)
      } catch (error) {
        console.error('Error fetching assigned courses:', error)
      }
    }

    fetchAssignedCourses()
  }, [])

  return (
    <Page title="Create Syllabus">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create Syllabus"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
            { name: 'Syllabus List', href: PATH_DASHBOARD.syllabus.list },
            { name: 'New Syllabus' }
          ]}
        />
        <NewSyllabusForm />
      </Container>
    </Page>
  )
}
