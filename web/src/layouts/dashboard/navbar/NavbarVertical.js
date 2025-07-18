import PropTypes from 'prop-types'
import { useEffect, useMemo } from 'react'
// next
import { useRouter } from 'next/router'
// @mui
import { Box, Drawer, Stack } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
// hooks
import useResponsive from 'src/hooks/useResponsive'
// config
import { NAVBAR } from 'src/config'
// utils
import cssStyles from 'src/utils/cssStyles'
// components
import Logo from 'src/components/Logo'
import Scrollbar from 'src/components/Scrollbar'
import { NavSectionVertical } from 'src/components/nav-section'
//
import useAuth from 'src/hooks/useAuth'
import navConfig from './NavConfig'
import CollapseButton from './CollapseButton'
import useCollapseDrawer from 'src/hooks/useCollapseDrawer'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter
    })
  }
}))

// ----------------------------------------------------------------------

NavbarVertical.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
}

export default function NavbarVertical({ isOpenSidebar, onCloseSidebar }) {
  const theme = useTheme()

  const { pathname } = useRouter()

  const isDesktop = useResponsive('up', 'lg')

  const {
    user: { permissions } = {
      permissions: []
    }
  } = useAuth()

  const {
    isCollapse,
    collapseClick,
    collapseHover,
    onToggleCollapse,
    onHoverEnter,
    onHoverLeave
  } = useCollapseDrawer()

  const navConfigMemo = useMemo(() => {
    return navConfig(permissions)
  }, [])

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Logo />

          {isDesktop && !isCollapse && (
            <CollapseButton
              onToggleCollapse={onToggleCollapse}
              collapseClick={collapseClick}
            />
          )}
        </Stack>
      </Stack>

      <NavSectionVertical navConfig={navConfigMemo} isCollapse={isCollapse} />

      <Box sx={{ py: 2.5 }}></Box>
    </Scrollbar>
  )

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse
            ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH
            : NAVBAR.DASHBOARD_WIDTH
        },
        ...(collapseClick && {
          position: 'absolute'
        })
      }}
    >
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH } }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              borderRightStyle: 'dashed',
              bgcolor: 'background.default',
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.standard
                }),
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH
              }),
              ...(collapseHover && {
                ...cssStyles(theme).bgBlur(),
                boxShadow: (theme) => theme.customShadows.z24
              })
            }
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  )
}
