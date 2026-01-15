import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../../../Transaction/styles';
import {Button, Container, Input} from '../../../../../components';
import {colors, gStyles} from '../../../../../utils/styles';
import API, {getErrorResponse} from '../../../../../services/api';
import {IconCoupon} from '../../../../../assets';
import {
  setAlert,
  setLoading,
  setMessage,
  setMessageType,
} from '../../../../../services';

const KuponAdd = ({
  setSelectedKupon,
  setBottomPanelPopup,
  SelectedKomoditi,
  SelectedKupon,
  navigation,
  dispatch,
  customBack,
}) => {
  const idKomoditiList = SelectedKomoditi.map(
    komoditi => komoditi.commoditie_id,
  )
    .filter((value, index, _arr) => _arr.indexOf(value) === index)
    .toString();

  const [data, setData] = useState([]);
  useEffect(() => {
    // console.log('selectedKomoditi', SelectedKomoditi);
    // console.log('idKomoditiList', idKomoditiList);
    API.get(`farmer/offer/special-price?commoditie_id_list=${idKomoditiList}`)
      .then(res => {
        console.log('API res get list kupon', res);

        setData(res.data);
      })
      .catch(err => {
        console.log('err get list kupon', err);
        setData([]);
      });
  }, []);

  const pilihKupon = kupon => {
    dispatch(setLoading(true));

    API.get(`farmer/offer/special-price/${kupon?.id}`)
      .then(res => {
        console.log('res get detail kupon', res);
        if (res?.meta?.http_status === 200) {
          dispatch(setSelectedKupon({...kupon, ...res.data}));

          dispatch(setMessage('Berhasil Menggunakan Kupon'));
          dispatch(setMessageType('success'));
          dispatch(setAlert(true));

          dispatch(setLoading(false));
          setBottomPanelPopup({show: false});
        } else {
          // console.log('error', res?.response?.data?.errors);

          const errMessage = getErrorResponse(res?.response?.data?.errors);
          dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
          dispatch(setMessageType('error'));
          dispatch(setAlert(true));

          dispatch(setLoading(false));
          setBottomPanelPopup({show: false});
        }
      })
      .catch(err => {
        console.log('err get detail kupon', err);
        const errMessage = getErrorResponse(err?.response?.data?.errors);
        dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
        dispatch(setMessageType('error'));
        dispatch(setAlert(true));
        dispatch(setLoading(false));
        setBottomPanelPopup({show: false});
      });
  };

  return (
    <Container style={[styles.container, styles.cardNoBorder]}>
      {/* <Text>KuponAdd</Text> */}
      <View style={gStyles.padding(16)}>
        <Input placeholder={'Masukan kode kupon disini'} />
      </View>
      <View style={styles.wrapperListKupon}>
        {data?.coupon?.map((dt, i) => (
          <TouchableOpacity
            style={[
              gStyles.row_center2,
              styles.card,
              {
                marginBottom: 10,
                borderColor:
                  dt.id === SelectedKupon?.id ? '#FF9100' : '#E3E3E5',
              },
            ]}
            key={i}
            onPress={() =>
              navigation.navigate('KuponDetail', {
                data: dt,
                pilihKupon: pilihKupon,
                wording: 'Pilih Kupon Ini',
                customBack: customBack,
              })
            }>
            {console.log('dt', dt)}
            {SelectedKupon?.id === dt.id ? (
              <View style={gStyles.badgeVoucher}>
                <IconCoupon width={17} height={17} />
                <Text style={gStyles.text(12, '500', 'white')}>Dipilih</Text>
                <View style={gStyles.triangleCorner} />
              </View>
            ) : null}
            <View style={gStyles.col}>
              <Text
                style={[gStyles.text(14, '500', '#313447'), {lineHeight: 25}]}>
                {dt.coupon_code}
              </Text>
              <Text style={gStyles.text(12, '200', '#797B8A')}>
                {dt.description}
              </Text>
            </View>
            {SelectedKupon?.id === dt.id ? null : (
              <Button
                title="Pilih"
                style={[
                  gStyles.paddingVertical(5),
                  gStyles.paddingHorizontal(12),
                ]}
                type={'full'}
                textStyle={gStyles.text(12, '400', colors.light)}
                onPress={() => {
                  pilihKupon(dt);
                  setBottomPanelPopup({show: false});
                }}
              />
            )}
          </TouchableOpacity>
        ))}
        <View
          style={[
            gStyles.line('#E3E3E5', 1),
            gStyles.marginTop(6),
            gStyles.marginBottom(16),
          ]}
        />
        <Text style={gStyles.text(14, '500', '#313447')}>
          Belum ada kupon yang bisa dipakai
        </Text>
        <View style={[gStyles.col, gStyles.marginVertical(16)]}>
          {data?.invalid_coupon?.map((dt, i) => (
            <TouchableOpacity
              style={[
                gStyles.row_center2,
                styles.card,
                gStyles.marginBottom(10),
              ]}
              key={i}
              onPress={() =>
                navigation.navigate('KuponDetail', {
                  data: dt,
                  customBack: customBack,
                })
              }>
              <View style={gStyles.col}>
                <Text
                  style={[
                    gStyles.text(14, '500', '#313447'),
                    {lineHeight: 25},
                  ]}>
                  {dt.coupon_code}
                </Text>
                <Text style={gStyles.text(12, '200', '#797B8A')}>
                  {dt.description}
                </Text>
              </View>
              <Button
                title="Pilih"
                style={[
                  gStyles.paddingVertical(5),
                  gStyles.paddingHorizontal(12),
                ]}
                type={'full'}
                textStyle={gStyles.text(12, '400', colors.light)}
                isDisabled
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Container>
  );
};

export default KuponAdd;
