import axios from 'src/utils/axios'

export const queryFilterGradeApprovalRequests = async (filter, pagination) => {
  return await axios.get('grade-approval-requests', {
    params: {
      'page[size]': pagination.rowsPerPage,
      'page[number]': pagination.page,
      'filter[status]': filter.status,
      'filter[semester_id]': filter.semesterId,
      'filter[english_level]': filter.englishLevel
    }
  })
}

export const getGradeApprovalRequest = async (id) => {
  return await axios.get(`grade-approval-requests/${id}`)
}

export const approveGradeSubmission = async (id) => {
  return await axios.patch(`grade-approval-requests/${id}/approvals`)
}

export const declineGradeSubmission = async (id) => {
  return await axios.patch(`grade-approval-requests/${id}/declines`)
}
