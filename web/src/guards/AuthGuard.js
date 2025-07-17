import PropTypes from 'prop-types'
// next
import { useRouter } from 'next/router'
// hooks
import useAuth from '../hooks/useAuth'
// components
import LoadingScreen from '../components/LoadingScreen'
// routes
import { PATH_AUTH } from 'src/routes/paths'

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node
}

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuth()

  const { pathname, replace } = useRouter()

  const notLoginPage = pathname !== PATH_AUTH.login

  if (!isInitialized) {
    return <LoadingScreen />
  }

  if (!isAuthenticated && notLoginPage) {
    replace(PATH_AUTH.login)
    return <></>
  }

  return <>{children}</>
}
