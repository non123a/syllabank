import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'

export default function SyllabusList({ syllabi, onSelectSyllabus }) {
  return (
    <List>
      {syllabi.map((syllabus) => (
        <ListItem key={syllabus.id}>
          <ListItemText
            primary={syllabus.course.name}
            secondary={`Status: ${syllabus.status}`}
          />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => onSelectSyllabus(syllabus)}
            >
              <EditIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}
