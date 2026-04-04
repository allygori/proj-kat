import { format } from "date-fns"
import { id } from 'date-fns/locale'


export const formatDate = (
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  val: string | number | Date | String | Number,
  token = 'dd LLLL yyyy'
) => {
  if (val instanceof Date) {
    return format(val, token, { locale: id })
  }

  if (val instanceof String) {
    return format(new Date(val.toString()), token, { locale: id })
  }

  if (val instanceof Number) {
    return format(new Date(val.toString()), token, { locale: id })
  }

  if (['string', 'number'].includes(typeof val)) {
    return format(new Date(val), token, { locale: id })
  }

  return null;
}