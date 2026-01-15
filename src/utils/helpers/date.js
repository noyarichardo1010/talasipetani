import moment from 'moment';

const bulanIndo = [
  '',
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const dataBulanIndo = [
  {id: 1, value: 1, label: 'Januari'},
  {id: 2, value: 2, label: 'Februari'},
  {id: 3, value: 3, label: 'Maret'},
  {id: 4, value: 4, label: 'April'},
  {id: 5, value: 5, label: 'Mei'},
  {id: 6, value: 6, label: 'Juni'},
  {id: 7, value: 7, label: 'Juli'},
  {id: 8, value: 8, label: 'Agustus'},
  {id: 9, value: 9, label: 'September'},
  {id: 10, value: 10, label: 'Oktober'},
  {id: 11, value: 11, label: 'November'},
  {id: 12, value: 12, label: 'Desember'},
];

const findMonthName = id => {
  let find = dataBulanIndo.find(bln => bln.id === id);
  if (find) {
    return find.label;
  }
  return '';
};

const format_date_penawaran = (dates, timezone = false) => {
  let date = new Date(dates);

  let tanggal = date.getDate();
  let bulan = date.getMonth() + 1;
  let tahun = date.getFullYear();

  let jam = date.getHours();
  let menit = date.getMinutes();

  if (tanggal < 10) {
    tanggal = '0' + tanggal;
  }
  if (bulan < 10) {
    bulan = '0' + bulan;
  }

  if (jam < 10) {
    jam = '0' + jam;
  }
  if (menit < 10) {
    menit = '0' + menit;
  }

  let tzon = getTimeZoneIndo(dates);
  let zone = timezone ? ' ' + tzon : '';

  let parsed =
    tanggal +
    ' ' +
    bulanIndo[Math.abs(bulan)] +
    ' ' +
    tahun +
    ' ' +
    jam +
    ':' +
    menit +
    zone;
  return parsed;
};

function getTimeZone(date) {
  let offset = new Date(date).getTimezoneOffset(),
    o = Math.abs(offset);
  return (
    (offset < 0 ? '+' : '-') +
    ('00' + Math.floor(o / 60)).slice(-2) +
    ':' +
    ('00' + (o % 60)).slice(-2)
  );
}

function getTimeZoneIndo(date) {
  let offset = new Date(date).getTimezoneOffset(),
    o = Math.abs(offset);
  let zone = ('00' + Math.floor(o / 60)).slice(-2);
  let zoneIndo = zone === '07' ? 'WIB' : zone === '08' ? 'WITA' : 'WIT';
  return zoneIndo;
}

function getWeekOfMonth() {
  const date = new Date();
  let bulan = date.getMonth() + 1;
  let tahun = date.getFullYear();
  let totalDay = new Date(tahun, bulan, 0).getDate();
  let totalWeek = Math.ceil(totalDay / 7);
  return totalWeek;
}

function getWeekOfTheDay(input = moment()) {
  const date = new Date();
  // let tanggal = date.getDate();
  // let calc = Math.floor(tanggal / 7) + 1;
  // return calc;
  const firstDayOfMonth = input.clone().startOf('month');
  const firstDayOfWeek = firstDayOfMonth.clone().startOf('week');

  const offset = firstDayOfMonth.diff(firstDayOfWeek, 'days');

  return Math.ceil((input.date() + offset) / 7);
}

function convertDayToWeek(day, params = null) {
  let calc = Math.floor(day / 7);
  if (params) {
    if (calc === 0) {
      return 'Hari';
    } else {
      return 'Minggu';
    }
  }

  if (calc > 0) {
    return calc;
  } else {
    return day;
  }
}

function getMonthIndo(date) {
  let bulan = date.getMonth() + 1;
  return bulanIndo[Math.abs(bulan)];
}

function listYearPengiriman() {
  const date = new Date();
  let tahun = date.getFullYear();
  let arrayYear = [];

  for (let i = 0; i < 8; i++) {
    arrayYear.push({
      id: tahun + i,
      value: tahun + i,
      label: (tahun + i).toString(),
    });
  }
  // console.log('arrayYear', arrayYear);
  return arrayYear;
}

const format_tanggal_indo = date => {
  // console.log('format_tanggal_indo', date, new Date(date));
  // return;
  let tanggal = date.getDate();
  let bulan = date.getMonth() + 1;
  let tahun = date.getFullYear();
  if (tanggal < 10) {
    tanggal = '0' + tanggal;
  }

  if (bulan < 10) {
    bulan = '0' + bulan;
  }
  const bulanIndo = [
    '',
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  return tanggal + ' ' + bulanIndo[Math.abs(bulan)] + ' ' + tahun;
};

const tanggal_bulan_tahun = (date, spliter = '-', format = 1) => {
  let tanggal = date.getDate();
  let bulan = date.getMonth() + 1;
  let tahun = date.getFullYear();
  if (tanggal < 10) {
    tanggal = '0' + tanggal;
  }

  if (bulan < 10) {
    bulan = '0' + bulan;
  }
  if (format === 1) {
    date = tanggal + spliter + bulan + spliter + tahun;
  }
  if (format === 2) {
    date = tahun + spliter + bulan + spliter + tanggal;
  }
  return date;
};

const changeFormatSaldo = (dates, spliter = '-', format = 1) => {
  let date = dates;
  let splitDate = dates.split(spliter);
  // console.log('splitDate', splitDate);
  if (format === 1) {
    date = splitDate[2] + '/' + splitDate[1] + '/' + splitDate[0];
  }
  if (format === 2) {
    date = splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0];
  }
  // console.log('date', date);
  return date;
};

const getDatesBetweenDates = (startDate, endDate) => {
  let dates = [];
  //to avoid modifying the original date
  const theDate = new Date(startDate);
  while (theDate < new Date(endDate)) {
    dates = [...dates, new Date(theDate)];
    theDate.setDate(theDate.getDate() + 1);
  }
  dates = [...dates, new Date(endDate)];
  return dates;
};

const YMdToFormatIndo = date => {
  let b = date.split('-');
  let tanggal = b[2];
  let bulan = b[1];
  let tahun = b[0];
  // if(tanggal<10)
  // {
  //     tanggal='0'+tanggal;
  // }

  // if(bulan<10)
  // {
  //     bulan='0'+bulan;
  // }
  const bulanIndo = [
    '',
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  return tanggal + ' ' + bulanIndo[Math.abs(bulan)] + ' ' + tahun;
};

const YMdtoDateMonth = date => {
  let b = date.split('-');
  let tanggal = b[2];
  let bulan = b[1];
  let tahun = b[0];
  const bulanIndo = [
    '',
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  return tanggal + ' ' + bulanIndo[Math.abs(bulan)];
};

function checkTime(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

const jam_menit_detik = () => {
  let today = new Date();
  let curr_hour = today.getHours();
  let curr_minute = today.getMinutes();
  let curr_second = today.getSeconds();

  curr_hour = checkTime(curr_hour);
  curr_minute = checkTime(curr_minute);
  curr_second = checkTime(curr_second);
  return curr_hour + ':' + curr_minute + ':' + curr_second;
};

const tahun_bulan_tanggal = date => {
  let tanggal = date.getDate();
  let bulan = date.getMonth() + 1;
  let tahun = date.getFullYear();
  if (tanggal < 10) {
    tanggal = '0' + tanggal;
  }

  if (bulan < 10) {
    bulan = '0' + bulan;
  }
  date = tahun + '-' + bulan + '-' + tanggal;
  return date;
};

function jam_menit(date) {
  let h = date.getHours().toString().padStart(2, '0');
  let m = date.getMinutes().toString().padStart(2, '0');
  let mytime = h + ':' + m;
  return mytime;
}

// Fungsi untuk mengonversi format tanggal dan waktu
function formatChatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();

  // Cek jika tanggalnya sama dengan hari ini
  if (isSameDay(date, today)) {
    return formatDateToTime(timestamp);
  } else if (isYesterday(date, today)) {
    return 'Kemarin ' + formatDateToTime(timestamp);
  } else {
    return formatDateToFullDate(timestamp);
  }
}

// Fungsi untuk memeriksa apakah dua tanggal adalah hari yang sama
function isSameDay(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

// Fungsi untuk memeriksa apakah tanggal pertama adalah kemarin dari tanggal kedua
function isYesterday(date1, date2) {
  const yesterday = new Date(date2);
  yesterday.setDate(date2.getDate() - 1);
  return isSameDay(date1, yesterday);
}

// Fungsi untuk mengonversi tanggal dan waktu menjadi format waktu (HH:mm)
function formatDateToTime(timestamp) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Fungsi untuk mengonversi tanggal dan waktu menjadi format tanggal lengkap (DD MMMM YYYY HH:mm)
function formatDateToFullDate(timestamp) {
  const date = new Date(timestamp);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('id-ID', options);
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

export {
  format_date_penawaran,
  format_tanggal_indo,
  tanggal_bulan_tahun,
  changeFormatSaldo,
  getTimeZone,
  getTimeZoneIndo,
  tahun_bulan_tanggal,
  jam_menit_detik,
  YMdToFormatIndo,
  YMdtoDateMonth,
  getDatesBetweenDates,
  jam_menit,
  getWeekOfTheDay,
  convertDayToWeek,
  getWeekOfMonth,
  dataBulanIndo,
  findMonthName,
  getMonthIndo,
  listYearPengiriman,
  formatChatTimestamp,
  formatDuration,
};
