import axios from 'src/utils/axios'
import * as api from 'src/apis/syllabus'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getTemplates } from '../../apis/syllabus'

// const createSyllabus = (queryClient) => {
//   const mutation = useMutation({
//     mutationFn: async (data) => {
//       return await api.createSyllabus(data)
//     },
//     onSuccess: async () => {
//       await queryClient.invalidateQueries({
//         queryKey: ['syllabi']
//       })
//     }
//   })
// }

export function useGetTemplates() {
  return useQuery('templates', getTemplates)
}

export const useCreateSyllabus = () => {
  return useMutation((data) =>
    axios.post('/syllabus/create', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  )
}

// export default { createSyllabus }
