import dayjs from "dayjs";

export const GLOBAL_FORMAT_DATE: string = 'LLLL';

export const TRANSACTION_STATUS: any = {
  COMPLETED: 'Selesai',
  INCOMPLETE: 'Belum Selesai',
};

export const TRANSACTION_METHOD: any = {
  CASHIER: 'Kasir',
};

export const TRANSACTION_TYPE: any = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
};


interface VariablesDate {
  [key: string]: {
    startdate: string,
    enddate: string
  }
}

export const NowStart = dayjs(new Date().setHours(0, 0, 0)).subtract(7, 'hours')
export const NowEnd = dayjs(new Date().setHours(23, 59, 59)).subtract(7, 'hours')
const FormatDate = 'YYYY-MM-DDTHH:mm:ss'

export const VARIABLES_DATE: VariablesDate = {
  'NOW': {
    startdate: NowStart.format(FormatDate),
    enddate: NowEnd.format(FormatDate)
  },
  'YESTERDAY': {
    startdate: NowStart.subtract(1, 'day').format(FormatDate),
    enddate: NowEnd.subtract(1, 'day').format(FormatDate)
  },
  'THISMONTH': {
    startdate: NowEnd.startOf('month').format(FormatDate),
    enddate: NowEnd.endOf('month').format(FormatDate)
  },
  'LAST30DAYS': {
    startdate: NowStart.subtract(30, 'days').format(FormatDate),
    enddate: NowEnd.format(FormatDate)
  },
  'ALL': {
    startdate: '',
    enddate: ''
  },
}