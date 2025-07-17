import PropTypes from 'prop-types'
import { MenuItem, TextField } from '@mui/material'
import useResponsive from 'src/hooks/useResponsive'
import { fAcademicPeriod } from 'src/utils/formatTime'

//---------------------------------------------------------------------------------

AcademicPeriodSelect.propTypes = {
  data: PropTypes.object,
  academicPeriod: PropTypes.string,
  onAcademicPeriodChange: PropTypes.func,
  fetchNextPage: PropTypes.func
}

export default function AcademicPeriodSelect({
  data,
  academicPeriod,
  onAcademicPeriodChange,
  fetchNextPage
}) {
  const isDesktop = useResponsive('up', 'sm')
  return (
    <TextField
      select
      size={isDesktop ? 'medium' : 'small'}
      SelectProps={{
        id: 'academic-period',
        MenuProps: {
          keepMounted: true,
          slotProps: {
            paper: {
              onScroll: async (e) => {
                const container = e.target
                if (
                  container.scrollHeight - container.scrollTop ===
                  container.clientHeight
                ) {
                  await fetchNextPage()
                }
              },
              sx: {
                maxHeight: 260
              }
            }
          }
        }
      }}
      label="Select Academic Period"
      value={academicPeriod}
      onChange={onAcademicPeriodChange}
    >
      {data?.pages?.map((page) => {
        return page.data.data.map((item) => {
          return item.semesters.map((semester) => {
            return (
              <MenuItem
                dense={!isDesktop ? true : false}
                key={semester.id}
                value={`${semester.academic_year_id}|${semester.id}`}
              >
                {fAcademicPeriod(
                  item.start_date,
                  item.end_date,
                  semester.semester_number
                )}
              </MenuItem>
            )
          })
        })
      })}
      <div></div>
    </TextField>
  )
}
