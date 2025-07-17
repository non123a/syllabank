import { useMutation, useQuery } from '@tanstack/react-query'
import * as api from 'src/apis/course'

const queryFilterCourses = (
  key = {},
  filter = {},
  pagination = {},
  options
) => {
  const query = useQuery({
    queryKey: [
      'courses',
      ...Object.values(key),
      ...Object.values(filter),
      ...Object.values(pagination)
    ],
    queryFn: async () => {
      return await api.queryFilterCourses(filter, pagination)
    },
    ...options
  })

  return query
}

const toggleCourseStatus = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ id, is_active }) =>
      await api.toggleCourseStatus(id, is_active),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['courses']
      })
    }
  })

  return mutation
}

const createCourse = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (courseData) => {
      const response = await api.createCourse(courseData)
      if (response.status === 'duplicate' || response.status === 'success') {
        return response
      }
      throw new Error(response.message || 'An error occurred')
    },
    onSuccess: async (data) => {
      if (data.status === 'success') {
        await queryClient.invalidateQueries({
          queryKey: ['courses']
        })
      }
    }
  })

  return mutation
}

const createCourseAnyway = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (courseData) => {
      const response = await api.createCourseAnyway(courseData)

      if (response.status === 'error' || response.status >= 400) {
        throw new Error(response.message || 'An error occurred')
      }

      return response
    },
    onSuccess: async (data) => {
      if (data.status === 'success') {
        await queryClient.invalidateQueries({
          queryKey: ['courses']
        })
      }
    },
    onError: (error) => {
      console.error('Mutation error:', error)
    }
  })

  return mutation
}

const disableACourse = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (id) => {
      return await api.disableACourse(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['courses']
      })
    }
  })

  return mutation
}

const enableACourse = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (id) => {
      await api.enableACourse(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['courses']
      })
    }
  })
  return mutation
}

const getAll = (options) => {
  const query = useQuery({
    queryKey: ['courses'],
    queryFn: api.listAllCourse,
    ...options,
    enabled: options?.enabled ?? true
  })

  return query
}

const disableACourseAssignment = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (id) => {
      return await api.disableACourseAssignment(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['course-assignments']
      })
    }
  })

  return mutation
}

const enableACourseAssignment = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (id) => {
      await api.enableACourseAssignment(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['course-assignments']
      })
    }
  })
  return mutation
}

export default {
  queryFilterCourses,
  getAll,
  toggleCourseStatus,
  createCourse,
  createCourseAnyway,
  disableACourse,
  enableACourse,
  disableACourseAssignment,
  enableACourseAssignment
}
