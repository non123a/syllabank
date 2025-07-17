import PropTypes from 'prop-types'
// @mui
import { styled } from '@mui/material/styles'
import { Link, Card, Typography, CardHeader, Stack } from '@mui/material'
// components
import Iconify from 'src/components/Iconify'

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2)
}))

// ----------------------------------------------------------------------

ProfileAbout.propTypes = {
  profile: PropTypes.object
}

export default function ProfileAbout({ profile }) {
  const { name, email, identification_number, roles, created_at } = profile

  return (
    <Card>
      <CardHeader title="About" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="body2">{name}</Typography>

        <Stack direction="row">
          <IconStyle icon={'eva:credit-card-outline'} />
          <Typography variant="body2">{identification_number}</Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'eva:email-fill'} />
          <Typography variant="body2">{email}</Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'carbon:user-role'} />
          <Typography variant="body2">{roles.join(', ')}</Typography>
        </Stack>
      </Stack>
    </Card>
  )
}
