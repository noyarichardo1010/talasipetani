export const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, '');

export const formatNumberWithComma = (number = 0) => {
  // // Mengecek apakah number merupakan angka atau bukan
  // if (isNaN(number)) {
  //   return 'Input bukan angka';
  // }

  // // Menggunakan fungsi toLocaleString untuk menambahkan pemisah ribuan
  // let formattedNumber = number.toLocaleString('en-US');

  // return formattedNumber;
  // Check if the input is a valid number
  if (isNaN(parseFloat(number))) {
    return 'Input bukan angka';
  }

  // Round the number to two decimal places
  const roundedNumber = parseFloat(number).toFixed(2);

  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = roundedNumber.split('.');

  // Add thousand separators to the integer part
  // Add thousand separators to the integer part
  let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (isNaN(formattedIntegerPart)) {
    formattedIntegerPart = 0;
  }
  // Check if the decimal part is "00" and remove the decimal separator
  const formattedDecimalPart =
    decimalPart === '00' ? '' : ',' + `${decimalPart ?? 0}`;

  // Combine the formatted parts
  const formattedNumber = formattedIntegerPart + formattedDecimalPart;

  return formattedNumber;
};

export const NumberFormatter = (number, currency) => {
  if (!number) {
    return 0;
  }
  let rupiah = '';
  let posNeg = number < 0 ? '- ' : '';
  let nominal = Math.abs(number);

  const nominalRef = nominal?.toString().split('').reverse().join('');
  for (let i = 0; i < nominalRef.length; i++) {
    if (i % 3 === 0) {
      rupiah += `${nominalRef.substr(i, 3)}.`;
    }
  }

  if (currency) {
    currency = currency.replace(/\s/g, ' ');
    return (
      posNeg +
      currency +
      rupiah
        .split('', rupiah.length - 1)
        .reverse()
        .join('')
    );
  }
  return (
    posNeg +
    rupiah
      .split('', rupiah.length - 1)
      .reverse()
      .join('')
  );
};

export const numberRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const formatCurrency = value => {
  try {
    if (value) {
      const onlyDigits = value.replace(/[^0-9]/g, '');
      const currency = onlyDigits.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      return `Rp ${currency}`;
    } else {
      return 'Rp';
    }
  } catch (error) {
    return 'Rp';
  }
};

export function getRawValue(formattedString) {
  // Hapus karakter selain digit dan desimal
  const cleanedString = formattedString.replace(/[^0-9.,-]/g, '');

  // Ganti koma ribuan dengan string kosong dan koma desimal dengan titik
  const normalizedString = cleanedString.replace(/,/g, '').replace(/\./, '.');

  // Parse string menjadi nilai float
  const floatValue = parseFloat(normalizedString);

  // Pastikan nilai yang dihasilkan adalah angka valid
  return isNaN(floatValue) ? 0 : floatValue;
}

// export const delimiterFormat = (number, separator) => {
//   let newNumber = number.toString();
//   let isMinus = newNumber[0] === '-';
//   let nNumber = isMinus ? newNumber.substr(1, newNumber.length - 1) : newNumber;
//   nNumber = Math.round(nNumber);
//   let numberString = nNumber.toString();
//   // let decimal = numberString.split('.')[1]? (numberString.split('.')[1] === "00"? null : numberString.split('.')[1]) : null;
//   numberString = numberString.split('.')[0];
//   let sisa = numberString.length % 3;
//   let currency = numberString.substr(0, sisa);
//   let ribuan = numberString.substr(sisa).match(/\d{3}/g);

//   if (ribuan) {
//     let separate = sisa ? separator : '';
//     currency += separate + ribuan.join(separator);
//   }

//   return `${isMinus ? '- ' : ''}${currency}`;
// };

// export function delimiterFormat(n = '', separator = ',') {
//   var parts = n?.toString()?.split('.');
//   return (
//     parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') +
//     (parts[1] ? ',' + parts[1] : '')
//   );
// }

export function delimiterFormat(n = '', separator = ',') {
  var parts = n?.toString()?.split('.');
  if (!parts) {
    return '';
  }
  // Membatasi hanya dua angka di belakang koma
  if (parts[1]) {
    parts[1] = parts[1].substring(0, 2);
  }

  return (
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') +
    (parts[1] ? ',' + parts[1] : '')
  );
}
