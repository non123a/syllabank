import axios from 'src/utils/axios'

export const queryFilterStudentGradeSummary = async (filter, pagination) => {
  return await axios.get('users/students/grade-summary', {
    params: {
      'page[size]': pagination.rowsPerPage,
      'page[number]': pagination.page,
      'filter[english_level]': filter.englishLevel,
      'filter[academic_year]': filter.academicYearId,
      'filter[name,email,identification]': filter.search
    }
  })
}

export const queryFilterStudents = async (filter, pagination) => {
  return await axios.get('users', {
    params: {
      'page[size]': pagination.rowsPerPage,
      'page[number]': pagination.page,
      'filter[academic_period]': filter.academicPeriod,
      'filter[role]': filter.englishLevel,
      'filter[search]': filter.name,
      'filter[section]': filter.section,
      'filter[not-in-section-id]': filter.notInSectionId
    }
  })
}

export const queryStudentById = async (id) => {
  return await axios.get(`users/students/${id}`)
}

export const registerStudent = async (data) => {
  return await axios.post('users/student', data)
}

export const updateStudent = async (id, data) => {
  return await axios.patch(`users/students/${id}`, data)
}

export const registerStudentWithSpreadsheet = async (payload) => {
  return await axios.post('users/students', payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const disableAStudent = async (id) => {
  return await axios.patch(`users/students/${id}/disable`)
}

export const enableAStudent = async (id) => {
  return await axios.patch(`users/students/${id}/enable`)
}
