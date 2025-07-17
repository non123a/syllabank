import _, { filter } from 'lodash'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import * as api from 'src/apis/me'

const getSchedules = (keys = {}, filters = {}, options) => {
  const query = useQuery({
    queryKey: [
      'me/schedules',
      ...Object.values(keys),
      ...Object.values(filters)
    ],
    queryFn: async () => {
      return await api.getMySchedules(filters)
    },
    ...options
  })

  return query
}

const getMyGradeRecords = (filters = {}, keys = {}, options) => {
  const query = useQuery({
    queryKey: ['me/grade-records', ..._.values(keys)],
    queryFn: async () => {
      return await api.getMyGradeRecords(filters)
    },
    ...options
  })

  return query
}

const infiniteQueryMyAcademicPeriods = (keys = {}, options) => {
  const query = useInfiniteQuery({
    queryKey: ['me/academic-periods', ..._.values(keys)],
    queryFn: async (params) =>
      await api.getMyAcademicPeriods({
        rowsPerPage: 10,
        page: params.pageParam
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.current_page < lastPage.data.last_page) {
        return lastPage.data.current_page + 1
      }
    },
    ...options
  })

  return query
}

const queryFilterAClassSectionStudents = (
  id,
  keys = {},
  filters = {},
  pagination = {},
  includes = '',
  options
) => {
  const query = useQuery({
    queryKey: [
      'me/sections/students',
      id,
      includes,
      ..._.values(keys),
      ..._.values(filters),
      ..._.values(pagination)
    ],
    queryFn: async () => {
      return await api.queryFilterAClassSectionStudentsOfMine(
        id,
        filters,
        includes,
        pagination
      )
    },
    ...options
  })

  return query
}

const queryFilterSections = (
  keys = {},
  filters = {},
  pagination = {},
  options
) => {
  const query = useQuery({
    queryKey: [
      'me/sections',
      ..._.values(keys),
      ..._.values(filters),
      ..._.values(pagination)
    ],
    queryFn: async () => {
      return await api.queryFilterMySections(filters, pagination)
    },
    ...options
  })

  return query
}

const queryGradeSubmissions = (
  keys = {},
  filters = {},
  pagination = {},
  options
) => {
  const query = useQuery({
    queryKey: [
      'me/sections/grade-submissions',
      ..._.values(keys),
      ..._.values(filters),
      ..._.values(pagination)
    ],
    queryFn: async () => {
      return await api.queryGradeSubmissionsOfMine(filters, pagination)
    },
    ...options
  })

  return query
}

const updateGradeSubmission = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await api.updateMyGradeSubmission(id, data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['me/sections', 'me/sections/grade-submissions']
      })
      await queryClient.invalidateQueries({
        queryKey: ['me/sections/grade-submissions']
      })
    }
  })

  return mutation
}

const updateMySummerGradeSubmission = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await api.updateMySummerGradeSubmission(id, data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['me/sections', 'me/sections/grade-submissions']
      })
      await queryClient.invalidateQueries({
        queryKey: ['me/sections/grade-submissions']
      })
    }
  })

  return mutation
}

const submitGradeApprovalRequest = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ id }) => {
      return await api.submitGradeRequestApprovalOfMine(id)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['me/sections']
      })
      await queryClient.invalidateQueries({
        queryKey: ['me/sections/grade-submissions']
      })
    }
  })

  return mutation
}

export default {
  getSchedules,
  getMyGradeRecords,
  queryFilterSections,
  queryGradeSubmissions,
  queryFilterAClassSectionStudents,
  infiniteQueryMyAcademicPeriods,
  updateGradeSubmission,
  updateMySummerGradeSubmission,
  submitGradeApprovalRequest
}
