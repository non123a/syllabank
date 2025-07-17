import { useEffect } from 'react'
// next
import { useRouter } from 'next/router'
// routes
import { PATH_DASHBOARD } from 'src/routes/paths'

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, isReady, replace } = useRouter()

  useEffect(() => {
    if (pathname === PATH_DASHBOARD.admin.root && isReady) {
      replace(PATH_DASHBOARD.admin.list)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isReady])

  return null
}
