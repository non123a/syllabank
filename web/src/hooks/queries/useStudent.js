import { useMutation, useQuery } from '@tanstack/react-query'
import * as api from 'src/apis/student'

export const queryFilterStudentGradeSummary = (
  key = {},
  filter = {},
  pagination = {},
  options
) => {
  const query = useQuery({
    queryKey: [
      'users/students/grade-summary',
      ...Object.values(key),
      ...Object.values(filter),
      ...Object.values(pagination)
    ],
    queryFn: async () => {
      return await api.queryFilterStudentGradeSummary(filter, pagination)
    },
    ...options
  })

  return query
}

const queryFilter = (pagination = {}, filter = {}, key = {}, options) => {
  const query = useQuery({
    queryKey: [
      'users/students',
      ...Object.values(key),
      ...Object.values(pagination),
      ...Object.values(filter)
    ],
    queryFn: async () => {
      return await api.queryFilterStudents(filter, pagination)
    },
    ...options
  })

  return query
}

const disableAStudent = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ id }) => await api.disableAStudent(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users/students']
      })
    }
  })

  return mutation
}

const enableAStudent = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ id }) => await api.enableAStudent(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users/students']
      })
    }
  })

  return mutation
}

export default {
  queryFilterStudentGradeSummary,
  queryFilter,
  disableAStudent,
  enableAStudent
}
