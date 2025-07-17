import { useState } from 'react'
// next
import NextLink from 'next/link'
// @mui
import { styled } from '@mui/material/styles'
import { Box, Button, Container, Typography } from '@mui/material'
// routes
import { PATH_AUTH } from 'src/routes/paths'
// layouts
import Layout from 'src/layouts'
// components
import Page from 'src/components/Page'
// sections
import { SetPasswordForm } from 'src/sections/auth/reset-password'
// guards
import GuestGuard from 'src/guards/GuestGuard'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}))

// ----------------------------------------------------------------------

SetPassword.getLayout = function getLayout(page) {
  return <Layout variant="logoOnly">{page}</Layout>
}

// ----------------------------------------------------------------------

export default function SetPassword() {
  const [sent, setSent] = useState(false)

  return (
    <GuestGuard>
      <Page title="Reset Password" sx={{ height: 1 }}>
        <RootStyle>
          <Container>
            {!sent && (
              <Box sx={{ maxWidth: 480, mx: 'auto' }}>
                <SetPasswordForm onSent={() => setSent(true)} />
              </Box>
            )}

            {sent && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" gutterBottom>
                  New password has been set successfully.
                </Typography>
                <Typography>
                  Try signing in with your new password.
                  <br />
                  <NextLink href={PATH_AUTH.login} passHref>
                    <Button size="large" variant="contained" sx={{ mt: 5 }}>
                      Login
                    </Button>
                  </NextLink>
                </Typography>
              </Box>
            )}
          </Container>
        </RootStyle>
      </Page>
    </GuestGuard>
  )
}

export async function getServerSideProps(context) {
  const { token, email } = context.query

  if (!token || !email) {
    return {
      redirect: {
        destination: '/404',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
