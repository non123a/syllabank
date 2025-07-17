import PropTypes from 'prop-types'
import { Alert, AlertTitle, Container } from '@mui/material'
import useAuth from 'src/hooks/useAuth'
import _ from 'lodash'

// ----------------------------------------------------------------------

PermissionBasedGuard.propTypes = {
  accessiblePermissions: PropTypes.array,
  variant: PropTypes.oneOf(['page', 'container']),
  children: PropTypes.node
}

export default function PermissionBasedGuard({
  accessiblePermissions = [],
  variant = 'page',
  children
}) {
  const {
    user: { permissions = [] }
  } = useAuth()

  if (_.difference(accessiblePermissions, permissions).length != 0) {
    if (variant === 'container') {
      return <></>
    }

    if (variant === 'page') {
      return (
        <Container>
          <Alert severity="error">
            <AlertTitle>Permission Denied</AlertTitle>
            You do not have permissions to access this page
          </Alert>
        </Container>
      )
    }
  }

  return <>{children}</>
}
