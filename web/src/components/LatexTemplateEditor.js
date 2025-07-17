import React, { useState, useCallback, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  TextField,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Alert
} from '@mui/material'
import axios from '../utils/axios'

const CodeMirror = dynamic(
  () => {
    import('codemirror/lib/codemirror.css')
    import('codemirror/theme/material.css')
    import('codemirror/mode/stex/stex')
    import('codemirror/addon/fold/foldcode')
    import('codemirror/addon/fold/foldgutter')
    import('codemirror/addon/fold/brace-fold')
    import('codemirror/addon/fold/comment-fold')
    import('codemirror/addon/fold/foldgutter.css')
    return import('react-codemirror2').then((mod) => mod.Controlled)
  },
  { ssr: false }
)

const LatexTemplateEditor = ({ initialTemplate, onSave }) => {
  const [templateName, setTemplateName] = useState(initialTemplate?.name || '')
  const [latexContent, setLatexContent] = useState(
    initialTemplate?.content || ''
  )
  const [description, setDescription] = useState(
    initialTemplate?.description || ''
  )
  const [pdfPreview, setPdfPreview] = useState(null)
  const [renderError, setRenderError] = useState(null)
  const [nameError, setNameError] = useState(null)
  const [descriptionError, setDescriptionError] = useState(null)
  const editorRef = useRef(null)
  const [isClient, setIsClient] = useState(false)
  const [editorWidth, setEditorWidth] = useState(50)
  const dividerRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
    if (editorRef.current) {
      editorRef.current.refresh()
    }
  }, [])

  const handleSave = async () => {
    // Reset error states
    setNameError(null)
    setDescriptionError(null)
    setRenderError(null)

    // Validate name and description
    if (templateName.length > 32) {
      setNameError('Template name must not exceed 32 characters')
      return
    }
    if (description.length > 256) {
      setDescriptionError('Description must not exceed 256 characters')
      return
    }

    // Attempt to render LaTeX before saving
    try {
      await handleRenderPDF()

      // If rendering is successful, proceed with saving
      onSave({
        name: templateName,
        content: latexContent,
        description: description
      })
    } catch (error) {
      console.error('Error rendering LaTeX:', error)
      setRenderError('Failed to render LaTeX. Please check your syntax.')
    }
  }

  const extractErrorMessage = (fullError) => {
    const errorLines = fullError.split('\n')
    const relevantErrors = []

    for (const line of errorLines) {
      if (line.includes('! LaTeX Error:')) {
        relevantErrors.push(line.replace('! LaTeX Error:', '').trim())
      } else if (line.includes('! Emergency stop.')) {
        relevantErrors.push('Emergency stop encountered.')
      } else if (line.includes('Runaway argument?')) {
        relevantErrors.push('Runaway argument detected.')
      } else if (line.includes('Paragraph ended before')) {
        relevantErrors.push(line.trim())
      } else if (line.includes('l.') && line.match(/l\.(\d+)/)) {
        relevantErrors.push(`Error near line ${line.match(/l\.(\d+)/)[1]}`)
      }
    }

    return relevantErrors.length > 0
      ? relevantErrors.join('\n')
      : 'LaTeX compilation failed. Please check your syntax.'
  }

  const handleRenderPDF = async () => {
    setRenderError(null)
    setPdfPreview(null)
    try {
      const response = await axios.post('/syllabus/render-latex', {
        content: latexContent
      })
      if (response.data && response.data.pdf) {
        setPdfPreview(`data:application/pdf;base64,${response.data.pdf}`)
        return true
      } else {
        console.error('Invalid response from server:', response)
        throw new Error('Failed to render PDF. Please check your LaTeX syntax.')
      }
    } catch (error) {
      console.error('Error rendering PDF:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'An error occurred while rendering the PDF.'
      setRenderError(extractErrorMessage(errorMessage))
      throw error
    }
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = useCallback((e) => {
    if (dividerRef.current) {
      const containerWidth = dividerRef.current.parentElement.offsetWidth
      const newEditorWidth = (e.clientX / containerWidth) * 100
      setEditorWidth(Math.max(20, Math.min(80, newEditorWidth)))
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove])

  return (
    <Grid container spacing={2} sx={{ height: 'calc(100vh - 200px)' }}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Template Name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          error={!!nameError}
          helperText={nameError}
          inputProps={{ maxLength: 32 }}
        />
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', height: 'calc(100% - 140px)' }}>
        <Box sx={{ width: `${editorWidth}%`, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Content of the Template
          </Typography>
          <Paper
            elevation={3}
            sx={{ height: 'calc(100% - 32px)', overflow: 'hidden' }}
          >
            {isClient && (
              <CodeMirror
                value={latexContent}
                options={{
                  mode: 'stex',
                  theme: 'material',
                  lineNumbers: true,
                  lineWrapping: true,
                  foldGutter: true,
                  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                  extraKeys: {
                    'Ctrl-Space': 'autocomplete'
                  },
                  viewportMargin: Infinity,
                  preserveScrollPosition: true
                }}
                onBeforeChange={(editor, data, value) => {
                  setLatexContent(value)
                }}
                editorDidMount={(editor) => {
                  editorRef.current = editor
                }}
                style={{ height: '100%' }}
              />
            )}
          </Paper>
        </Box>
        <Box
          ref={dividerRef}
          sx={{
            width: '10px',
            backgroundColor: 'grey.300',
            cursor: 'col-resize',
            '&:hover': { backgroundColor: 'grey.400' }
          }}
          onMouseDown={handleMouseDown}
        />
        <Box sx={{ width: `${100 - editorWidth}%`, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            PDF Preview
          </Typography>
          <Paper
            elevation={3}
            sx={{
              height: 'calc(100% - 32px)',
              padding: 2,
              overflow: 'auto'
            }}
          >
            {renderError && (
              <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                {renderError}
              </Alert>
            )}
            {pdfPreview ? (
              <embed
                src={pdfPreview}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            ) : (
              <Typography>Click "Render as PDF" to see the preview</Typography>
            )}
          </Paper>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Template Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          sx={{ mb: 2 }}
          error={!!descriptionError}
          helperText={descriptionError}
          inputProps={{ maxLength: 256 }}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleSave} sx={{ mr: 2 }}>
            Save Template
          </Button>
          <Button variant="outlined" onClick={handleRenderPDF}>
            Render as PDF
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

export default LatexTemplateEditor
