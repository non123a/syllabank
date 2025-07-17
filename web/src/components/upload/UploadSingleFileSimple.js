import PropTypes from 'prop-types'
import { useDropzone } from 'react-dropzone'
// @mui
import { styled } from '@mui/material/styles'
import { Box, Stack, Typography } from '@mui/material'
//
import RejectionFiles from './RejectionFiles'

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  margin: theme.spacing(0, 0, 1.5, 0),
  padding: theme.spacing(3, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' }
}))

// ----------------------------------------------------------------------

UploadSingleFileSimple.propTypes = {
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helperText: PropTypes.node,
  sx: PropTypes.object
}

export default function UploadSingleFileSimple({
  error = false,
  file,
  helperText,
  sx,
  ...other
}) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections
  } = useDropzone({
    multiple: false,
    ...other
  })

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter'
          })
        }}
      >
        <input {...getInputProps()} />
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          direction={{ xs: 'column', md: 'row' }}
          sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
        >
          <Box sx={{ p: 3 }}>
            <Typography gutterBottom variant="h5">
              Drop or Select file
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Drop files here or click&nbsp;
              <Typography
                variant="body2"
                component="span"
                sx={{ color: 'primary.main', textDecoration: 'underline' }}
              >
                browse
              </Typography>
              &nbsp;thorough your machine
            </Typography>
          </Box>
        </Stack>
      </DropZoneStyle>

      {fileRejections.length > 0 && (
        <RejectionFiles fileRejections={fileRejections} />
      )}

      {helperText && helperText}
    </Box>
  )
}
