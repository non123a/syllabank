import axios from 'src/utils/axios'

export const queryFilterClasses = async (filter, pagination) => {
  return await axios.get('classes', {
    params: {
      'page[size]': pagination.rowsPerPage,
      'page[number]': pagination.page,
      'filter[class_name]': filter.name,
      'filter[type]': filter.type,
      'filter[english_level]': filter.englishLevel,
      'filter[academic_period]': filter.academicPeriod,
      include: 'semester,semester.academicYear,sections'
    }
  })
}

export const listClassesWithSectionSchedulesForAcademicPeriod = async ({
  academicYearId,
  academicSemesterId
}) => {
  return await axios.get(
    `academic-periods/academic-years/${academicYearId}/semesters/${academicSemesterId}/classes`,
    {
      params: {
        include: 'sections.schedules,sections.instructor'
      }
    }
  )
}

export const listClassesForAcademicPeriod = async ({
  academicYearId,
  academicSemesterId
}) => {
  return await axios.get(
    `academic-periods/academic-years/${academicYearId}/semesters/${academicSemesterId}/classes`
  )
}

export const createAClass = async (data) => {
  return await axios.post('classes', {
    name: data.name,
    type: data.type,
    description: data.description,
    englishLevel: data.englishLevel,
    semesterId: data.academicSemesterId
  })
}

export const partialUpdateAClass = async (id, data) => {
  return await axios.patch(`classes/${id}`, {
    name: data.name,
    description: data.description,
    englishLevel: data.englishLevel,
    type: data.type
  })
}

export const getAClass = async (id) => {
  return await axios.get(`classes/${id}`)
}

export const getAClassSection = async (sectionId) => {
  return await axios.get(`sections/${sectionId}`)
}

export const deleteAClass = async (id) => {
  return await axios.delete(`classes/${id}`)
}

export const deleteAClassSectionById = async (sectionId) => {
  return await axios.delete(`sections/${sectionId}`)
}

export const createAClassSection = async (id, data) => {
  return await axios.post('sections', {
    classId: id,
    number: data.sectionNumber,
    passingGrade: Number(data.passingGrade).toFixed(2),
    capacity: data.capacity,
    instructorId: data.instructorId,
    schedules: data.schedules.map((schedule) => ({
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime
    }))
  })
}

export const updateAClassSection = async (classId, sectionId, data) => {
  return await axios.put(`sections/${sectionId}`, {
    classId: classId,
    number: data.sectionNumber,
    passingGrade: Number(data.passingGrade).toFixed(2),
    capacity: data.capacity,
    instructorId: data.instructorId
  })
}

export const addStudentToSectionById = async (sectionId, studentId) => {
  return await axios.post(`sections/${sectionId}/student`, {
    studentId: studentId
  })
}

export const bulkAddStudentsToSectionWithSpreadSheetFile = async (
  sectionId,
  /**
   * @param {FormData} payload
   * @param {File} payload.file
   * @param {String} payload.sectionId
   * @param {String} payload.academicSemesterId
   */
  payload
) => {
  return await axios.post(`sections/${sectionId}/students`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const removeStudentFromSectionById = async (sectionId, studentId) => {
  return await axios.delete(`sections/${sectionId}/students/${studentId}`)
}
