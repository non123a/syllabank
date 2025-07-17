import { useSnackbar } from 'notistack'
import { useState } from 'react'
// next
import NextLink from 'next/link'
import { useRouter } from 'next/router'
// @mui
import { alpha } from '@mui/material/styles'
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material'
// routes
import { PATH_DASHBOARD, PATH_AUTH } from 'src/routes/paths'
// hooks
import useAuth from 'src/hooks/useAuth'
import useIsMountedRef from 'src/hooks/useIsMountedRef'
// components
import MyAvatar from 'src/components/MyAvatar'
import MenuPopover from 'src/components/MenuPopover'
import { IconButtonAnimate } from 'src/components/animate'

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Settings',
    linkTo: PATH_DASHBOARD.settings.root
  }
]

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter()

  const { user, logout } = useAuth()

  const isMountedRef = useIsMountedRef()

  const { enqueueSnackbar } = useSnackbar()

  const [open, setOpen] = useState(null)

  const handleOpen = (event) => {
    setOpen(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(null)
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.replace(PATH_AUTH.login)

      if (isMountedRef.current) {
        handleClose()
      }
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Unable to logout!', { variant: 'error' })
    }
  }

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8)
            }
          })
        }}
      >
        <MyAvatar />
      </IconButtonAnimate>

      <MenuPopover
        disabledArrow
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75
          }
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {user?.roles &&
                user.roles.map((role, index) => (
                  <Typography
                    key={index}
                    variant="contained"
                    component="span"
                    sx={{
                      display: 'inline-block',
                      mr: 0.5,
                      mb: 0.5,
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      fontSize: '0.75rem'
                    }}
                  >
                    {role === 'hod'
                      ? 'Head of Department'
                      : role.charAt(0).toUpperCase() + role.slice(1)}
                  </Typography>
                ))}
            </Box>
          </Typography>
        </Box>

        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Faculty: {user?.faculty || 'Not specified'}
          </Typography>
        </Box>

        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Department: {user?.department || 'Not specified'}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <NextLink key={option.label} href={option.linkTo} passHref>
              <MenuItem key={option.label} onClick={handleClose}>
                {option.label}
              </MenuItem>
            </NextLink>
          ))}
        </Stack>

        <MenuItem
          onClick={handleLogout}
          sx={{
            mx: 1,
            mb: 1,
            color: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            transition: (theme) => theme.transitions.create('all'),
            transitionDuration: '500ms',
            ':hover': {
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.22),
              transition: (theme) => theme.transitions.create('all'),
              transitionDuration: '500ms'
            }
          }}
        >
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  )
}
