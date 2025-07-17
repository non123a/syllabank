import { format, getTime, formatDistanceToNow } from 'date-fns'

// ----------------------------------------------------------------------

export function fDateField(date) {
  return format(new Date(date), "yyyy-MM-dd'T'HH:mm:ssXXX")
}

export function fAcademicPeriod(dateStart, dateEnd, semester) {
  return `${fDateYear(dateStart)} - ${fDateYear(dateEnd)} / ${semester}`
}

export function fAcademicYear(dateStart, dateEnd) {
  return `${fDateYear(dateStart)} - ${fDateYear(dateEnd)}`
}

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy')
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy p')
}

export function fDateYear(date) {
  return format(new Date(date), 'yyyy')
}

export function fTimestamp(date) {
  return getTime(new Date(date))
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p')
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true
  })
}

export function fFullTime(date) {
  return format(new Date(date), 'HH:mm:ss')
}
