import { Card, Container, FormControl, Stack } from '@mui/material'
import PropTypes from 'prop-types'
import { useRef } from 'react'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import Scrollbar from 'src/components/Scrollbar'
import { CalendarStyle } from '../calendar'
import { PATH_DASHBOARD } from 'src/routes/paths'
import AcademicPeriodSelect from '../academic/AcademicPeriodSelect'
import _ from 'lodash'
import { SectionTable } from './section'
import useMe from 'src/hooks/queries/useMe'

InstructorSchedule.propTypes = {
  events: PropTypes.array,
  academicPeriod: PropTypes.string,
  setAcademicPeriod: PropTypes.func,
  isLoading: PropTypes.bool
}

export default function InstructorSchedule({
  events,
  academicPeriod,
  setAcademicPeriod,
  isLoading
}) {
  const calendarRef = useRef(null)

  const academicPeriodsQuery = useMe.infiniteQueryMyAcademicPeriods()

  const uniqueSections = _.uniqBy(events, 'id')

  return (
    <Page title="Schedule">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Schedule"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.rootAlt },
            { name: 'Schedule' }
          ]}
        />
        <Stack spacing={3} direction="column">
          <FormControl fullWidth>
            <AcademicPeriodSelect
              academicPeriod={academicPeriod}
              onAcademicPeriodChange={(e) => setAcademicPeriod(e.target.value)}
              fetchNextPage={academicPeriodsQuery.fetchNextPage}
              data={academicPeriodsQuery?.data}
            />
          </FormControl>
          <Scrollbar>
            <Card
              variant="outlined"
              sx={{
                boxShadow: 'none'
              }}
            >
              <CalendarStyle>
                <FullCalendar
                  events={events}
                  listDaySideFormat={false}
                  eventDisplay={'block'}
                  height="auto"
                  rerenderDelay={1000}
                  headerToolbar={false}
                  ref={calendarRef}
                  initialView="listWeek"
                  plugins={[listPlugin]}
                  noEventsContent={
                    isLoading ? 'Loading...' : 'No schedules found'
                  }
                />
              </CalendarStyle>
            </Card>
          </Scrollbar>
          <SectionTable sections={uniqueSections} />
        </Stack>
      </Container>
    </Page>
  )
}
