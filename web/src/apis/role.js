import axios from 'src/utils/axios'

export const listRole = async () => {
  const response = await axios.get('rbac/roles')
  return response.data
}
