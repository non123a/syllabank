import { Typography, Tooltip } from '@mui/material'

const TruncatedDescription = ({ text, maxLength = 50 }) => {
  const shouldTruncate = text.length > maxLength
  const displayText = shouldTruncate ? `${text.slice(0, maxLength)}...` : text

  return shouldTruncate ? (
    <Tooltip title={text} placement="top-start">
      <Typography noWrap>{displayText}</Typography>
    </Tooltip>
  ) : (
    <Typography>{displayText}</Typography>
  )
}

export default TruncatedDescription
