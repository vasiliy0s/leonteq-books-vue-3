import { format } from 'date-fns'

export default function dateFormat(isoDate: string, formatStr = 'MMM dd yyyy'): string {
  return format(new Date(isoDate), formatStr)
}