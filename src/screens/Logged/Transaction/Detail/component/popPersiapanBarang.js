import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {gStyles} from '../../../../../utils/styles';
import {WarningHexagon} from '../../../../../assets';
import styles from '../../../Penawaran/styles';
import {Button} from '../../../../../components';
import API from '../../../../../services/api';
import {findMonthName} from '../../../../../utils/helpers/date';

const PopPersiapanBarang = ({
  setBottomPanelPopup,
  handleRefresh,
  _handleAlertMessage,
  data,
  setIsLoading,
}) => {
  const updateStatus = async () => {
    setIsLoading(true);
    await API.get(`/farmer/offer/persiapan/${data.id}`)
      .then(res => {
        console.log('res updateStatus === ', data.id, res);
        if (res?.meta?.http_status === 200) {
          _handleAlertMessage(res, 'success', res.message);
          handleRefresh();
        } else _handleAlertMessage(res, 'error', res.message);

        setIsLoading(false);
      })
      .catch(err => {
        console.log('err submit', err);
        _handleAlertMessage(err);
        setIsLoading(false);
      });
    setBottomPanelPopup({
      show: false,
      data: {},
    });
  };

  return (
    <View
      style={[
        styles.cardNoBorder,
        {padding: 16, paddingTop: 0, marginBottom: 20},
      ]}>
      <Text style={gStyles.text(12, '400', '#797B8A')}>
        Silahkan siapkan barang sebelum
      </Text>
      <View
        style={[
          gStyles.row,
          {
            backgroundColor: '#F5F6F7',
            padding: 8,
            marginTop: 8,
            justifyContent: 'center',
          },
        ]}>
        <Text style={gStyles.text(16, '400', '#797B8A')}>
          <Text style={gStyles.text(16, '400', '#313447')}>
            {findMonthName(data?.shipping_month)}{' '}
          </Text>
          (Minggu ke-{data?.shipping_week})
        </Text>
      </View>
      <View
        style={[
          gStyles.row,
          {
            backgroundColor: '#FFF6EB',
            padding: 8,
            marginTop: 8,
            justifyContent: 'center',
          },
        ]}>
        <WarningHexagon />
        <Text
          style={[
            gStyles.text(14, '400', '#313447'),
            {
              lineHeight: 25,
              width: '90%',
              paddingLeft: 5,
            },
          ]}>
          Talasi berhak melakukan pembatalan transaksi, jika barang tidak
          kunjung dikirim dalam 3x24 jam setelah lewat dari Jadwal Pengiriman.
        </Text>
      </View>
      <Button
        title={'Oke'}
        type="full"
        style={{marginTop: 15}}
        textStyle={gStyles.btnSecondaryText}
        onPress={() => updateStatus()}
      />
    </View>
  );
};

export default PopPersiapanBarang;
