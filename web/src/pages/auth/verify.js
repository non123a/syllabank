// next
import NextLink from 'next/link'
// @mui
import { styled } from '@mui/material/styles'
import { Box, Button, Link, Container, Typography } from '@mui/material'
// routes
import { PATH_AUTH } from 'src/routes/paths'
// layouts
import Layout from 'src/layouts'
// components
import Page from 'src/components/Page'
import Iconify from 'src/components/Iconify'
// sections
import { VerifyCodeForm } from 'src/sections/auth/verify-code'
import { logout } from 'src/apis/auth'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0)
}))

const supportUrl =
  process.env.NEXT_PUBLIC_SUPPORT_URL ||
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

// ----------------------------------------------------------------------

VerifyCode.getLayout = function getLayout(page) {
  return <Layout variant="logoOnly">{page}</Layout>
}

// ----------------------------------------------------------------------

export default function VerifyCode() {
  return (
    <Page title="Verify" sx={{ height: 1 }}>
      <RootStyle>
        <Container>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            <NextLink href={PATH_AUTH.login} passHref>
              <Button
                size="small"
                onClick
                startIcon={
                  <Iconify
                    icon={'eva:arrow-ios-back-fill'}
                    width={20}
                    height={20}
                  />
                }
                sx={{ mb: 3 }}
              >
                Back
              </Button>
            </NextLink>

            <Typography variant="h3" paragraph>
              Please check your authentication apps!
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              There should be a 6-digit confirmation code to
              xxx@paragoniu.edu.kh, please enter the code in below box to verify
              your email. or use your recovery code to login.
            </Typography>

            <Box sx={{ mt: 5, mb: 3 }}>
              <VerifyCodeForm />
            </Box>

            <Typography variant="body2" align="center">
              Don’t have either? &nbsp;
              <Link
                variant="subtitle2"
                underline="none"
                href={supportUrl}
                onClick={() => {}}
              >
                Contact Support
              </Link>
            </Typography>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  )
}
