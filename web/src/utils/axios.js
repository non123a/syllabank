import axios from 'axios'
import { PATH_AUTH } from 'src/routes/paths'
import Router from 'next/router'
import { getCSRF } from 'src/apis/auth'
import { apiPath } from 'src/config'

// ----------------------------------------------------------------------

export const baseAxios = axios.create({
  withCredentials: true,
  baseURL: apiPath,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

class AxiosInterceptorManager {
  constructor(baseAxiosInstance) {
    this.interceptors = {
      request: [],
      response: []
    }
    this.axiosInstance = baseAxiosInstance
  }

  registerRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor)
  }

  registerResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor)
  }

  applyInterceptors() {
    this.interceptors.request.forEach((interceptor) => {
      this.axiosInstance.interceptors.request.use(...interceptor)
    })

    this.interceptors.response.forEach((interceptor) => {
      this.axiosInstance.interceptors.response.use(...interceptor)
    })
  }

  get axios() {
    return this.axiosInstance
  }
}

const manager = new AxiosInterceptorManager(baseAxios)

const getCsrfTokenBeforeUnSafeRequest = [
  async (config) => {
    if (
      ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())
    ) {
      await getCSRF()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
]

const ignoredPaths = [PATH_AUTH.login, PATH_AUTH.setPassword, '/404', '/500']

const redirectToLoginOnUnAuthenticatedOrUnAuthorizedResponse = [
  (response) => response,
  (error) => {
    if (
      (error.response.status === 401 || error.response.status === 403) &&
      !ignoredPaths.includes(Router.pathname)
    ) {
      Router.push(PATH_AUTH.login)
    }
    return Promise.reject(error)
  }
]

manager.registerResponseInterceptor(
  redirectToLoginOnUnAuthenticatedOrUnAuthorizedResponse
)

manager.registerRequestInterceptor(getCsrfTokenBeforeUnSafeRequest)

manager.applyInterceptors()

export default manager.axios
