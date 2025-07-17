import axios from 'src/utils/axios'

export const queryFilterAdmins = async (filter, pagination) => {
  return await axios.get('users/admins', {
    params: {
      'page[size]': pagination.rowsPerPage,
      'page[number]': pagination.page,
      'filter[name,email,identification]': filter.name
    }
  })
}

export const getAdminById = async (id) => {
  return await axios.get(`users/admins/${id}`)
}

export const createAdmin = async (data) => {
  return await axios.post('users/admins', {
    identification: data.identification,
    name: data.name,
    email: data.email
  })
}

export const updateAdmin = async (id, data) => {
  return await axios.patch(`users/admins/${id}`, {
    name: data.name
  })
}

export const deleteAdmin = async (id) => {
  return await axios.delete(`users/admins/${id}`)
}

export const enableAdmin = async (id) => {
  return await axios.patch(`users/admins/${id}/enable`)
}

export const disableAdmin = async (id) => {
  return await axios.patch(`users/admins/${id}/disable`)
}
