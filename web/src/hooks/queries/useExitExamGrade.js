import _ from 'lodash'
import { useMutation, useQuery } from '@tanstack/react-query'
import * as api from 'src/apis/exitExamGrade'

const queryFilterExitExamGrades = (
  keys = {},
  filters = {},
  pagination,
  options = {}
) => {
  const query = useQuery({
    queryKey: [
      'exit-exam-grades',
      ..._.values(keys),
      ..._.values(filters),
      ..._.values(pagination)
    ],
    queryFn: async () => {
      return await api.queryFilterExitExamGrades(filters, pagination)
    },
    ...options
  })

  return query
}

const createExitExamGrade = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ studentId, academicYearId, grade }) => {
      return await api.createExitExamGrade({
        studentId,
        academicYearId,
        grade
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['exit-exam-grades']
      })
    }
  })

  return mutation
}

const updateExitExamGrade = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ id, ...data }) => {
      return await api.updateExitExamGrade(id, data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['exit-exam-grades']
      })
    }
  })

  return mutation
}

export default {
  queryFilterExitExamGrades,
  createExitExamGrade,
  updateExitExamGrade
}
