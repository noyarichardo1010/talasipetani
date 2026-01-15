import {View, Text} from 'react-native';
import React from 'react';
import {gStyles} from '../../../../utils/styles';
import {Button} from '../../../../components';
import {AddSquare, IconEmptyTransaction} from '../../../../assets';

const EmptyTransaction = ({
  handleBuatPenawaran,
  title = '',
  customText = null,
}) => {
  return (
    <>
      <View style={{marginBottom: 20}}>
        <IconEmptyTransaction />
      </View>
      <Text style={[gStyles.text(16, '700', '#313447')]}>
        {customText ? customText.title : `Belum Ada Transaksi ${title}`}
      </Text>
      <Text
        style={[
          gStyles.text(12, '400', '#313447'),
          {marginTop: 8, marginBottom: 16, textAlign: 'center'},
        ]}>
        {customText
          ? customText.body
          : 'Buat penawaran baru melalui tombol di bawah ini.'}
      </Text>
      <Button
        onPress={() => {
          if (customText) customText.onPress();
          else handleBuatPenawaran();
        }}
        type="full"
        style={{width: 170, borderRadius: 8}}
        title={
          <View style={gStyles.row_center}>
            <AddSquare width={24} height={24} />
            <Text
              style={[
                {lineHeight: 20, marginLeft: 8},
                gStyles.text(14, '500', '#FFFFFF'),
              ]}>
              {customText ? customText.btn : 'Buat Penawaran'}
            </Text>
          </View>
        }
      />
    </>
  );
};

export default EmptyTransaction;
