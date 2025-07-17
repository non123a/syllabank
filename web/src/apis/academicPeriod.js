import axios from 'src/utils/axios'

export const listAcademicYear = async () => {
  return await axios.get('academic-periods/academic-years')
}

export const listAcademicYearPreRegistraion = async () => {
  return await axios.get('academic-year')
}

export const queryAcademicYear = async (filter, pagination) => {
  return await axios.get('academic-periods/academic-years/query', {
    params: {
      'page[size]': pagination.rowsPerPage,
      'page[number]': pagination.page
    }
  })
}

export const getAcademicYear = async (id) => {
  return await axios.get(`academic-periods/academic-years/${id}`)
}

export const getSemestersInAcademicYear = async (id) => {
  return await axios.get(`academic-periods/academic-years/${id}/semesters`)
}

export const listAcademicPeriod = async () => {
  return await axios.get('academic-periods')
}

export const queryFilterAcademicPeriods = async (filter, pagination) => {
  return await axios.get('academic-periods', {
    params: {
      'page[size]': pagination.rowsPerPage,
      'page[number]': pagination.page,
      'filter[start_date]': filter.startDate,
      'filter[end_date]': filter.endDate,
      'filter[not-by-id]': filter.notById,
      'include-filter[semester-not-by-id]': filter.semesterNotById,
      include: 'semesters'
    }
  })
}

export const createAcademicYear = async (data) => {
  return await axios.post('academic-periods/academic-years', {
    startDate: data.startDate,
    endDate: data.endDate
  })
}

export const createSemesterForAcademicYear = async (data) => {
  return await axios.post(
    `academic-periods/academic-years/${data.academicYearId}/semesters`,
    {
      academicYearId: data.academicYearId,
      semester: data.semester,
      startDate: data.startDate,
      endDate: data.endDate
    }
  )
}

export const deleteAcademicYear = async (id) => {
  return await axios.delete(`academic-periods/academic-years/${id}`)
}

export const createAcademicYearWithSemesters = async (data) => {
  return await axios.post('academic-periods', {
    academicYear: {
      startDate: data.startDate,
      endDate: data.endDate
    },
    semesters: data.semesters.map((semester) => ({
      name: semester.name,
      startDate: semester.startDate,
      endDate: semester.endDate
    }))
  })
}

export const updateSemesterForAcademicYear = async (data) => {
  return await axios.put(
    `academic-periods/academic-years/${data.academicYearId}/semesters/${data.semesterId}`,
    {
      academicYearId: data.academicYearId,
      semester: data.semester,
      startDate: data.startDate,
      endDate: data.endDate
    }
  )
}

export const duplicateAcademicYear = async (data) => {
  return await axios.post(
    `academic-periods/academic-years/${data.academicYearId}/duplications`,
    {
      sourceAcademicYearId: data.academicYearId,
      academicYearStartDate: data.academicYearStartDate,
      academicYearEndDate: data.academicYearEndDate
    }
  )
}
