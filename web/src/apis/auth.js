import { apiPath, authConfig, authPath, fortifyPath } from 'src/config'
import axios from 'src/utils/axios'

export const getCSRF = async () => {
  return await axios.get(authConfig.csrfTokenPath, {
    baseURL: authPath
  })
}

export const getUser = async () => {
  return await axios.get(authConfig.mePath)
}

export const register = async (params) => {
  return await axios.post(authConfig.registerPath, params, {
    baseURL: authPath
  })
}

export const login = async (params) => {
  return await axios.post(authConfig.loginPath, params, {
    baseURL: fortifyPath
  })
}

export const logout = async () => {
  return await axios.post(authConfig.logoutPath, null, {
    baseURL: authPath
  })
}

export const forgotPassword = async (data) => {
  return await axios.post(authConfig.forgotPasswordPath, data, {
    baseURL: authPath
  })
}

export const resetPassword = async (data) => {
  return await axios.put(authConfig.resetPasswordPath, data, {
    baseURL: authPath
  })
}

export const setPassword = async (data) => {
  return await axios.put(authConfig.setPasswordPath, data, {
    baseURL: authPath
  })
}

export const verify2FA = async (data) => {
  return await axios.post(authConfig.verify2FAPath, data, {
    baseURL: fortifyPath
  })
}
