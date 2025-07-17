import React from 'react'
import { Box, Typography, Paper } from '@mui/material'

export default function PDFPreview({ content }) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        height: '70vh',
        overflowY: 'auto',
        bgcolor: 'background.paper'
      }}
    >
      <Typography
        variant="body2"
        component="pre"
        sx={{ whiteSpace: 'pre-wrap' }}
      >
        {content}
      </Typography>
    </Paper>
  )
}
