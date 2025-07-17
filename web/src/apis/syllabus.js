import axios from 'src/utils/axios'
import useAuth from 'src/hooks/useAuth'
import { useMutation, useQuery } from '@tanstack/react-query'

export const querySyllabi = () => {
  const { user } = useAuth()
  return useQuery(['syllabi', user.id], () => axios.get('/syllabi'))
}

export const queryAssignedCourses = () => {
  const { user } = useAuth()
  return useQuery(['assigned-courses', user.id], () =>
    axios.get('/syllabi/assigned-courses')
  )
}

export const createSyllabus = (data) => {
  const response = axios.post('/syllabus/create', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

export const saveSyllabusProgress = (data) => {
  return useMutation(['save-syllabus-progress', user.id], (data) =>
    axios.post('/syllabi/save-progress', data)
  )
}

export const submitSyllabusToHOD = (data) => {
  return useMutation(['submit-syllabus-to-hod', user.id], (data) =>
    axios.post('/syllabi/submit', data)
  )
}

export const uploadSyllabusFile = (data) => {
  return useMutation(['upload-syllabus-file', user.id], (data) =>
    axios.post('/syllabi/upload', data)
  )
}

export const getMySyllabi = async (filters, pagination) => {
  return await axios.get('/me/syllabi', {
    params: {
      'page[size]': pagination.rowsPerPage,
      'page[number]': pagination.page,
      'filter[search]': filters.search,
      'filter[status]': filters.status
    }
  })
}

export const queryApprovedSyllabi = async (filters, pagination) => {
  return await axios.get('syllabus', {
    params: {
      'page[size]': pagination.rowsPerPage,
      'page[number]': pagination.page,
      'filter[search]': filters.search,
      'filter[status]': 'approved'
    }
  })
}

export const previewTemplate = (templateId) =>
  axios.get(`/syllabi/preview-template/${templateId}`)

export const getTemplates = () =>
  axios.get('/syllabus/templates', { params: { is_active: true } })
export const getTemplateContent = (templateId) =>
  axios.get(`/syllabus/templates/${templateId}`)

export const showSyllabus = (id) => axios.get(`/syllabi/${id}`)
