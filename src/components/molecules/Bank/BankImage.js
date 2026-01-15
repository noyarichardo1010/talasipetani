import React from 'react';
import {Image} from 'react-native';
import {
  BankBCA,
  BankBNI,
  BankBRI,
  BankBTN,
  BankCIMB,
  BankDanamon,
  BankJenius,
  BankMandiri,
  BankMaybank,
  BankPanin,
  BankPermata,
} from '../../../assets';

const _renderBankImage = bank => {
  // console.log('bank', bank);
  switch (bank) {
    case 'BCA':
    case 1:
      return <Image source={BankBCA} width={63} height={45} />;

    case 'BNI':
    case 2:
      return <Image source={BankBNI} width={63} height={45} />;

    case 'BRI':
    case 3:
      return <Image source={BankBRI} width={63} height={45} />;

    case 'BTN':
    case 4:
      return <Image source={BankBTN} width={63} height={45} />;

    case 'CIMB Niaga':
    case 5:
      return <Image source={BankCIMB} width={63} height={45} />;

    case 'MANDIRI':
    case 6:
      return <Image source={BankMandiri} width={63} height={45} />;

    case 'DANAMON':
    case 7:
      return <Image source={BankDanamon} width={63} height={45} />;

    case 'JENIUS':
    case 8:
      return <Image source={BankJenius} width={63} height={45} />;

    case 'MAYBANK':
    case 9:
      return <Image source={BankMaybank} width={63} height={45} />;

    case 'PANIN BANK':
    case 10:
      return <Image source={BankPanin} width={63} height={45} />;

    case 'PERMATA BANK':
    case 11:
      return <Image source={BankPermata} width={63} height={45} />;

    default:
      <Image source={BankPermata} width={63} height={45} />;
      break;
  }
};

const _checkBankName = id => {
  // console.log('bank', bank);
  switch (id) {
    case 1:
      return 'BCA';

    case 2:
      return 'BNI';

    case 3:
      return 'BRI';

    case 4:
      return 'BTN';

    case 5:
      return 'CIMB Niaga';

    case 6:
      return 'MANDIRI';

    case 7:
      return 'DANAMON';

    case 8:
      return 'JENIUS';

    case 9:
      return 'MAYBANK';

    case 10:
      return 'PANIN BANK';

    case 11:
      return 'PERMATA BANK';

    default:
      '';
      break;
  }
};

export default _renderBankImage;
export {_checkBankName};
