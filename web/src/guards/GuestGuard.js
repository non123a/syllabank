import PropTypes from 'prop-types'
// next
import { useRouter } from 'next/router'
// hooks
import useAuth from '../hooks/useAuth'
// configs
import LoadingScreen from 'src/components/LoadingScreen'
import { PATH_DASHBOARD } from 'src/routes/paths'

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node
}

export default function GuestGuard({ children }) {
  const { replace } = useRouter()

  const { isAuthenticated, isInitialized } = useAuth()

  if (!isInitialized) {
    return <LoadingScreen />
  }

  if (isAuthenticated) {
    replace(PATH_DASHBOARD.rootAlt)
    return <></>
  }

  return <>{children}</>
}
