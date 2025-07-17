// routes
import { PATH_DASHBOARD } from 'src/routes/paths'
// components
import SvgIconStyle from 'src/components/SvgIconStyle'
import _ from 'lodash'
import { ReactComponent as SyllabusIcon } from '/public/icons/ic_syllabus.svg'

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />
)

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  academic: getIcon('ic_academic'),
  class: getIcon('ic_class'),
  gradebook: getIcon('ic_gradebook'),
  student: getIcon('ic_student'),
  instructor: getIcon('ic_instructor'),
  syllabus: getIcon('ic_syllabus'),
  course: getIcon('ic_course')
}

const navConfig = (permissions) => {
  const navItems = [
    // GENERAL
    // ----------------------------------------------------------------------
    {
      subheader: 'general',
      items: [
        {
          title: 'Dashboard',
          path: PATH_DASHBOARD.general.dashboard,
          icon: ICONS.dashboard,
          permissions: ['dashboard:view-summary']
        },
        // {
        //   title: 'Schedule',
        //   path: PATH_DASHBOARD.general.schedule,
        //   icon: ICONS.calendar,
        //   permissions: ['schedule:view-mine']
        // },
        {
          title: 'Syllabi Request History',
          path: PATH_DASHBOARD.general.record,
          icon: ICONS.syllabus,
          permissions: [
            'student:view-syllabi',
            'student:download-syllabi',
            'student:request-syllabi-access'
          ]
        },
        {
          title: 'Syllabi Request',
          path: PATH_DASHBOARD.general.request,
          icon: ICONS.invoice,
          permissions: [
            'student:view-syllabi',
            'student:download-syllabi',
            'student:request-syllabi-access'
          ]
        }
        // {
        //     title: 'Inbox',
        //     path: PATH_DASHBOARD.general.inbox,

        // }
      ]
    },

    // MANAGEMENT
    // ----------------------------------------------------------------------
    {
      subheader: 'User Management',
      items: [
        // USER
        {
          title: 'User',
          path: PATH_DASHBOARD.user.root,
          icon: ICONS.student,
          children: [
            {
              title: 'list',
              path: PATH_DASHBOARD.user.list,
              permissions: ['admin:manage-users']
            }
          ]
        },

        // {
        //   title: 'Grade',
        //   path: PATH_DASHBOARD.grade.root,
        //   icon: ICONS.gradebook,
        //   children: [
        //     {
        //       title: 'Submission',
        //       children: [
        //         {
        //           title: 'List',
        //           path: PATH_DASHBOARD.grade.list,
        //           permissions: [
        //             'grade-submission:list-all',
        //             'grade-submission:view-all',
        //             'grade-submission:approve-all',
        //             'grade-submission:decline-all'
        //           ]
        //         }
        //       ]
        //     },
        //     {
        //       title: 'Section List',
        //       path: PATH_DASHBOARD.grade.section.list,
        //       permissions: ['section:list-mine']
        //     },
        //     {
        //       title: 'Exit Exam',
        //       children: [
        //         {
        //           title: 'List',
        //           path: PATH_DASHBOARD.grade.exitExam.list,
        //           permissions: ['exit-exam:list-all']
        //         }
        //       ]
        //     },
        //     {
        //       title: 'Summary',
        //       path: PATH_DASHBOARD.grade.summary.root,
        //       children: [
        //         {
        //           title: 'List',
        //           path: PATH_DASHBOARD.grade.summary.list,
        //           permissions: ['grade-summary:list-all']
        //         }
        //       ]
        //     }
        //   ]
        // },
        {
          title: 'Academic Period',
          path: PATH_DASHBOARD.academic.list,
          icon: ICONS.academic,
          children: [
            {
              title: 'List',
              path: PATH_DASHBOARD.academic.list,
              permissions: [
                'academic-period:list-all',
                'academic-period:view-all',
                'academic-period:create-all',
                'academic-period:update-all',
                'academic-period:duplicate-all',
                'academic-period:delete-all'
              ]
            }
          ]
        }
      ]
    },
    // COURSE MANAGEMENT
    // ----------------------------------------------------------------------
    {
      subheader: 'Course Management',
      items: [
        {
          title: 'Course',
          path: PATH_DASHBOARD.dean.course,
          icon: ICONS.academic,
          permissions: ['dean:create-course']
        }
      ]
    },
    // INSTRUCTOR MANAGEMENT
    // ----------------------------------------------------------------------
    {
      subheader: 'Instructor',
      items: [
        {
          title: 'Syllabi Management',
          icon: ICONS.syllabus,
          children: [
            {
              title: 'List',
              path: PATH_DASHBOARD.syllabus.list,
              permissions: [
                'instructor:create-syllabi',
                'instructor:edit-syllabi',
                'instructor:view-own-syllabi',
                'instructor:submit-syllabi',
                'instructor:delete-draft-syllabi'
              ]
            }
          ]
        }
      ]
    },
    // SCHOOL MANAGEMENT
    // ----------------------------------------------------------------------
    {
      subheader: 'School Management',
      items: [
        {
          title: 'School Structure',
          path: PATH_DASHBOARD.school.root,
          icon: ICONS.school,
          permissions: ['admin:manage-organization'],
          children: [
            {
              title: 'Departments',
              path: PATH_DASHBOARD.school.department.list,
              permissions: ['admin:manage-organization']
            },
            {
              title: 'Faculties',
              path: PATH_DASHBOARD.school.faculty.list,
              permissions: ['admin:manage-organization']
            }
          ]
        },
        {
          title: 'Academic Period',
          path: PATH_DASHBOARD.academic.list,
          icon: ICONS.academic,
          children: [
            {
              title: 'List',
              path: PATH_DASHBOARD.academic.list,
              permissions: ['admin:system-configuration']
            }
          ]
        }
      ]
    },
    // HOD MANAGEMENT
    // ----------------------------------------------------------------------
    {
      subheader: 'Head of Department',
      items: [
        {
          title: 'Syllabi Management',
          icon: ICONS.syllabus,
          children: [
            {
              title: 'Syllabi Vouching',
              path: PATH_DASHBOARD.hod.syllabiRequests,
              permissions: [
                'hod:approve-student-requests',
                'hod:review-syllabi',
                'hod:view-department-syllabi',
                'hod:assign-courses'
              ]
            },
            {
              title: 'Syllabi Submission',
              path: PATH_DASHBOARD.hod.form.list,
              permissions: [
                'hod:approve-student-requests',
                'hod:review-syllabi',
                'hod:view-department-syllabi',
                'hod:assign-courses'
              ]
            },
            {
              title: 'Approved Syllabi',
              children: [
                {
                  title: 'List',
                  path: PATH_DASHBOARD.hod.syllabiApproved,
                  permissions: [
                    'hod:approve-student-requests',
                    'hod:review-syllabi',
                    'hod:view-department-syllabi',
                    'hod:assign-courses'
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Course Management',
          icon: ICONS.course,
          children: [
            {
              title: 'Assign Courses',
              path: PATH_DASHBOARD.hod.assignCourses,
              permissions: ['hod:assign-courses']
            }
          ]
        }
      ]
    },
    // ----------------------------------------------------------------------
    // DEAN MANAGEMENT
    // ----------------------------------------------------------------------
    {
      subheader: 'Dean',
      items: [
        {
          title: 'Syllabi Management',
          icon: ICONS.syllabus,
          children: [
            {
              title: 'Syllabi Acceptance',
              path: PATH_DASHBOARD.dean.syllabiRequests,
              permissions: [
                'dean:review-syllabi',
                'dean:approve-syllabi',
                'dean:view-faculty-syllabi',
                'dean:create-courses'
              ]
            },
            {
              title: 'Approved Syllabi',
              path: PATH_DASHBOARD.dean.departmentSyllabi,
              children: [
                {
                  title: 'List',
                  path: PATH_DASHBOARD.dean.facultySyllabi,
                  permissions: [
                    'dean:review-syllabi',
                    'dean:approve-syllabi',
                    'dean:view-faculty-syllabi',
                    'dean:create-courses'
                  ]
                }
              ]
            }
          ]
        },
        {
          title: 'Course',
          icon: ICONS.booking,
          children: [
            {
              title: 'List',
              path: PATH_DASHBOARD.course.list,
              permissions: [
                'dean:review-syllabi',
                'dean:approve-syllabi',
                'dean:view-faculty-syllabi',
                'dean:create-courses'
              ]
            }
          ]
        }
      ]
    },
    // ----------------------------------------------------------------------
    // PROVOST MANAGEMENT
    // ----------------------------------------------------------------------
    {
      subheader: 'Provost',
      items: [
        {
          title: 'Syllabi Management',
          icon: ICONS.syllabus,
          children: [
            {
              title: 'Syllabi Requests',
              path: PATH_DASHBOARD.provost.syllabiRequests,
              permissions: [
                'provost:accept-syllabi',
                'provost:view-all-syllabi',
                'provost:manage-all-syllabi',
                'provost:set-academic-dates'
              ]
            },
            {
              title: 'Approved Syllabi',
              children: [
                {
                  title: 'List',
                  path: PATH_DASHBOARD.provost.syllabiApproved,
                  permissions: [
                    'provost:accept-syllabi',
                    'provost:view-all-syllabi',
                    'provost:manage-all-syllabi',
                    'provost:set-academic-dates'
                  ]
                }
              ]
            },
            {
              title: 'Templates',
              path: PATH_DASHBOARD.provost.syllabusTemplate,
              permissions: [
                'provost:accept-syllabi',
                'provost:view-all-syllabi',
                'provost:manage-all-syllabi',
                'provost:set-academic-dates'
              ]
            }
          ]
        },
        {
          title: 'Academic Period',
          path: PATH_DASHBOARD.admin.root,
          icon: ICONS.calendar,
          children: [
            {
              title: 'List',
              path: PATH_DASHBOARD.academic.list,
              permissions: [
                'provost:accept-syllabi',
                'provost:view-all-syllabi',
                'provost:manage-all-syllabi',
                'provost:set-academic-dates'
              ]
            }
          ]
        }
      ]
    }
  ]

  return navItems
    .map((section) => {
      const filteredNavItems = filterNavItemsByPermissions(
        section.items,
        permissions
      )

      if (filteredNavItems.length === 0) {
        return null
      }

      return {
        ...section,
        items: filteredNavItems
      }
    })
    .filter(Boolean)
}

const hasPermissionTo = (userPermissions, requiredPermissions) => {
  if (!Array.isArray(requiredPermissions)) {
    requiredPermissions = [requiredPermissions]
  }
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  )
}

const filterNavItemsByPermissions = (items, userPermissions) =>
  items.reduce((acc, item) => {
    const { permissions, children } = item

    if (permissions && !hasPermissionTo(userPermissions, permissions)) {
      return acc
    }

    const filteredChildren =
      children && filterNavItemsByPermissions(children, userPermissions)

    if (filteredChildren && filteredChildren.length === 0) {
      return acc
    }

    acc.push({
      ...item,
      children: filteredChildren
    })

    return acc
  }, [])

export default navConfig
