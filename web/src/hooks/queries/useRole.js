import { useMutation, useQuery } from '@tanstack/react-query'
import * as api from 'src/apis/role'

const getAll = (options) => {
  const query = useQuery({
    queryKey: ['roles'],
    queryFn: api.listRole,
    ...options,
    enabled: options?.enabled ?? true
  })

  return query
}
export default { getAll }
