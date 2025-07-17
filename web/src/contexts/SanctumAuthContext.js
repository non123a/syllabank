import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { PATH_AFTER_LOGIN, PATH_AFTER_VERIFY, PATH_AUTH } from 'src/config'
import useIsMountedRef from 'src/hooks/useIsMountedRef'
import {
  getUser,
  register as apiRegister,
  login as apiLogin,
  logout as apiLogout
} from 'src/apis/auth'
import { CircularProgress } from '@mui/material'
import { useQuery } from '@tanstack/react-query'

const initialState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: true
}

const defaultProvider = {
  ...initialState,
  setUser: () => null,
  setLoading: () => Boolean,
  register: () => Promise.resolve(),
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

function AuthProvider({ children }) {
  const isMounted = useIsMountedRef()
  const [user, setUser] = useState(defaultProvider.user)
  const router = useRouter()
  const [hasNavigated, setHasNavigated] = useState(false)

  const {
    refetch,
    isFetching: loading,
    isFetched: isInitialized,
    isSuccess: isAuthenticated
  } = useQuery({
    queryKey: ['me/profile'],
    queryFn: async () => {
      const response = await getUser()
      const data = response.data
      if (data) {
        setUser(data)
      } else {
        setUser(null)
      }
      return data
    },
    retry: false,
    enabled: isMounted.current,
    refetchOnWindowFocus: false
  })

  const navigateToPathAfterLogin = async () => {
    await navigateToPath(PATH_AFTER_LOGIN)
  }

  const navigateToPath = async (path) => {
    router.replace(path).then((navigated) => {
      setHasNavigated(navigated)
    })
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigateToPathAfterLogin()
    }
  }, [isAuthenticated])

  const register = async (params) => {
    return apiRegister(params)
      .then(async () => {
        await refetch()
        navigateToPathAfterLogin()
      })
      .catch((err) => console.error(err))
  }

  const login = async (params, errorCallback) => {
    try {
      const loginResponse = await apiLogin(params)
      if (loginResponse.data.two_factor) {
        navigateToPath(PATH_AFTER_VERIFY)
        return
      } else {
        await refetch()
      }
    } catch (err) {
      if (errorCallback) errorCallback(err)
    }
  }

  const logout = async () => {
    return apiLogout()
      .then(async () => {
        await refetch()
      })
      .finally(async () => {
        setUser(null)
      })
      .catch((err) => console.error(err))
  }

  const values = {
    refetchUserProfile: refetch,
    isAuthenticated,
    isInitialized,
    user,
    loading,
    setUser,
    register,
    login,
    logout
  }

  if (loading && !hasNavigated) return <CircularProgress />

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
