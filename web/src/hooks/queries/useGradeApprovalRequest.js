import _ from 'lodash'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import * as api from 'src/apis/gradeApprovalRequest'

const queryFilterGradeApprovalRequest = (
  keys = {},
  filters = {},
  pagination = {},
  options
) => {
  const query = useQuery({
    queryKey: [
      'gradeApprovalRequests',
      ..._.values(keys),
      ..._.values(filters),
      ..._.values(pagination)
    ],
    queryFn: async () => {
      return await api.queryFilterGradeApprovalRequests(filters, pagination)
    },
    ...options
  })

  return query
}

const getGradeApprovalRequest = (id, keys = {}, options) => {
  const query = useQuery({
    queryKey: ['gradeApprovalRequests', id, ..._.values(keys)],
    queryFn: async () => {
      return await api.getGradeApprovalRequest(id)
    },
    ...options
  })

  return query
}

const approveGradeSubmission = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ id }) => {
      return await api.approveGradeSubmission(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['gradeApprovalRequests']
      })
    },
  })

  return mutation
}

const declineGradeSubmission = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ id }) => {
      return await api.declineGradeSubmission(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['gradeApprovalRequests']
      })
    }
  })

  return mutation
}

export default {
  queryFilterGradeApprovalRequest,
  approveGradeSubmission,
  declineGradeSubmission,
  getGradeApprovalRequest
}
