import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material'
import Iconify from 'src/components/Iconify'

SyllabiMultiSelectModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  syllabi: PropTypes.array.isRequired
}

export default function SyllabiMultiSelectModal({
  open,
  onClose,
  onSubmit,
  syllabi
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSyllabi, setSelectedSyllabi] = useState([])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleToggleSyllabus = (syllabus) => {
    const currentIndex = selectedSyllabi.findIndex((s) => s.id === syllabus.id)
    const newSelectedSyllabi = [...selectedSyllabi]

    if (currentIndex === -1) {
      newSelectedSyllabi.push(syllabus)
    } else {
      newSelectedSyllabi.splice(currentIndex, 1)
    }

    setSelectedSyllabi(newSelectedSyllabi)
  }

  const handleSelectAll = () => {
    if (selectedSyllabi.length === syllabi.length) {
      setSelectedSyllabi([])
    } else {
      setSelectedSyllabi([...syllabi])
    }
  }

  const handleSubmit = () => {
    onSubmit(selectedSyllabi)
  }

  const filteredSyllabi = syllabi.filter((syllabus) =>
    syllabus.syllabus_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Syllabi to Download</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Search Syllabi"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ mb: 2 }}
        />
        <Button
          onClick={handleSelectAll}
          variant="outlined"
          color="primary"
          sx={{ mb: 2 }}
        >
          {selectedSyllabi.length === syllabi.length
            ? 'Deselect All'
            : 'Select All'}
        </Button>
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {filteredSyllabi.map((syllabus) => (
            <ListItem key={syllabus.id} dense button>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedSyllabi.some((s) => s.id === syllabus.id)}
                    onChange={() => handleToggleSyllabus(syllabus)}
                  />
                }
                label={
                  <Typography variant="body2">
                    {syllabus.syllabus_name} - {syllabus.course.subject}{' '}
                    {syllabus.course.code}: {syllabus.course.name}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<Iconify icon="eva:download-outline" />}
          disabled={selectedSyllabi.length === 0}
        >
          Download Selected ({selectedSyllabi.length})
        </Button>
      </DialogActions>
    </Dialog>
  )
}
