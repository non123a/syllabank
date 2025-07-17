// @mui
import { styled } from '@mui/material/styles'
import {
  Box,
  Card,
  Stack,
  Container,
  Typography,
  Link,
  Divider
} from '@mui/material'
// next
import NextLink from 'next/link'
// hooks
import useResponsive from 'src/hooks/useResponsive'
// components
import Page from 'src/components/Page'
import Logo from 'src/components/Logo'
// sections
import { LoginForm } from 'src/sections/auth/login'
import Layout from 'src/layouts'
import { PATH_DASHBOARD } from 'src/routes/paths'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}))

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7)
  }
}))

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}))

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}))

const FooterStyle = styled('footer')(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'right',
  alignItems: 'center'
}))

// ----------------------------------------------------------------------

export default function Login() {
  const mdUp = useResponsive('up', 'md')

  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Sign in
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Please enter your credentials.
                </Typography>
              </Box>
            </Stack>
            <LoginForm />
          </ContentStyle>
        </Container>

        <FooterStyle>
          <NextLink href={PATH_DASHBOARD.about} passHref>
            <Link variant="body2" sx={{ color: 'text.secondary' }}>
              About Us
            </Link>
          </NextLink>
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            SyllaBank {process.env.NEXT_PUBLIC_APP_VERSION || 'v1.0'}
          </Typography>
        </FooterStyle>
      </RootStyle>
    </Page>
  )
}

Login.getLayout = (page) => <Layout variant="guest">{page}</Layout>
