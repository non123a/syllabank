import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Box
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import Page from '../../components/Page'
import {
  createSyllabusTemplate,
  getSyllabusTemplates
} from '../../apis/syllabus'
import { useSnackbar } from 'notistack'

export default function ManageTemplates() {
  const [templates, setTemplates] = useState([])
  const { enqueueSnackbar } = useSnackbar()

  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      sections: [{ title: '', content: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections'
  })

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const fetchedTemplates = await getSyllabusTemplates()
        setTemplates(fetchedTemplates)
      } catch (error) {
        console.error('Failed to fetch templates:', error)
        enqueueSnackbar('Failed to fetch templates', { variant: 'error' })
      }
    }
    fetchTemplates()
  }, [enqueueSnackbar])

  const onSubmit = async (data) => {
    try {
      await createSyllabusTemplate(data)
      enqueueSnackbar('Template created successfully', { variant: 'success' })
      reset()
      // Refresh the templates list
      const updatedTemplates = await getSyllabusTemplates()
      setTemplates(updatedTemplates)
    } catch (error) {
      console.error('Failed to create template:', error)
      enqueueSnackbar('Failed to create template', { variant: 'error' })
    }
  }

  return (
    <Page title="Manage Syllabus Templates">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Manage Syllabus Templates
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Template Name"
                    {...register('name')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                    Template Sections
                  </Typography>
                  {fields.map((field, index) => (
                    <Box key={field.id} sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label={`Section ${index + 1} Title`}
                        {...register(`sections.${index}.title`)}
                        sx={{ mb: 1 }}
                      />
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label={`Section ${index + 1} Content`}
                        {...register(`sections.${index}.content`)}
                        helperText="Use {{variableName}} for dynamic content"
                      />
                      <IconButton onClick={() => remove(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => append({ title: '', content: '' })}
                  >
                    Add Section
                  </Button>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" color="primary">
                  Create Template
                </Button>
              </Box>
            </CardContent>
          </Card>
        </form>

        <Typography variant="h5" sx={{ mt: 5, mb: 3 }}>
          Existing Templates
        </Typography>
        {templates.map((template) => (
          <Card key={template.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{template.name}</Typography>
              {template.sections.map((section, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">{section.title}</Typography>
                  <Typography variant="body2">{section.content}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}
      </Container>
    </Page>
  )
}
