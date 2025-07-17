import PropTypes from 'prop-types'
import { Container, Alert, AlertTitle } from '@mui/material'
import useAuth from 'src/hooks/useAuth'
import _ from 'lodash'

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array,
  children: PropTypes.node
}

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const {
    user: { roles = [] }
  } = useAuth()

  if (_.difference(accessibleRoles, roles).length != 0) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    )
  }

  return <>{children}</>
}
