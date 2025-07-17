import { useMutation, useQuery } from '@tanstack/react-query'
import * as api from 'src/apis/admin'

const queryFilterAdmins = (
  keys = {},
  filters = {},
  pagination = {},
  options
) => {
  const query = useQuery({
    queryKey: [
      'users/admins',
      ..._.values(keys),
      ..._.values(filters),
      ..._.values(pagination)
    ],
    queryFn: async () => {
      return await api.queryFilterAdmins(filters, pagination)
    },
    ...options
  })

  return query
}

const getAdminById = (id, keys = {}, options) => {
  const query = useQuery({
    queryKey: ['users/admins', id, ..._.values(keys)],
    queryFn: async () => {
      return await api.getAdminById(id)
    },
    ...options
  })

  return query
}

const createAdmin = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (data) => {
      return await api.createAdmin(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users/admins']
      })
    }
  })

  return mutation
}

const updateAdmin = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (data) => {
      return await api.updateAdmin(data.id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users/admins']
      })
    }
  })

  return mutation
}

const deleteAdmin = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (id) => {
      return await api.deleteAdmin(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users/admins']
      })
    }
  })

  return mutation
}

const enableAdmin = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (id) => {
      return await api.enableAdmin(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users/admins']
      })
    }
  })

  return mutation
}

const disableAdmin = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async (id) => {
      return await api.disableAdmin(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users/admins']
      })
    }
  })

  return mutation
}

export default {
  queryFilterAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  enableAdmin,
  disableAdmin
}
