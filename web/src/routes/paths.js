// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`
}

const ROOTS_AUTH = '/auth'
const ROOTS_DASHBOARD = ''
const ROOTS_DASHBOARD_ALT = '/'

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  setPassword: path(ROOTS_AUTH, '/set-password'),
  twoFactor: path(ROOTS_AUTH, '/verify')
}

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  rootAlt: ROOTS_DASHBOARD_ALT,
  about: path(ROOTS_DASHBOARD, '/about-us'),
  general: {
    home: path(ROOTS_DASHBOARD, '/home'),
    dashboard: path(ROOTS_DASHBOARD, '/dashboard'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
    schedule: path(ROOTS_DASHBOARD, '/user-schedule'),
    record: path(ROOTS_DASHBOARD, '/syllabi-record'),
    request: path(ROOTS_DASHBOARD, '/syllabi-request-submission')
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all')
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/chat/${name}`)
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    fileUpload: path(ROOTS_DASHBOARD, '/user/new-file-upload'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: (name) => path(ROOTS_DASHBOARD, `/user/${name}/profile`),
    edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`)
  },
  student: {
    root: path(ROOTS_DASHBOARD, '/student'),
    new: path(ROOTS_DASHBOARD, '/student/new'),
    fileUpload: path(ROOTS_DASHBOARD, '/student/new-file-upload'),
    list: path(ROOTS_DASHBOARD, '/student/list'),
    cards: path(ROOTS_DASHBOARD, '/student/cards'),
    profile: (name) => path(ROOTS_DASHBOARD, `/student/${name}/profile`),
    edit: (name) => path(ROOTS_DASHBOARD, `/student/${name}/edit`)
  },
  settings: {
    root: path(ROOTS_DASHBOARD, '/settings')
  },
  instructor: {
    root: path(ROOTS_DASHBOARD, '/instructor'),
    new: path(ROOTS_DASHBOARD, '/instructor/new'),
    list: path(ROOTS_DASHBOARD, '/instructor/list'),
    manageSyllabi: path(ROOTS_DASHBOARD, '/instructor/manage-syllabi'),
    manageTemplates: path(ROOTS_DASHBOARD, '/instructor/manage-template'),
    edit: (name) => path(ROOTS_DASHBOARD, `/instructor/${name}/edit`)
  },
  grade: {
    root: path(ROOTS_DASHBOARD, '/grade'),
    list: path(ROOTS_DASHBOARD, '/grade/list/grade-approval-report'),
    review: (id) => path(ROOTS_DASHBOARD, `/grade/${id}/class-grade-review`),
    section: {
      list: path(ROOTS_DASHBOARD, '/grade/section/list'),
      addGrade: (sectionId) =>
        path(ROOTS_DASHBOARD, `/grade/section/${sectionId}/add-grade`),
      detail: (sectionId) =>
        path(ROOTS_DASHBOARD, `/grade/section/${sectionId}/detail`)
    },
    view: (id) => path(ROOTS_DASHBOARD, `/grade/${id}/class-grade-review`),
    exitExam: {
      list: path(ROOTS_DASHBOARD, '/grade/exit-exam/list')
    },
    summary: {
      root: path(ROOTS_DASHBOARD, '/grade/summary'),
      list: path(ROOTS_DASHBOARD, '/grade/summary/list')
    }
  },
  class: {
    root: path(ROOTS_DASHBOARD, '/class'),
    calendar: path(ROOTS_DASHBOARD, '/class/calendar'),
    sectionList: (classId) =>
      path(ROOTS_DASHBOARD, `/class/${classId}/section/list`),
    new: path(ROOTS_DASHBOARD, '/class/new'),
    list: path(ROOTS_DASHBOARD, '/class/list'),
    section: {
      detail: (classId, sectionId) =>
        path(ROOTS_DASHBOARD, `/class/${classId}/section/${sectionId}/detail`)
    },
    view: (classId) => path(ROOTS_DASHBOARD, `/class/${classId}/detail`),
    edit: (classId) => path(ROOTS_DASHBOARD, `/class/${classId}/edit`)
  },
  hod: {
    root: path(ROOTS_DASHBOARD, '/hod'),
    new: path(ROOTS_DASHBOARD, '/hod/new'),
    list: path(ROOTS_DASHBOARD, '/hod/list'),
    edit: (name) => path(ROOTS_DASHBOARD, `/hod/${name}/edit`),
    preview: (id) =>
      path(ROOTS_DASHBOARD, `/hod/syllabi-request-vouching/${id}/preview`),
    syllabiRequests: path(ROOTS_DASHBOARD, '/hod/syllabi-request-vouching'),
    syllabiSubmission: path(
      ROOTS_DASHBOARD,
      '/hod/syllabi-approval-submission'
    ),
    syllabiApproved: path(ROOTS_DASHBOARD, '/hod/department-approved'),
    departmentSyllabi: path(ROOTS_DASHBOARD, '/hod/department-syllabi'),
    vouchSyllabi: path(ROOTS_DASHBOARD, '/hod/vouch-syllabi'),
    assignCourses: path(ROOTS_DASHBOARD, '/hod/assign-courses'),
    course: {
      new: path(ROOTS_DASHBOARD, '/hod/course/new')
    },
    form: {
      list: path(ROOTS_DASHBOARD, '/hod/form/list')
    }
  },
  dean: {
    root: path(ROOTS_DASHBOARD, '/dean'),
    new: path(ROOTS_DASHBOARD, '/dean/new'),
    list: path(ROOTS_DASHBOARD, '/dean/list'),
    course: path(ROOTS_DASHBOARD, '/dean/list'),
    edit: (name) => path(ROOTS_DASHBOARD, `/dean/${name}/edit`),
    preview: (id) => path(ROOTS_DASHBOARD, `/dean/${id}/preview`),
    syllabiRequests: path(ROOTS_DASHBOARD, '/dean/syllabi-request-acceptance'),
    departmentSyllabi: path(ROOTS_DASHBOARD, '/dean/department-syllabi'),
    facultySyllabi: path(ROOTS_DASHBOARD, '/dean/faculty-syllabi')
  },
  course: {
    root: path(ROOTS_DASHBOARD, '/course'),
    new: path(ROOTS_DASHBOARD, '/course/new'),
    list: path(ROOTS_DASHBOARD, '/course/list'),
    view: (id) => path(ROOTS_DASHBOARD, `/course/${id}/view`),
    edit: (id) => path(ROOTS_DASHBOARD, `/course/${id}/edit`)
  },
  school: {
    root: path(ROOTS_DASHBOARD, '/school'),
    department: {
      root: path(ROOTS_DASHBOARD, '/school/department'),
      list: path(ROOTS_DASHBOARD, '/school/department/list'),
      new: path(ROOTS_DASHBOARD, '/school/department/new'),
      edit: (id) => path(ROOTS_DASHBOARD, `/school/department/${id}/edit`),
      assignHod: (id) =>
        path(ROOTS_DASHBOARD, `/school/department/${id}/assign-hod`)
    },
    faculty: {
      root: path(ROOTS_DASHBOARD, '/school/faculty'),
      list: path(ROOTS_DASHBOARD, '/school/faculty/list'),
      new: path(ROOTS_DASHBOARD, '/school/faculty/new'),
      edit: (id) => path(ROOTS_DASHBOARD, `/school/faculty/${id}/edit`),
      assignDean: (id) =>
        path(ROOTS_DASHBOARD, `/school/faculty/${id}/assign-dean`)
    }
  },
  admin: {
    root: path(ROOTS_DASHBOARD, '/admin'),
    new: path(ROOTS_DASHBOARD, '/admin/new'),
    list: path(ROOTS_DASHBOARD, '/admin/list'),
    edit: (name) => path(ROOTS_DASHBOARD, `/admin/${name}/edit`)
  },
  academic: {
    root: path(ROOTS_DASHBOARD, '/academic'),
    new: path(ROOTS_DASHBOARD, '/academic/new'),
    list: path(ROOTS_DASHBOARD, '/academic/list'),
    edit: (name) => path(ROOTS_DASHBOARD, `/academic/${name}`),
    duplicate: (name) => path(ROOTS_DASHBOARD, `/academic/${name}/duplicate`)
  },
  schedule: {
    root: path(ROOTS_DASHBOARD, '/user-schedule')
  },
  syllabus: {
    root: path(ROOTS_DASHBOARD, '/syllabus'),
    view: (id) => path(ROOTS_DASHBOARD, `/syllabus/${id}/view`),
    list: path(ROOTS_DASHBOARD, '/syllabus/list'),
    new: path(ROOTS_DASHBOARD, '/syllabus/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/syllabus/${id}/edit`),
    templates: path(ROOTS_DASHBOARD, '/syllabus/templates'),
    createTemplate: path(ROOTS_DASHBOARD, '/syllabus/templates/create'),
    viewTemplate: (id) =>
      path(ROOTS_DASHBOARD, `/syllabus/templates/${id}/preview`)
  },
  provost: {
    root: path(ROOTS_DASHBOARD, '/provost'),
    syllabusTemplate: path(ROOTS_DASHBOARD, '/provost/syllabus-template'),
    syllabiRequests: path(ROOTS_DASHBOARD, '/provost/syllabi-request-approval'),
    syllabiApproved: path(ROOTS_DASHBOARD, '/provost/syllabi-approved'),
    preview: (id) => path(ROOTS_DASHBOARD, `/provost/${id}/preview`)
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(
      ROOTS_DASHBOARD,
      '/e-commerce/product/nike-blazer-low-77-vintage/edit'
    ),
    demoView: path(
      ROOTS_DASHBOARD,
      '/e-commerce/product/nike-air-force-1-ndestrukt'
    )
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
    new: path(ROOTS_DASHBOARD, '/invoice/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(
      ROOTS_DASHBOARD,
      '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'
    ),
    demoView: path(
      ROOTS_DASHBOARD,
      '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'
    )
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(
      ROOTS_DASHBOARD,
      '/blog/post/apply-these-7-secret-techniques-to-improve-event'
    )
  }
}

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction'
