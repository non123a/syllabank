import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Paper,
  useTheme,
  Collapse,
  IconButton
} from '@mui/material'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { TextField, Button } from '@mui/material'
import axios from 'src/utils/axios'
import { useSnackbar } from 'notistack'

export default function SyllabusTimelineModal({
  open,
  onClose,
  syllabus,
  onCommentAdded
}) {
  const theme = useTheme()
  const [expandedComments, setExpandedComments] = React.useState({})
  const [newComment, setNewComment] = useState('')
  const { enqueueSnackbar } = useSnackbar()

  const [timelineEvents, setTimelineEvents] = React.useState([])

  React.useEffect(() => {
    if (syllabus && syllabus.status_timeline) {
      try {
        setTimelineEvents(JSON.parse(syllabus.status_timeline))
      } catch (error) {
        console.error('Error parsing status_timeline:', error)
        setTimelineEvents([])
      }
    }
  }, [syllabus])

  const toggleComments = (index) => {
    setExpandedComments((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      enqueueSnackbar('Comment cannot be empty', { variant: 'error' })
      return
    }
    try {
      const response = await axios.post(
        `/syllabus/${syllabus.id}/add-comment`,
        {
          content: newComment,
          eventId: syllabus.status
        }
      )

      if (response.data && response.data.status_timeline) {
        const updatedTimeline = JSON.parse(response.data.status_timeline)
        setTimelineEvents(updatedTimeline)
        setNewComment('')
        enqueueSnackbar('Comment added successfully', { variant: 'success' })
        onCommentAdded() // Call the function to refresh parent component's data
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      enqueueSnackbar('Failed to add comment', { variant: 'error' })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Syllabus Timeline</DialogTitle>
      <DialogContent>
        <Timeline position="alternate">
          {timelineEvents.map((event, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color="primary" />
                {index < timelineEvents.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    bgcolor: theme.palette.background.neutral,
                    '&:hover': {
                      bgcolor: theme.palette.background.paper
                    }
                  }}
                >
                  <Typography variant="h6" component="span" color="primary">
                    {(() => {
                      switch (event.status) {
                        case 'rejected':
                          return 'Rejected'
                        case 'approved':
                          return 'Approved'
                        case 'draft':
                          return 'Draft'
                        case 'submit_to_head_of_department':
                          return 'Submit to Head of Department'
                        case 'vouched_to_dean':
                          return 'Vouched to Dean'
                        case 'accepted_by_provost':
                          return 'Accepted by Provost'
                        default:
                          return (
                            event.status.charAt(0).toUpperCase() +
                            event.status.slice(1)
                          )
                      }
                    })()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(event.date).toLocaleString()}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Comments ({event.comments?.length || 0})
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => toggleComments(index)}
                    >
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
                              bgcolor: theme.palette.background.paper
                            }}
                          >
                            <Typography variant="subtitle2" color="primary">
                              {comment.from.name}
                            </Typography>
                            <Typography variant="body2">
                              {(() => {
                                const statusRegex = /Status changed to (\w+)/
                                const match = comment.content.match(statusRegex)
                                if (match) {
                                  const status = match[1]
                                  switch (status) {
                                    case 'rejected':
                                      return 'Status changed to Rejected'
                                    case 'approved':
                                      return 'Status changed to Approved'
                                    case 'draft':
                                      return 'Status changed to Draft'
                                    case 'submit_to_head_of_department':
                                      return 'Status changed to Submit to Head of Department'
                                    case 'vouched_to_dean':
                                      return 'Status changed to Vouched to Dean'
                                    case 'accepted_by_provost':
                                      return 'Status changed to Accepted to Provost'
                                    default:
                                      return `Status changed to ${
                                        status.charAt(0).toUpperCase() +
                                        status.slice(1)
                                      }`
                                  }
                                }
                                return comment.content
                              })()}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(comment.created_at).toLocaleString()}
                            </Typography>
                          </Paper>
                        ))}
                    </Box>
                  </Collapse>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddComment}
            >
              Submit Comment
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
