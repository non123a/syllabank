import { Icon } from '@iconify/react'
import {
  Typography,
  Grid,
  Card,
  Container,
  Box,
  Button,
  Stack
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { m } from 'framer-motion'
import { MotionViewport, varFade } from 'src/components/animate'

const ContributorCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.background.darker,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.customShadows.z24
  }
}))

export default function ContributorSection({ sectionRef }) {
  return (
    <Box
      ref={sectionRef}
      component={MotionViewport}
      sx={{
        position: 'relative',
        background: (theme) => theme.palette.background.default,
        minHeight: '100vh',
        py: { xs: 8, md: 15 }
      }}
    >
      <Container maxWidth="lg">
        <m.div variants={varFade().inUp}>
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              mb: { xs: 3, md: 5 }
            }}
          >
            Carry Forward the Legacy of Sylla
            <Box component="span" sx={{ color: '#05a801' }}>
              Bank
            </Box>
          </Typography>
        </m.div>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <m.div variants={varFade().inUp}>
              <ContributorCard>
                <Icon
                  icon="mdi:torch"
                  width={80}
                  height={80}
                  style={{ color: '#05a801' }}
                />
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Take the Torch Forward
                </Typography>
                <Stack spacing={2} sx={{ mb: 3, textAlign: 'left' }}>
                  <Typography variant="body1" color="text.secondary">
                    SyllaBank was created with a vision to revolutionize
                    syllabus management at Paragon International University. As
                    we pass on this project, we invite future developers to:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
                    <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                      Enhance and evolve the platform
                    </Typography>
                    <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                      Add new features for future needs
                    </Typography>
                    <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                      Maintain and improve the codebase
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  href={process.env.NEXT_PUBLIC_CONTRIBUTOR_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<Icon icon="mdi:hand-heart" />}
                >
                  Express Interest
                </Button>
              </ContributorCard>
            </m.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
