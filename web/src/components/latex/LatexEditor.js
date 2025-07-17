import React from 'react'
import { Box, Paper } from '@mui/material'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/stex/stex'
import LatexToolbar from './LatexToolbar'

export default function LatexEditor({ content, onChange }) {
  const handleToolbarAction = (action) => {
    const editor = document.querySelector('.CodeMirror').CodeMirror
    const doc = editor.getDoc()
    const cursor = doc.getCursor()
    doc.replaceRange(action, cursor)
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        height: '90vh', // Increased from 70vh to 90vh
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <LatexToolbar onAction={handleToolbarAction} />
      <Box
        sx={{ flexGrow: 1, overflow: 'hidden', height: 'calc(100% - 48px)' }}
      >
        {' '}
        <CodeMirror
          value={content}
          options={{
            mode: 'stex',
            theme: 'material',
            lineNumbers: true,
            lineWrapping: true
          }}
          onBeforeChange={(editor, data, value) => {
            onChange(value)
          }}
          style={{ height: '100%' }} // Added style to make CodeMirror fill the container
        />
      </Box>
    </Paper>
  )
}
