import PropTypes from 'prop-types'
import { memo } from 'react'
// @mui
import { Stack } from '@mui/material'
//
import { NavListRoot } from './NavList'

// ----------------------------------------------------------------------

const hideScrollbar = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none'
  }
}

NavSectionHorizontal.propTypes = {
  navConfig: PropTypes.array
}

function NavSectionHorizontal({ navConfig }) {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      sx={{ bgcolor: 'background.neutral', borderRadius: 1, px: 0.5 }}
    >
      <Stack direction="row" sx={{ ...hideScrollbar, py: 1 }}>
        {navConfig.map((group) => (
          <Stack key={group.subheader} direction="row" flexShrink={0}>
            {group.items.map((list) => (
              <NavListRoot key={list.title} list={list} />
            ))}
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}

export default memo(NavSectionHorizontal)
