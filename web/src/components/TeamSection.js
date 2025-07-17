import { Icon } from '@iconify/react'
import {
  Typography,
  Grid,
  Card,
  Avatar,
  Container,
  Box,
  IconButton
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { m } from 'framer-motion'
import { MotionViewport, varFade } from 'src/components/animate'

const TeamMemberCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.background.darker,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.customShadows.z24
  }
}))

const teamMembers = [
  {
    name: 'Bunhab Ung',
    role: 'Tech Lead',
    avatar: '/avatars/bunhab.png',
    description: '":wq"',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/bunhab-ung-735b68255/',
      github: 'https://github.com/BunHab',
      telegram: 'https://t.me/BunHabu'
    }
  },
  {
    name: 'Haksrun Lao',
    role: 'Supervisor',
    avatar: '/avatars/haksrun.png',
    description: '',
    socialLinks: {}
  },
  {
    name: 'Vannara Som',
    role: 'Project Manager',
    avatar: '/avatars/vannara.png',
    description: '"When in doubt, look intelligent."',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/vannara-som-457043226/',
      github: 'https://github.com/somvannara',
      telegram: 'https://t.me/vannarasom'
    }
  }
]

// Separate members by role
const supervisor = teamMembers.find((member) => member.role === 'Supervisor')
const otherMembers = teamMembers.filter(
  (member) => member.role !== 'Supervisor'
)

const socialIcons = {
  linkedin: 'eva:linkedin-fill',
  github: 'eva:github-fill',
  telegram: 'mingcute:telegram-fill'
}

export default function TeamSection({ sectionRef }) {
  return (
    <Box
      ref={sectionRef}
      component={MotionViewport}
      sx={{
        position: 'relative',
        background: (theme) => theme.palette.background.default,
        minHeight: '100vh',
        py: { xs: 8, md: 30 }
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
            The people behind Sylla
            <Box component="span" sx={{ color: '#05a801' }}>
              Bank
            </Box>
          </Typography>
        </m.div>

        {/* Supervisor Card - Centered */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <m.div variants={varFade().inUp}>
              <TeamMemberCard>
                <Avatar
                  src={supervisor.avatar}
                  alt={supervisor.name}
                  sx={{
                    width: 160,
                    height: 160,
                    mb: 1.5,
                    border: (theme) => `4px solid ${theme.palette.primary.main}`
                  }}
                />
                <Typography variant="h5">{supervisor.name}</Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: 'primary.main', mb: 1 }}
                >
                  {supervisor.role}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1.5 }}
                >
                  {supervisor.description}
                </Typography>
                <Box sx={{ mt: 'auto', display: 'flex', gap: 1.5 }}>
                  {Object.entries(supervisor.socialLinks).map(
                    ([platform, link]) => (
                      <IconButton
                        key={platform}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: 'text.primary' }}
                      >
                        <Icon
                          icon={socialIcons[platform]}
                          width={24}
                          height={24}
                        />
                      </IconButton>
                    )
                  )}
                </Box>
              </TeamMemberCard>
            </m.div>
          </Grid>
        </Box>

        {/* Other Team Members - Side by Side */}
        <Grid container spacing={3} justifyContent="center">
          {otherMembers.map((member) => (
            <Grid key={member.name} item xs={12} sm={6} md={4}>
              <m.div variants={varFade().inUp}>
                <TeamMemberCard>
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{
                      width: 160,
                      height: 160,
                      mb: 1.5,
                      border: (theme) =>
                        `4px solid ${theme.palette.primary.main}`
                    }}
                  />
                  <Typography variant="h5">{member.name}</Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: 'primary.main', mb: 1 }}
                  >
                    {member.role}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5 }}
                  >
                    {member.description}
                  </Typography>
                  <Box sx={{ mt: 'auto', display: 'flex', gap: 1.5 }}>
                    {Object.entries(member.socialLinks).map(
                      ([platform, link]) => (
                        <IconButton
                          key={platform}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: 'text.primary' }}
                        >
                          <Icon
                            icon={socialIcons[platform]}
                            width={24}
                            height={24}
                          />
                        </IconButton>
                      )
                    )}
                  </Box>
                </TeamMemberCard>
              </m.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
