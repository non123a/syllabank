import { Container, Typography, Box, Grid, Fade } from '@mui/material'
import { styled } from '@mui/material/styles'
import { m } from 'framer-motion'
import Page from 'src/components/Page'
import Layout from 'src/layouts'
import { MotivationIllustration } from 'src/assets'
import Logo from 'src/components/Logo'
import { useEffect, useRef, useState } from 'react'
import { MotionViewport, varFade } from 'src/components/animate'
import TeamSection from 'src/components/TeamSection'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ContributorSection from 'src/components/ContributorSection'

const RootStyle = styled('div')(({ theme }) => ({
  height: '100vh',
  position: 'relative',
  overflow: 'hidden'
}))

const SectionStyle = styled('div')(({ theme }) => ({
  height: '100vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  transition: 'transform 0.8s ease-in-out',
  padding: theme.spacing(15, 10, 30)
}))

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'fixed',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7)
  }
}))

const ScrollHintStyle = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  zIndex: 10,
  transition: 'opacity 0.3s ease-in-out',
  '& .MuiSvgIcon-root': {
    animation: 'bounce 2s infinite'
  },
  '@keyframes bounce': {
    '0%, 20%, 50%, 80%, 100%': {
      transform: 'translateY(0)'
    },
    '40%': {
      transform: 'translateY(-10px)'
    },
    '60%': {
      transform: 'translateY(-5px)'
    }
  }
}))

AboutUs.getLayout = function getLayout(page) {
  return <Layout variant="guest">{page}</Layout>
}

export default function AboutUs() {
  const [currentSection, setCurrentSection] = useState(0)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const sections = 3
  const isScrollingRef = useRef(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    // Show scroll hint after 2 seconds of inactivity
    timeoutRef.current = setTimeout(() => {
      setShowScrollHint(true)
    }, 2000)

    const handleActivity = () => {
      setShowScrollHint(false)
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setShowScrollHint(true)
      }, 2000)
    }

    window.addEventListener('wheel', handleActivity)
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)

    return () => {
      clearTimeout(timeoutRef.current)
      window.removeEventListener('wheel', handleActivity)
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
    }
  }, [])

  useEffect(() => {
    const handleScroll = (e) => {
      if (isScrollingRef.current) return

      isScrollingRef.current = true

      if (e.deltaY > 0 && currentSection < sections - 1) {
        setCurrentSection((prev) => prev + 1)
      } else if (e.deltaY < 0 && currentSection > 0) {
        setCurrentSection((prev) => prev - 1)
      }

      setTimeout(() => {
        isScrollingRef.current = false
      }, 800)
    }

    window.addEventListener('wheel', handleScroll, { passive: false })
    return () => window.removeEventListener('wheel', handleScroll)
  }, [currentSection])

  return (
    <Page title="About Us | Syllabi Management System">
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>

        <Box
          sx={{
            transform: `translateY(-${currentSection * 100}vh)`,
            transition: 'transform 0.8s ease-in-out'
          }}
        >
          <SectionStyle>
            <Container component={MotionViewport} maxWidth="lg">
              <Grid container spacing={5} alignItems="center">
                <Grid item xs={12} md={6}>
                  <m.div variants={varFade().inLeft}>
                    <Typography variant="h2" gutterBottom>
                      Sylla
                      <Box component="span" sx={{ color: '#05a801' }}>
                        Bank
                      </Box>
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      Paragon International University School's Syllabi
                      Management System
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 3, mb: 2 }}>
                      SyllaBank is a comprehensive syllabi management solution
                      designed specifically for Paragon International
                      University. Our platform streamlines the creation,
                      management, and distribution of course syllabi across all
                      departments.
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Our mission is to simplify the academic planning process
                      by providing:
                    </Typography>

                    <Box component="ul" sx={{ pl: 4, mb: 3 }}>
                      <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                        Standardized syllabus templates
                      </Typography>
                      <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                        Efficient approval workflows
                      </Typography>
                      <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                        Centralized document management
                      </Typography>
                      <Typography component="li" variant="body1">
                        Easy collaboration between faculty members
                      </Typography>
                    </Box>

                    <Typography variant="body1">
                      Built with modern technologies and user-centric design,
                      SyllaBank ensures a seamless experience for all
                      stakeholders involved in the syllabus creation and
                      management process.
                    </Typography>
                  </m.div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <m.div variants={varFade().inRight}>
                    <Box
                      sx={{ p: 3, width: '100%', maxWidth: 360, mx: 'auto' }}
                    >
                      <MotivationIllustration />
                    </Box>
                  </m.div>
                </Grid>
              </Grid>
            </Container>
          </SectionStyle>

          <SectionStyle>
            <Container maxWidth="lg">
              <TeamSection />
            </Container>
          </SectionStyle>

          <SectionStyle>
            <Container maxWidth="lg">
              <ContributorSection />
            </Container>
          </SectionStyle>
        </Box>

        <Fade in={showScrollHint}>
          <ScrollHintStyle>
            {currentSection === 0 ? (
              <>
                <Typography variant="caption" sx={{ mb: 1 }}>
                  Scroll down to meet our team
                </Typography>
                <KeyboardArrowDownIcon />
              </>
            ) : currentSection === 1 ? (
              <>
                <Typography variant="caption" sx={{ mb: 1 }}>
                  Scroll down to see how you can contribute
                </Typography>
                <KeyboardArrowDownIcon />
              </>
            ) : (
              <>
                <KeyboardArrowUpIcon />
                <Typography variant="caption" sx={{ mt: 1 }}>
                  Scroll up to meet our team
                </Typography>
              </>
            )}
          </ScrollHintStyle>
        </Fade>
      </RootStyle>
    </Page>
  )
}
