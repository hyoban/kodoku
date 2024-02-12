import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { siteConfig } from '~/config/site'

const { timeZone } = siteConfig

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault(timeZone)
dayjs.extend(relativeTime)
