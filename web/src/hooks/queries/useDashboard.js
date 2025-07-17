import _ from 'lodash'
import { useQuery } from '@tanstack/react-query'
import * as api from 'src/apis/dashboard'

const queryStudentRegisteredpassedFailedCount = (
  keys = {},
  filters = {},
  options = {}
) => {
  const query = useQuery({
    queryKey: [
      'dashboard/student-registered-passed-failed-count',
      ..._.values(keys),
      ..._.values(filters)
    ],
    queryFn: async () =>
      await api.queryStudentRegisteredpassedFailedCount(filters),
    ...options
  })

  return query
}

const queryDashboardStudentsRegisteredPassedFailed = (
  keys = {},
  filters = {},
  pagination = {},
  options = {}
) => {
  const query = useQuery({
    queryKey: [
      'dashboard/students-registered-passed-failed',
      ..._.values(keys),
      ..._.values(filters),
      ..._.values(pagination)
    ],
    queryFn: async () =>
      await api.queryDashboardStudentsRegisteredPassedFailed(filters),
    ...options
  })

  return query
}

const queryStudentsLevelAllocation = (
  keys = {},
  filters = {},
  pagination = {},
  options = {}
) => {
  const query = useQuery({
    queryKey: [
      'dashboard/students-level-allocation',
      ..._.values(keys),
      ..._.values(filters),
      ..._.values(pagination)
    ],
    queryFn: async () => await api.queryStudentsLevelAllocation(filters),
    ...options
  })

  return query
}

export default {
  queryStudentRegisteredpassedFailedCount,
  queryDashboardStudentsRegisteredPassedFailed,
  queryStudentsLevelAllocation
}
