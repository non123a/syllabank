import axios from 'src/utils/axios'

export const queryFilterInstructors = async (filter, pagination) => {
  return await axios.get('users/instructors', {
    params: {
      'page[size]': pagination.rowsPerPage,
      'page[number]': pagination.page,
      'filter[name,email,identification]': filter.name
    }
  })
}

export const registerInstructor = async (data) => {
  return await axios.post('users/instructor', data)
}

export const getById = async (id) => {
  return await axios.get(`users/instructors/${id}`)
}

export const updateInstructor = async (id, data) => {
  return await axios.patch(`users/instructors/${id}`, {
    name: data.name
  })
}
