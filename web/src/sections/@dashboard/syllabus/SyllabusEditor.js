import React, { useState, useEffect } from 'react'
import { Box, Paper, Button, Typography } from '@mui/material'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/stex/stex'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
import 'codemirror/addon/fold/foldgutter.css'

const SyllabusEditor = ({ initialContent, onSave, feedback, comments }) => {
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    setContent(initialContent)
  }, [initialContent])

  const handleChange = (editor, data, value) => {
    setContent(value)
  }

  const handleSave = () => {
    onSave(content)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onSave(content)
    }, 5000)

    return () => clearTimeout(timer)
  }, [content, onSave])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <CodeMirror
          value={content}
          options={{
            mode: 'stex',
            theme: 'material',
            lineNumbers: true,
            lineWrapping: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            extraKeys: {
              'Ctrl-Space': 'autocomplete'
            }
          }}
          onBeforeChange={handleChange}
          style={{ flexGrow: 1 }}
        />
      </Paper>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
      {feedback && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.neutral' }}>
          <Typography variant="subtitle2" color="error">
            Feedback:
          </Typography>
          <Typography variant="body2">{feedback}</Typography>
        </Box>
      )}
      {comments.length > 0 && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.neutral' }}>
          <Typography variant="subtitle2">Comments:</Typography>
          {comments.map((comment, index) => (
            <Typography key={index} variant="body2">
              {comment}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  )
}
export default SyllabusEditor
