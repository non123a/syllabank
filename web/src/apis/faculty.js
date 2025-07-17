import axios from 'src/utils/axios'

export const listFaculties = async () => {
  const response = await axios.get(`academic-structure/faculties`)
  return response.data
}

export const queryFilterFaculty = async (filter, pagination) => {
  const response = await axios.get(`academic-structure/faculties`, {
    params: {
      'page[size]': pagination.rowsPerPage,
      'page[number]': pagination.page,
      'filter[is_active]': filter.status,
      'filter[search]': filter.search
    }
  })
  return response.data
}

export const queryFacultyById = async (id) => {
  const response = await axios.get(`academic-structure/faculties/${id}`)
  return response.data
}

export const createFaculty = async (data) => {
  const response = await axios.post(`academic-structure/faculties`, data)
  return response.data
}

export const updateFaculty = async (id, data) => {
  const response = await axios.put(`academic-structure/faculties/${id}`, data)
  return response.data
}

export const disableAFaculty = async (id) => {
  const response = await axios.patch(
    `academic-structure/faculties/${id}/disable`
  )
  return response.data
}

export const enableAFaculty = async (id) => {
  const response = await axios.patch(
    `academic-structure/faculties/${id}/enable`
  )
  return response.data
}

export const assignDean = async (id, data) => {
  const response = await axios.put(
    `academic-structure/faculties/${id}/dean`,
    data
  )
  return response.data
}
