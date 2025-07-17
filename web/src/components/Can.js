import PropTypes from 'prop-types'
import useAuth from 'src/hooks/useAuth'

Can.propTypes = {
  I: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default function Can({ I, children }) {
  const { user: { permissions = [] } = {} } = useAuth()

  if (!permissions.includes(I)) {
    return null
  }

  if (typeof children === 'function') {
    return children({ permissions })
  }

  return children
}
