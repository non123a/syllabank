import { useMutation, useQuery } from '@tanstack/react-query'
import * as api from 'src/apis/department'

const queryFilterDepartment = (
  keys = {},
  filters = {},
  pagination = {},
  options
) => {
  const query = useQuery({
    queryKey: [
      'school-structure/departments',
      ...Object.values(keys),
      ...Object.values(filters),
      ...Object.values(pagination)
    ],
    queryFn: async () => {
      return await api.queryFilterDepartment(filters, pagination)
    },
    ...options
  })

  return query
}

const toggleDepartmentStatus = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (id) => {
      return await api.toggleDepartmentStatus(id)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['school-structure/departments']
      })
    }
  })

  return mutation
}

const createDepartment = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (data) => {
      return await api.createDepartment(data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['school-structure/departments']
      })
    }
  })

  return mutation
}

const updateDepartment = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ id, ...data }) => {
      return await api.updateDepartment(id, data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['school-structure/departments']
      })
    }
  })

  return mutation
}

const enableADepartment = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (id) => {
      return await api.enableADepartment(id)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['school-structure/departments']
      })
    }
  })

  return mutation
}

const disableADepartment = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (id) => {
      return await api.disableADepartment(id)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['school-structure/departments']
      })
    }
  })

  return mutation
}

const getAll = (options) => {
  const query = useQuery({
    queryKey: ['school-structure/departments'],
    queryFn: api.listDepartment,
    ...options,
    enabled: options?.enabled ?? true
  })

  return query
}

export default {
  queryFilterDepartment,
  toggleDepartmentStatus,
  createDepartment,
  updateDepartment,
  enableADepartment,
  disableADepartment,
  getAll
}
