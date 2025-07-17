import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import {
  Container,
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem
} from '@mui/material'
import dynamic from 'next/dynamic'
import Layout from 'src/layouts'
import Page from 'src/components/Page'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'
import axios from 'src/utils/axios'
import useLocalStorage from 'src/hooks/useLocalStorage'
import { useSnackbar } from 'notistack'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PreviewIcon from '@mui/icons-material/Preview'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

CustomTemplateEditor.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default function CustomTemplateEditor({ initialContent, onSave }) {
  const router = useRouter()
  const { id } = router.query
  const [content, setContent] = useLocalStorage(`template-content-${id}`, null)
  const [templateName, setTemplateName] = useState('')
  const [description, setDescription] = useState('')
  const [pdfPreview, setPdfPreview] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [currentSection, setCurrentSection] = useState(null)
  const [currentSectionKey, setCurrentSectionKey] = useState(null)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (id) {
      fetchTemplate()
    } else if (initialContent) {
      setContent(JSON.parse(initialContent))
    }
  }, [id, initialContent])

  const fetchTemplate = async () => {
    try {
      const response = await axios.get(`/template/${id}`)
      if (response.data) {
        const parsedContent = JSON.parse(response.data.content)
        setContent(parsedContent)
        setTemplateName(response.data.name)
        setDescription(response.data.description)
      }
    } catch (error) {
      console.error('Error fetching template:', error)
      enqueueSnackbar('Failed to fetch template', { variant: 'error' })
    }
  }

  const handleContentChange = (field, value) => {
    setContent((prevContent) => {
      const newContent = { ...prevContent }
      const fields = field.split('.')
      let current = newContent
      for (let i = 0; i < fields.length - 1; i++) {
        if (!current[fields[i]]) {
          current[fields[i]] = {}
        }
        current = current[fields[i]]
      }
      current[fields[fields.length - 1]] = value
      return newContent
    })
  }

  const addSection = () => {
    setCurrentSection({
      title: '',
      description: '',
      table: null
    })
    setCurrentSectionKey(null)
    setOpenDialog(true)
  }

  const editSection = (key) => {
    setCurrentSection({ ...content.body.content[key] })
    setCurrentSectionKey(key)
    setOpenDialog(true)
  }

  const deleteSection = (key) => {
    setContent((prevContent) => {
      const newContent = { ...prevContent }
      delete newContent.body.content[key]
      return newContent
    })
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
    setCurrentSection(null)
    setCurrentSectionKey(null)
  }

  const handleDialogSave = () => {
    if (currentSection) {
      const newContent = content ? { ...content } : { body: { content: {} } }
      const sectionKey = currentSectionKey || `section_${Date.now()}`
      if (!newContent.body) {
        newContent.body = { content: {} }
      } else if (!newContent.body.content) {
        newContent.body.content = {}
      }
      newContent.body.content[sectionKey] = currentSection
      setContent(newContent)
      setOpenDialog(false)
      setCurrentSection(null)
      setCurrentSectionKey(null)
    }
  }

  const addRow = useCallback((sectionKey) => {
    setContent((prevContent) => {
      const newContent = JSON.parse(JSON.stringify(prevContent))
      const section = newContent.body.content[sectionKey]

      if (!section || !section.table) return newContent

      const newRow = Array(section.table.headers.length).fill('')
      section.table.rows = [...section.table.rows, newRow]

      return newContent
    })
  }, [])

  const deleteRow = useCallback((sectionKey, rowIndex) => {
    setContent((prevContent) => {
      const newContent = { ...prevContent }
      const section = newContent.body.content[sectionKey]

      if (!section || !section.table || rowIndex < 0) return newContent

      section.table.rows = section.table.rows.filter(
        (_, index) => index !== rowIndex
      )

      return newContent
    })
  }, [])

  const addColumn = useCallback((sectionKey) => {
    setContent((prevContent) => {
      const newContent = JSON.parse(JSON.stringify(prevContent))
      const section = newContent.body.content[sectionKey]

      if (!section || !section.table) return newContent

      section.table.headers = [...section.table.headers, '']
      section.table.rows = section.table.rows.map((row) => [...row, ''])

      return newContent
    })
  }, [])

  const deleteColumn = useCallback((sectionKey) => {
    setContent((prevContent) => {
      const newContent = JSON.parse(JSON.stringify(prevContent))
      const section = newContent.body.content[sectionKey]

      if (!section || !section.table || section.table.headers.length <= 1) {
        return newContent
      }

      section.table.headers = section.table.headers.slice(0, -1)
      section.table.rows = section.table.rows.map((row) => row.slice(0, -1))

      return newContent
    })
  }, [])

  const handleTableCellChange = useCallback(
    (sectionKey, rowIndex, cellIndex, value) => {
      setContent((prevContent) => {
        const newContent = { ...prevContent }
        const section = newContent.body.content[sectionKey]

        if (!section || !section.table) return newContent

        const newRows = [...section.table.rows]
        newRows[rowIndex] = [...newRows[rowIndex]]
        newRows[rowIndex][cellIndex] = value

        section.table.rows = newRows
        return newContent
      })
    },
    []
  )

  const handleTableHeaderChange = useCallback((sectionKey, index, value) => {
    setContent((prevContent) => {
      const newContent = { ...prevContent }
      const section = newContent.body.content[sectionKey]

      if (!section || !section.table) return newContent

      const newHeaders = [...section.table.headers]
      newHeaders[index] = value

      section.table.headers = newHeaders
      return newContent
    })
  }, [])

  const renderTableSection = (section, sectionKey) => {
    return (
      <div className="space-y-4">
        <Table>
          <TableHead>
            <TableRow>
              {section.table.headers.map((header, index) => (
                <TableCell key={index}>
                  <TextField
                    value={header}
                    onChange={(e) =>
                      handleTableHeaderChange(sectionKey, index, e.target.value)
                    }
                    fullWidth
                  />
                </TableCell>
              ))}
              <TableCell>
                <IconButton onClick={() => addColumn(sectionKey)}>
                  <AddIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {section.table.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <TextField
                      value={cell}
                      onChange={(e) =>
                        handleTableCellChange(
                          sectionKey,
                          rowIndex,
                          cellIndex,
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={() => deleteRow(sectionKey, rowIndex)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ mt: 2 }}>
          <Button onClick={() => addRow(sectionKey)}>Add Row</Button>
          <Button onClick={() => deleteColumn(sectionKey)} sx={{ ml: 2 }}>
            Delete Last Column
          </Button>
        </Box>
      </div>
    )
  }

  const renderSectionContent = (section, sectionKey) => {
    if (section.table) {
      return renderTableSection(section, sectionKey)
    } else {
      return (
        <ReactQuill
          value={section.description}
          onChange={(value) =>
            handleContentChange(`body.content.${sectionKey}.description`, value)
          }
        />
      )
    }
  }

  const handleSave = async () => {
    try {
      const defaultContent = {
        instructorInfo: {
          title: 'Instructor Information',
          table: {
            headers: ['Name', 'Contact Info', 'Office hours'],
            rows: [
              [
                '[Include your title and what you prefer to be called]',
                '[Include information for your preferred method of contact here and office #]',
                "[Write by appointment if you don't have scheduled office hours]"
              ]
            ]
          }
        },
        taInfo: {
          title: 'T.A. Information',
          table: {
            headers: ['TA NAME', 'TA CONTACT INFO'],
            rows: [['[TA Name]', '[TA Contact Info]']]
          }
        }
      }

      const mergedContent = {
        ...content?.body?.content,
        ...defaultContent
      }

      const template = {
        name: templateName,
        description: description,
        content: JSON.stringify({
          head: {
            title: '[Course Code] Syllabus',
            styles: '/* Styles will be populated by getStyles() method */'
          },
          body: {
            header: {
              logo: {
                src: '/images/logo.png',
                alt: 'Paragon International University Logo'
              },
              courseInfo: {
                courseCode: '[Course Code]',
                academicYear: '20XX/20XX',
                semester: 'Semester X',
                credits: 'Credits: X'
              }
            },
            content: mergedContent,
            footer: {
              content: 'Paragon International University'
            }
          }
        }),
        is_active: true
      }

      if (onSave) {
        await onSave(template)
      } else {
        if (id) {
          await axios.put(`/syllabus/templates/${id}`, template)
        } else {
          await axios.post('/syllabus/templates', template)
        }
      }

      enqueueSnackbar('Template saved successfully', { variant: 'success' })
    } catch (error) {
      console.error('Error saving template:', error)
      enqueueSnackbar('Failed to save template', { variant: 'error' })
    }
  }

  const handleRenderPDF = async () => {
    try {
      const defaultContent = {
        instructorInfo: {
          title: 'Instructor Information',
          table: {
            headers: ['Name', 'Contact Info', 'Office hours'],
            rows: [
              [
                '[Include your title and what you prefer to be called]',
                '[Include information for your preferred method of contact here and office #]',
                "[Write by appointment if you don't have scheduled office hours]"
              ]
            ]
          }
        },
        taInfo: {
          title: 'T.A. Information',
          table: {
            headers: ['TA NAME', 'TA CONTACT INFO'],
            rows: [['[TA Name]', '[TA Contact Info]']]
          }
        }
      }

      // Merge default content with existing content
      const mergedContent = {
        ...defaultContent,
        ...content?.body?.content
      }

      const fullContent = {
        head: {
          title: '[Course Code] Syllabus',
          styles: '/* Styles will be populated by getStyles() method */'
        },
        body: {
          header: {
            logo: {
              src: '/images/logo.png',
              alt: 'Paragon International University Logo'
            },
            courseInfo: {
              courseCode: '[Course Code]',
              academicYear: '20XX/20XX',
              semester: 'Semester X',
              credits: 'Credits: X'
            }
          },
          content: mergedContent,
          footer: {
            content: 'Paragon International University'
          }
        }
      }

      const response = await axios.post('/syllabus/render-custom', {
        content: JSON.stringify(fullContent)
      })

      if (response.data && response.data.pdf) {
        setPdfPreview(`data:application/pdf;base64,${response.data.pdf}`)
      } else {
        enqueueSnackbar('Failed to generate PDF preview', { variant: 'error' })
      }
    } catch (error) {
      console.error('Error rendering PDF:', error)
      enqueueSnackbar('Error rendering PDF: ' + error.message, {
        variant: 'error'
      })
    }
  }

  return (
    <Page title="Custom Template Editor">
      <Container maxWidth={false} disableGutters>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Template Name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              inputProps={{ maxLength: 32 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Template Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              inputProps={{ maxLength: 256 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Body Content
              </Typography>
              {Object.entries(content?.body?.content || {}).map(
                ([key, section]) => (
                  <Box key={key} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">{section.title}</Typography>
                    {renderSectionContent(section, key)}
                    <Box sx={{ mt: 1 }}>
                      <IconButton onClick={() => editSection(key)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => deleteSection(key)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )
              )}
              <Button startIcon={<AddIcon />} onClick={addSection}>
                Add Section
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleSave}>
                Save Template
              </Button>
              <Button
                variant="outlined"
                startIcon={<PreviewIcon />}
                onClick={handleRenderPDF}
              >
                Preview
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>
            {currentSectionKey ? 'Edit Section' : 'Add Section'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Section Title"
              value={currentSection?.title || ''}
              onChange={(e) =>
                setCurrentSection({ ...currentSection, title: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Section Type"
              value={currentSection?.type || 'text'}
              onChange={(e) => {
                const type = e.target.value
                setCurrentSection({
                  ...currentSection,
                  type,
                  content: type === 'text' ? '' : undefined,
                  table:
                    type === 'table'
                      ? { headers: [''], rows: [['']] }
                      : undefined
                })
              }}
              sx={{ mb: 2 }}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="table">Table</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleDialogSave}>Save</Button>
          </DialogActions>
        </Dialog>
        {pdfPreview && (
          <Box mt={4} sx={{ width: '100%' }}>
            <Typography variant="h6" mb={2}>
              Template Preview
            </Typography>
            <Paper
              elevation={3}
              sx={{
                height: '70vh',
                width: '100%',
                overflow: 'hidden'
              }}
            >
              <embed
                src={pdfPreview}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            </Paper>
          </Box>
        )}
      </Container>
    </Page>
  )
}
