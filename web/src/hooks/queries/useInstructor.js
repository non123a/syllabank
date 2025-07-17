import { useMutation, useQuery } from '@tanstack/react-query'
import * as api from 'src/apis/instructor'

const getById = (id, keys = {}, options = {}) => {
  const query = useQuery({
    queryKey: ['users/instructors', id, ...Object.values(keys)],
    queryFn: async () => await api.getById(id),
    ...options
  })

  return query
}

const updateInstructor = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await api.updateInstructor(id, data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users/instructors']
      })
    }
  })

  return mutation
}

export default {
  getById,
  updateInstructor
}
