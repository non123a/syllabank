import axios from 'src/utils/axios'

export const queryStudentRegisteredpassedFailedCount = async (filters) => {
  return await axios.get('dashboard/students-registered-passed-failed-counts', {
    params: {
      'filter[academic_year]': filters.academicYearId
    }
  })
}

export const queryDashboardStudentsRegisteredPassedFailed = async (filters) => {
  return await axios.get('dashboard/students-registered-passed-failed', {
    params: {
      'filter[range]': filters.range
    }
  })
}

export const queryStudentsLevelAllocation = async (filters) => {
  return await axios.get('dashboard/students-level-allocation', {
    params: {
      'filter[academic_year]': filters.academicYearId
    }
  })
}
