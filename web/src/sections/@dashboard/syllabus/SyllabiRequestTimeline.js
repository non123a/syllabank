import React, { useState } from 'react'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab'
import {
  Typography,
  IconButton,
  Box,
  Paper,
  Collapse,
  TextField,
  Button
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

export default function SyllabiRequestTimeline({ timelineData, onAddComment }) {
  const [expandedComments, setExpandedComments] = useState({})
  const [newComments, setNewComments] = useState({})

  const toggleComments = (index) => {
    setExpandedComments((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const handleCommentChange = (index, value) => {
    setNewComments((prev) => ({ ...prev, [index]: value }))
  }

  const handleSubmitComment = (index, eventId) => {
    if (newComments[index]?.trim()) {
      onAddComment(eventId, newComments[index])
      setNewComments((prev) => ({ ...prev, [index]: '' }))
    }
  }

  const formatStatus = (status) => {
    switch (status) {
      case 'rejected':
        return 'Rejected'
      case 'approved':
        return 'Approved'
      case 'draft':
        return 'Draft'
      case 'submit_to_head_of_department':
        return 'Submitted to Head of Department'
      case 'vouched_to_dean':
        return 'Vouched to Dean'
      case 'accepted_by_provost':
        return 'Accepted to Provost'
      default:
        return (
          status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')
        )
    }
  }

  const formatCommentContent = (content) => {
    const statusRegex = /Status changed to (\w+)/
    const match = content.match(statusRegex)
    if (match) {
      const status = match[1]
      return `Status changed to ${formatStatus(status)}`
    }
    return content
  }

  return (
    <Timeline position="alternate">
      {timelineData.map((event, index) => (
        <TimelineItem key={index}>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            {index < timelineData.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                bgcolor: 'background.neutral',
                '&:hover': {
                  bgcolor: 'background.paper'
                }
              }}
            >
              <Typography variant="h6" component="span" color="primary">
                {formatStatus(event.status)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(event.date).toLocaleString()}
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Comments ({event.comments?.length || 0})
                </Typography>
                <IconButton size="small" onClick={() => toggleComments(index)}>
                  {expandedComments[index] ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>
              <Collapse in={expandedComments[index]}>
                <Box sx={{ mt: 1 }}>
                  {event.comments &&
                    event.comments.map((comment, commentIndex) => (
                      <Paper
                        key={commentIndex}
                        elevation={1}
                        sx={{
                          mt: 1,
                          p: 1,
                          bgcolor: 'background.paper'
                        }}
                      >
                        <Typography variant="subtitle2" color="primary">
                          {comment.from.name}
                        </Typography>
                        <Typography variant="body2">
                          {formatCommentContent(comment.content)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.created_at).toLocaleString()}
                        </Typography>
                      </Paper>
                    ))}
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add a comment..."
                      value={newComments[index] || ''}
                      onChange={(e) =>
                        handleCommentChange(index, e.target.value)
                      }
                      sx={{ mb: 1 }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleSubmitComment(index, event.status)}
                    >
                      Submit Comment
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
