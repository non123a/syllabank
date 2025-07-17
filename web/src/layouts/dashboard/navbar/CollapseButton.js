import PropTypes from 'prop-types'
// @mui
import { Box } from '@mui/material'
// components
import { IconButtonAnimate } from 'src/components/animate'

// ----------------------------------------------------------------------

CollapseButton.propTypes = {
  collapseClick: PropTypes.bool,
  onToggleCollapse: PropTypes.func
}

export default function CollapseButton({ onToggleCollapse, collapseClick }) {
  return (
    <IconButtonAnimate onClick={onToggleCollapse}>
      <Box
        sx={{
          lineHeight: 0,
          transition: (theme) =>
            theme.transitions.create('transform', {
              duration: theme.transitions.duration.shorter
            }),
          ...(collapseClick && {
            transform: 'rotate(180deg)'
          })
        }}
      >
        {icon}
      </Box>
    </IconButtonAnimate>
  )
}

// ----------------------------------------------------------------------

const icon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
  >
    <circle cx={4} cy={12} r={1} fill="currentColor"></circle>
    <rect
      width={14}
      height={2}
      x={7}
      y={11}
      fill="currentColor"
      rx={0.94}
      ry={0.94}
    ></rect>
    <rect
      width={18}
      height={2}
      x={3}
      y={16}
      fill="currentColor"
      rx={0.94}
      ry={0.94}
    ></rect>
    <rect
      width={18}
      height={2}
      x={3}
      y={6}
      fill="currentColor"
      rx={0.94}
      ry={0.94}
    ></rect>
  </svg>
)
