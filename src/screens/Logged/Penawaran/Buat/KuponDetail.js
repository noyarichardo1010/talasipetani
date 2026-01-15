import {StyleSheet, Text, View, ScrollView, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import API from '../../../../services/api';
import {useDispatch, useSelector} from 'react-redux';
import {BoxIcon, IconLeftArrow} from '../../../../assets';
import {
  AppBar,
  BottomPanel,
  Button,
  ModalComponent,
} from '../../../../components';
import {gStyles} from '../../../../utils/styles';
import {delimiterFormat} from '../../../../utils/helpers/number';
import {ImageProduct} from '../../../../components/atoms/Product';
import {getOfferNumber} from '../../../../services';

const KuponDetail = ({navigation, route}) => {
  const {data, pilihKupon, wording, customBack} = route.params;
  const [detail, setDetail] = useState([]);

  const dispatch = useDispatch();
  const {theme} = useSelector(reducer => reducer.global);
  const [BottomPanelPopup, setBottomPanelPopup] = useState({
    show: false,
    data: null,
    title: '',
    type: '',
  });
  //   console.log('route,params', route.params);
  useEffect(() => {
    // console.log('data', data);
    // console.log('pilihKupon', pilihKupon);
    API.get(`farmer/offer/special-price/${data?.id}`)
      .then(res => {
        console.log('res get detail kupon', res);
        setDetail(res.data);
      })
      .catch(err => {
        console.log('err get detail kupon', err);
      });
  }, []);

  const cancel = () => {
    setBottomPanelPopup({show: false});
  };
  const pakaiKupon = async () => {
    navigation.goBack();
    pilihKupon(detail);
    // await dispatch(getOfferNumber())
    //   .then(res => {
    //     console.log('res handleBuatPenawaran', res);
    //     // pilihKupon(detail);
    // pilihKupon({...data, ...detail});

    //     if (res.success) {
    //       navigation.navigate('BuatPenawaran');
    //     } else if (res.message) {
    //       Alert.alert(res.message);
    //     } else {
    //       cancel();
    //     }
    //   })
    //   .catch(err => {
    //     console.log('err', err);
    //     Alert.alert(err?.message);
    //   });
  };

  return (
    <View style={styles.container}>
      <AppBar
        appBarColor={theme.backgroundColor}
        navigation={navigation}
        headerTextColor={theme.textColor}
        customBack={customBack}
        hideRightContent
        iconLeft={
          <IconLeftArrow width={20} height={20} fill={theme.textColor} />
        }
        title={`Kupon ${data.coupon_code}`}
        borderBottom
        borderBottomColor={theme.textColor}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: theme.backgroundColor,
        }}>
        <View style={styles.wrapper}>
          <Text style={gStyles.text(14, '400', '#313447')}>
            {data?.description ?? 'description'}
          </Text>
          {detail?.commoditie_detail?.map((dt, i) => (
            <View style={styles.card} key={i}>
              <View style={gStyles.row_center3}>
                <View style={[gStyles.boxIcon, {marginRight: 12}]}>
                  {/* <BoxIcon width={30} height={30} />{' '} */}
                  <ImageProduct
                    url={dt?.commoditie_photo}
                    style={[
                      gStyles.dimension('100%', '100%'),
                      {borderRadius: 40},
                    ]}
                  />
                </View>
                <View style={gStyles.col}>
                  <Text style={gStyles.text(14, '500', '#313447')}>
                    {dt.commoditie_name}
                  </Text>
                  {dt.variant.length > 0 ? (
                    <Text style={gStyles.text(12, '400', '#797B8A')}>
                      {dt.variant.length} Varian
                    </Text>
                  ) : null}
                </View>
              </View>
              <View
                style={[gStyles.line('#E3E3E5', 1), gStyles.marginVertical(12)]}
              />
              {dt?.variant?.map((variant, idx) => (
                <View key={idx}>
                  <Text style={gStyles.text(14, '500', '#313447')}>
                    {variant?.variant_name ?? 'Variant Name'}
                  </Text>

                  {variant?.data?.map((grade, index) => (
                    <View
                      style={[gStyles.marginTop(8), gStyles.row_2]}
                      key={index}>
                      <Text
                        style={[
                          gStyles.text(14, '400', '#313447'),

                          gStyles.marginRight(8),
                        ]}>
                        Grade {grade.grade_name}
                      </Text>
                      <Text style={gStyles.text(14, '400', '#313447')}>
                        : Rp {delimiterFormat(grade.price)}
                      </Text>
                    </View>
                  ))}
                  {dt?.variant?.length === idx + 1 ? null : (
                    <View
                      style={[
                        gStyles.line('#E3E3E5', 1),
                        gStyles.marginVertical(12),
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <>
        <View style={[styles.borderTop, {boxShadow: theme.textColor}]} />
        <View
          style={[
            gStyles.paddingHorizontal(16),
            gStyles.paddingVertical(8),
            {
              backgroundColor: theme.backgroundColor,
            },
          ]}>
          <Button
            // title="Pilih Kupon Ini"
            // onPress={() => pilihKupon(data)}
            onPress={() =>
              setBottomPanelPopup({...BottomPanelPopup, show: true})
            }
            title={wording ? wording : 'Pilih Kupon Ini'}
            type="full"
            isDisabled={!pilihKupon ? true : false}
          />
        </View>
      </>
      {BottomPanelPopup.show && (
        <BottomPanel
          radius={12}
          clickOutsideToClosePanel
          height={BottomPanelPopup.type === 'full' ? '100%' : 'auto'}
          showCloseBtn
          animate
          positionAnimatePop={BottomPanelPopup.type === 'full' ? -1000 : -200}
          durationPop={BottomPanelPopup.type === 'full' ? 800 : 300}
          title={BottomPanelPopup.title}
          closePanel={() => setBottomPanelPopup({show: false})}
          content={
            <ModalComponent
              handleSubmit={pakaiKupon}
              cancel={cancel}
              title="Pakai Harga Khusus Untuk Penawaran Baru?"
              desc="Harga Khusus ini hanya bisa digunakan untuk Penawaran Baru."
              textBtnSubmit="Iya"
              textBtnCancel="Tidak"
            />
          }
        />
      )}
    </View>
  );
};

export default KuponDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    padding: 16,
  },
  card: {
    display: 'flex',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E3E3E5',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
    marginVertical: 16,
  },
});
