import React, { useState } from 'react'
import { Container, Typography, TextField, Box, Button } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import DashboardLayout from '../../../layouts/dashboard'
import axios from '../../../utils/axios'
import { PATH_DASHBOARD } from '../../../routes/paths'
import LatexTemplateEditor from '../../../components/LatexTemplateEditor'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs'
import CustomTemplateEditor from '../../../components/CustomTemplateEditor'

const CreateSyllabusTemplate = () => {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const handleSave = async (template) => {
    try {
      await axios.post('/syllabus/templates', {
        ...template,
        content: template.content
      })
      enqueueSnackbar('Template created successfully', { variant: 'success' })
      router.push(PATH_DASHBOARD.provost.syllabusTemplate)
    } catch (error) {
      enqueueSnackbar('Failed to create template', { variant: 'error' })
    }
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Create Syllabus Template | Paragon School</title>
      </Head>
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Create Syllabus Template"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Syllabus Templates',
              href: PATH_DASHBOARD.provost.syllabusTemplate
            },
            { name: 'Templates Creation' }
          ]}
        />
        {/* <LatexTemplateEditor onSave={handleSave} /> */}
        <CustomTemplateEditor onSave={handleSave} />
      </Container>
    </DashboardLayout>
  )
}

export default CreateSyllabusTemplate
