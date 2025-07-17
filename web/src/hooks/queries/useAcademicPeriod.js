import _ from 'lodash'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  listAcademicYear,
  queryAcademicYear,
  queryFilterAcademicPeriods
} from 'src/apis/academicPeriod'

const getAll = (options) => {
  const query = useQuery({
    queryKey: ['academicYears'],
    queryFn: listAcademicYear,
    ...options
  })

  return query
}

const infiniteQueryFilterAcademicYears = (keys = {}, filters = {}, options) => {
  const query = useInfiniteQuery({
    queryKey: [
      'academic/academic-years',
      ..._.values(keys),
      ..._.values(filters)
    ],
    queryFn: async (params) =>
      await queryAcademicYear(filters, {
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

const infiniteQueryFilter = (keys = {}, filters = {}, options) => {
  const query = useInfiniteQuery({
    queryKey: ['academic/semesters', ..._.values(keys), ..._.values(filters)],
    queryFn: async (params) =>
      await queryFilterAcademicPeriods(filters, {
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

export default {
  getAll,
  infiniteQueryFilter,
  infiniteQueryFilterAcademicYears
}
