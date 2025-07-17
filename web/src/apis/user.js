import axios from 'src/utils/axios'

export const queryFilterUsers = async (filter, pagination) => {
  return await axios.get('users', {
    params: {
      'page[size]': pagination.rowsPerPage,
      'page[number]': pagination.page,
      'filter[role]': filter.role,
      'filter[is_active]': filter.is_active,
      'filter[department]': filter.department,
      'filter[faculty]': filter.faculty,
      'filter[search]': filter.search
    }
  })
}

export const queryInstructors = async (filter) => {
  return await axios.get('users', {
    params: {
      'page[search]': filter.search,
      'filter[role]': 'instructor'
    }
  })
}

export const queryUserById = async (id) => {
  return await axios.get(`users/${id}`)
}

export const registerUser = async (data) => {
  return await axios.post('users', data)
}

export const updateUser = async (id, data) => {
  return await axios.patch(`users/${id}`, data)
}

export const disableAUser = async (id) => {
  return await axios.patch(`users/${id}/disable`)
}

export const enableAUser = async (id) => {
  return await axios.patch(`users/${id}/enable`)
}
