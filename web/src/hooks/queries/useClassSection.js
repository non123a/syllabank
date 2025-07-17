import { useQuery, useMutation } from '@tanstack/react-query'
import _ from 'lodash'
import {
  addStudentToSectionById,
  bulkAddStudentsToSectionWithSpreadSheetFile,
  deleteAClassSectionById,
  getAClassSection,
  listClassesWithSectionSchedulesForAcademicPeriod,
  removeStudentFromSectionById
} from 'src/apis/class'

const queryFilter = (options) => {
  const query = useQuery({
    queryKey: ['sections'],
    queryFn: async () => {},
    ...options
  })

  return query
}

const queryClassesWithSectionSchedulesForAcademicPeriod = (
  keys = {},
  filters = {},
  options
) => {
  const query = useQuery({
    queryKey: ['classes/sections', ..._.values(keys), ..._.values(filters)],
    queryFn: async () =>
      await listClassesWithSectionSchedulesForAcademicPeriod(filters),
    ...options
  })

  return query
}

const getById = (options) => {
  const query = useQuery({
    queryKey: ['sections', options.sectionId],
    queryFn: async () => getAClassSection(options.sectionId),
    ...options
  })

  return query
}

const deleteById = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ sectionId }) => {
      return await deleteAClassSectionById(sectionId)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['classes/sections']
      })
    }
  })

  return mutation
}

const addStudentToSection = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ sectionId, studentId }) => {
      return await addStudentToSectionById(sectionId, studentId)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users/students']
      })
    }
  })

  return mutation
}

const removeStudentFromSection = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ sectionId, studentId }) => {
      return await removeStudentFromSectionById(sectionId, studentId)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users/students']
      })
    }
  })

  return mutation
}

const addStudentsToSectionWithSpreadSheetFile = (queryClient) => {
  const mutation = useMutation({
    mutationFn: async ({ sectionId, payload }) => {
      return await bulkAddStudentsToSectionWithSpreadSheetFile(
        sectionId,
        payload
      )
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['users/students']
      })
    }
  })

  return mutation
}

export default {
  queryFilter,
  getById,
  queryClassesWithSectionSchedulesForAcademicPeriod,
  addStudentToSection,
  addStudentsToSectionWithSpreadSheetFile,
  removeStudentFromSection,
  deleteById
}
