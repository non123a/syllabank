import { useMutation, useQuery } from '@tanstack/react-query'
import * as api from 'src/apis/user'

const queryFilter = (pagination = {}, filter = {}, key = {}, options) => {
  const query = useQuery({
    queryKey: [
      'users',
      ...Object.values(key),
      ...Object.values(pagination),
      ...Object.values(filter)
    ],
    queryFn: async () => {
      return await api.queryFilterUsers(filter, pagination)
    },
    ...options
  })

  return query
}

const disableAUser = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ id }) => await api.disableAUser(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users']
      })
    }
  })

  return mutation
}

const enableAUser = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ id }) => await api.enableAUser(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users']
      })
    }
  })

  return mutation
}

export default {
  queryFilter,
  disableAUser,
  enableAUser
}
