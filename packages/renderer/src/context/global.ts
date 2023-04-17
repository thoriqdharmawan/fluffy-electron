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

const Now = dayjs(new Date())
const FormatDate = 'YYYY-MM-DD'

export const VARIABLES_DATE: VariablesDate = {
  'NOW': {
    startdate: Now.format(FormatDate),
    enddate: Now.add(1, 'day').format(FormatDate)
  },
  'YESTERDAY': {
    startdate: Now.subtract(1, 'day').format(FormatDate),
    enddate: Now.format(FormatDate)
  },
  'THISMONTH': {
    startdate: Now.startOf('month').format(FormatDate),
    enddate: Now.endOf('month').format(FormatDate)
  },
  'LAST30DAYS': {
    startdate: Now.subtract(30, 'days').format(FormatDate),
    enddate: Now.format(FormatDate)
  },
}