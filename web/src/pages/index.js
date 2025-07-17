import { useCallback, useEffect } from 'react'
// next
import { useRouter } from 'next/router'
// routes
import { PATH_AUTH, PATH_DASHBOARD } from 'src/routes/paths'
// layouts
import Layout from 'src/layouts'
import useAuth from 'src/hooks/useAuth'

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, isReady, replace, prefetch } = useRouter()

  const auth = useAuth()

  const getPathAfterLogin = useCallback(() => {
    if (
      auth.user.roles.includes('student') ||
      auth.user.roles.includes('instructor')
    ) {
      return PATH_DASHBOARD.general.home
    }
    if (auth.user.roles.includes('provost')) {
      return PATH_DASHBOARD.general.home
    }
    if (auth.user.roles.includes('dean')) {
      return PATH_DASHBOARD.general.home
    }

    if (auth.user.roles.includes('hod')) {
      return PATH_DASHBOARD.general.home
    }
    if (auth.user.roles.includes('super-admin')) {
      return PATH_DASHBOARD.general.home
    }
  }, [auth.user.roles])

  useEffect(() => {
    if (pathname === PATH_DASHBOARD.rootAlt && isReady) {
      replace(getPathAfterLogin())
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isReady, getPathAfterLogin])

  useEffect(() => {
    prefetch(getPathAfterLogin())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPathAfterLogin])

  return null
}

Index.getLayout = (page) => <Layout variant="dashboard">{page}</Layout>
