import PropTypes from 'prop-types'
// guards
import AuthGuard from '../guards/AuthGuard'
// components
import DashboardLayout from './dashboard'
import LogoOnlyLayout from './LogoOnlyLayout'
import GuestGuard from 'src/guards/GuestGuard'

// ----------------------------------------------------------------------

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['dashboard', 'main', 'guest', 'logoOnly'])
}

export default function Layout({ variant = 'dashboard', children }) {
  if (variant === 'logoOnly') {
    return <LogoOnlyLayout> {children} </LogoOnlyLayout>
  }

  if (variant === 'guest') {
    return <GuestGuard> {children} </GuestGuard>
  }

  return (
    <AuthGuard>
      <DashboardLayout> {children} </DashboardLayout>
    </AuthGuard>
  )
}
