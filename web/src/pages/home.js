import { Container, Typography, Box, Grid, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import Page from 'src/components/Page'
import Layout from 'src/layouts'
import { MotivationIllustration } from 'src/assets'
import { PATH_DASHBOARD } from 'src/routes/paths'
import NextLink from 'next/link'
import useSettings from 'src/hooks/useSettings'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'

const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
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

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default function Home() {
  const { themeStretch } = useSettings()

  return (
    <Page title="Welcome to Syllabi Management System">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Grid container spacing={5} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" gutterBottom>
              Welcome to SyllaBank:
            </Typography>
            <Typography variant="h2" color="primary" gutterBottom>
              Syllabi Management System
            </Typography>
            <Typography variant="body1" sx={{ mt: 3, mb: 5 }}>
              Streamline your academic planning with our comprehensive Syllabi
              management solution for Paragon School.
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 3, mb: 5, fontWeight: 'bold', color: 'primary.main' }}
            >
              Important: Your first step should be to change your password! By
              clicking the button below.
            </Typography>
            <NextLink href={PATH_DASHBOARD.settings.root} passHref>
              <Button size="large" variant="contained">
                Get Started
              </Button>
            </NextLink>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, width: '100%', maxWidth: 360 }}>
              <MotivationIllustration />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}
