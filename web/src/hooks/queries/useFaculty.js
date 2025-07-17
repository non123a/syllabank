import { useQuery, useMutation } from '@tanstack/react-query'
import * as api from 'src/apis/faculty'

const queryFilterFaculties = (
  keys = {},
  filters = {},
  pagination = {},
  options
) => {
  const query = useQuery({
    queryKey: [
      'academic-structure/faculties',
      ...Object.values(keys),
      ...Object.values(filters),
      ...Object.values(pagination)
    ],
    queryFn: async () => {
      return await api.queryFilterFaculty(filters, pagination)
    },
    ...options,
    enabled: options?.enabled ?? true
  })

  return query
}

const toggleFacultyStatus = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (id) => {
      return await api.toggleFacultyStatus(id)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['academic-structure/faculties']
      })
    }
  })

  return mutation
}

const createFaculty = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (data) => {
      return await api.createFaculty(data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['academic-structure/faculties']
      })
    }
  })

  return mutation
}

const updateFaculty = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ id, ...data }) => {
      return await api.updateFaculty(id, data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['academic-structure/faculties']
      })
    }
  })

  return mutation
}

const enableAFaculty = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (id) => {
      return await api.enableAFaculty(id)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['academic-structure/faculties']
      })
    }
  })

  return mutation
}

const disableAFaculty = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (id) => {
      return await api.disableAFaculty(id)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['academic-structure/faculties']
      })
    }
  })

  return mutation
}

const getAll = (options) => {
  const query = useQuery({
    queryKey: ['academic-structure/faculties'],
    queryFn: api.listFaculties,
    ...options,
    enabled: options?.enabled ?? true
  })

  return query
}

export default {
  queryFilterFaculties,
  toggleFacultyStatus,
  createFaculty,
  updateFaculty,
  enableAFaculty,
  disableAFaculty,
  getAll
}
