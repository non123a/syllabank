import axios from 'src/utils/axios'

export const listDepartment = async () => {
  const response = await axios.get('academic-structure/departments', {
    params: {
      'filter[is_active]': true
    }
  })
  return response.data
}

export const listDepartmentPreRegistration = async () => {
  const response = await axios.get('departments', {
    params: {
      'filter[is_active]': true
    }
  })
  return response.data
}

export const queryFilterDepartment = async (filter, pagination) => {
  const response = await axios.get(`academic-structure/departments`, {
    params: {
      'page[size]': pagination.rowsPerPage,
      'page[number]': pagination.page,
      'filter[code_name]': filter.code,
      'filter[full_name]': filter.name,
      'filter[is_active]': filter.status,
      'filter[faculty_id]': filter.facultyId,
      'filter[search]': filter.search
    }
  })
  return response.data
}

export const queryDepartmentById = async (id) => {
  const response = await axios.get(`academic-structure/departments/${id}`)
  return response.data
}

export const createDepartment = async (data) => {
  const response = await axios.post(`academic-structure/departments`, data)
  return response.data
}

export const updateDepartment = async (id, data) => {
  const response = await axios.put(`academic-structure/departments/${id}`, data)
  return response.data
}

export const disableADepartment = async (id) => {
  const response = await axios.patch(
    `academic-structure/departments/${id}/disable`
  )
  return response.data
}

export const enableADepartment = async (id) => {
  const response = await axios.patch(
    `academic-structure/departments/${id}/enable`
  )
  return response.data
}

export const assignHod = async (id, data) => {
  const response = await axios.put(
    `academic-structure/departments/${id}/hod`,
    data
  )
  return response.data
}
