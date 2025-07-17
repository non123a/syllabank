import axios from 'src/utils/axios'

export const queryFilterExitExamGrades = async (filter, pagination) => {
  return await axios.get('exit-exam-grades', {
    params: {
      'page[size]': pagination.rowsPerPage,
      'page[number]': pagination.page,
      'filter[identification,email,name]': filter.search,
      'filter[academic_year]': filter.academicYearId,
      include: filter.include
    }
  })
}

export const createExitExamGrade = async (data) => {
  return await axios.post('exit-exam-grades', {
    studentId: data.studentId,
    academicYearId: data.academicYearId,
    grade: data.grade
  })
}

export const updateExitExamGrade = async (id, data) => {
  return await axios.put(`exit-exam-grades/${id}`, {
    grade: data.grade
  })
}
