import axios from 'src/utils/axios'

export const getMySchedules = async (filter) => {
  return await axios.get('me/schedules', {
    params: {
      academicPeriod: filter.academicPeriod
    }
  })
}

export const getMyAcademicPeriods = async (pagination) => {
  return await axios.get('me/academic-periods', {
    params: {
      'page[size]': pagination.rowsPerPage,
      'page[number]': pagination.page
    }
  })
}

export const getMyAssignedCourses = async () => {
  const response = await axios.get('me/assigned-courses')
  return response.data
}
