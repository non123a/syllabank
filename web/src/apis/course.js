import axios from 'src/utils/axios'
import { useAuth } from '../hooks/useAuth'

export const queryFilterCourses = async (filter, pagination) => {
  return await axios.get('courses', {
    params: {
      'page[size]': pagination.rowsPerPage,
      'page[number]': pagination.page,
      'filter[subject,name,code]': filter.search,
      'filter[is_active]': filter.is_active
    }
  })
}

export const queryCourseById = async (id) => {
  const response = await axios.get(`/courses/${id}`)
  return response
}

export const createCourse = async (data) => {
  const response = await axios.post('/courses/create', data)
  return response.data
}

export const createCourseAnyway = async (data) => {
  const response = await axios.post('/courses/create-anyway', data)
  return response.data
}

export const updateCourse = async (id, data) => {
  return await axios.patch(`courses/${id}`, {
    subject: data.subject,
    code: data.code,
    name: data.name,
    description: data.description
  })
}

export const deleteCourse = async (id) => {
  return await axios.delete(`courses/${id}`)
}

export const disableACourse = async (id) => {
  return await axios.patch(`courses/${id}/disable`)
}

export const enableACourse = async (id) => {
  return await axios.patch(`courses/${id}/enable`)
}

export const listAllCourse = async () => {
  return await axios.get('courses', {
    params: {
      'filter[is_active]': true
    }
  })
}

export const assignCourseToInstructor = async (data) => {
  return await axios.post('/courses/assign-instructor', data)
}

export async function assignCourseToAcademicPeriod(data) {
  try {
    const response = await axios.post('/courses/assign-academic-period', data)
    return { success: true, message: response.data.message }
  } catch (error) {
    console.error('Error in assignCourseToAcademicPeriod:', error)
    return {
      success: false,
      message:
        error.response?.data?.message ||
        'An error occurred while assigning the course'
    }
  }
}

export const assignInstructorToCourse = async (
  courseAssignmentId,
  instructorIds
) => {
  const response = await axios.put('/courses/assign-instructor', {
    course_assignment_id: courseAssignmentId,
    instructor_ids: instructorIds
  })
  return response.data
}

export const fetchCourseAssignmentsData = async (params, pagination) => {
  const response = await axios.get('/courses/course-assignments', {
    params: {
      'page[number]': pagination.page,
      'page[size]': pagination.rowsPerPage,
      'filter[courses_academic_years_semesters_users.academic_year_id]':
        params.academic_year_id,
      'filter[courses_academic_years_semesters_users.semester_id]':
        params.semester_id,
      'filter[search]': params.search,
      'filter[courses_academic_years_semesters_users.is_active]':
        params.is_active
    }
  })
  return response.data
}

export const assignCourse = async (courseData) => {
  try {
    const response = await axios.post(
      '/courses/assign-academic-period',
      courseData
    )
    return { success: true, data: response.data }
  } catch (error) {
    console.error('Error in assignCourse:', error)
    return {
      success: false,
      error:
        error.response?.data?.message ||
        'An error occurred while assigning the course'
    }
  }
}

export const disableACourseAssignment = async (id) => {
  return await axios.patch(`courses/course-assignments/${id}/disable`)
}

export const enableACourseAssignment = async (id) => {
  return await axios.patch(`courses/course-assignments/${id}/enable`)
}
