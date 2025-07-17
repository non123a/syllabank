import { useEffect } from 'react'
// next
import { useRouter } from 'next/router'
// routes
import { PATH_DASHBOARD } from 'src/routes/paths'

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, push } = useRouter()

  useEffect(() => {
    if (pathname === PATH_DASHBOARD.syllabus.root) {
      push(PATH_DASHBOARD.syllabus.view)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}
