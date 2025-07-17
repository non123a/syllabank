import React from 'react'
import { Box, Button, Tooltip } from '@mui/material'
import Iconify from 'src/components/Iconify'

const tools = [
  { name: 'Bold', icon: 'mdi:format-bold', command: '\\textbf{}' },
  { name: 'Italic', icon: 'mdi:format-italic', command: '\\textit{}' },
  { name: 'Section', icon: 'mdi:format-header-1', command: '\\section{}' },
  {
    name: 'Subsection',
    icon: 'mdi:format-header-2',
    command: '\\subsection{}'
  },
  {
    name: 'List',
    icon: 'mdi:format-list-bulleted',
    command: '\\begin{itemize}\n\\item\n\\end{itemize}'
  },
  {
    name: 'Table',
    icon: 'mdi:table',
    command: '\\begin{tabular}{}\n\n\\end{tabular}'
  }
]

export default function LatexToolbar({ onAction }) {
  return (
    <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
      {tools.map((tool) => (
        <Tooltip key={tool.name} title={tool.name}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onAction(tool.command)}
          >
            <Iconify icon={tool.icon} width={20} height={20} />
          </Button>
        </Tooltip>
      ))}
    </Box>
  )
}
