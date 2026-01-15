import {
  View,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../styles';
import {Button, Container, Input} from '../../../../components';
import {gStyles} from '../../../../utils/styles';
import {BoxIcon, InfoCircle} from '../../../../assets';
import ShipingItem from './component/itemKirim';
import {findMonthName} from '../../../../utils/helpers/date';
import API from '../../../../services/api';

const AturPengiriman = ({
  closePanel,
  showCatatan,
  status,
  handleRefresh,
  DataOffer,
  DataListKomoditi,
  DataShipping,
  setIsLoading,
  _handleAlertMessage,
}) => {
  const [DataPengiriman, setDataPengiriman] = useState(null);
  const [KomoditiPraSubmit, setKomoditiPraSubmit] = useState([]);
  // console.log('DataShipping', DataShipping);

  useEffect(() => {
    if (DataOffer?.id) {
      getDetailJadwal(DataOffer.id);
    }
  }, []);

  const getDetailJadwal = async offer_id => {
    setIsLoading(true);
    await API.get(`/farmer/offer/pengiriman/${offer_id}`, true)
      .then(res => {
        console.log('res getDetailJadwal === ', res);
        if (res?.meta?.http_status === 200) {
          setDataPengiriman(res.data);
          // setDataPengiriman({...res.data});
          if (res?.data?.offer_commoditie_shipping?.length > 0) {
            setKomoditiPraSubmit(res.data.offer_commoditie_shipping);
          }
        } else {
          Alert.alert('', _handleAlertMessage(res, 'error'));
        }
      })
      .catch(err => Alert.alert('', _handleAlertMessage(err, 'error')));
    setIsLoading(false);
  };

  const submitPengiriman = async () => {
    let findError =
      KomoditiPraSubmit.length === 0 ||
      KomoditiPraSubmit.find(komo => komo.qty === 0);
    console.log('KomoditiPraSubmit', KomoditiPraSubmit);
    if (findError) {
      // Alert.alert('', 'Kuantitas tidak boleh kosong');
      // return;
    }
    const formData = {
      offer_id: DataOffer.id,
      data: KomoditiPraSubmit,
    };
    console.log('formData', formData);
    // return;
    setIsLoading(true);
    await API.post('/farmer/offer/pengiriman', formData, true)
      .then(res => {
        console.log('res submitPengiriman === ', res);
        if (res?.meta?.http_status === 200) {
          _handleAlertMessage(res, 'success', res.message);
          handleRefresh();
          closePanel();
        } else {
          Alert.alert('', _handleAlertMessage(res, 'error'));
        }
      })
      .catch(err => Alert.alert('', _handleAlertMessage(err, 'error')));
    setIsLoading(false);
  };

  return (
    <View style={{flex: 1, paddingBottom: 40}}>
      {DataPengiriman && (
        <KeyboardAvoidingView behavior={'padding'}>
          <View
            style={[
              styles.headerFixed,
              {
                backgroundColor: '#EBF8FF',
              },
            ]}>
            <InfoCircle />
            <Text
              style={[gStyles.text(14, '400', '#313447'), {paddingLeft: 5}]}>
              Pengiriman barang dilakukan oleh petani
            </Text>
          </View>
          <Container backgroundColor={'#F5F6F7'}>
            {/* <SafeAreaView style={{flex: 1}}> */}

            {/* ================== ================== */}

            <View style={[styles.cardNoBorder, styles.cardSpace]}>
              <Text style={gStyles.text(16, '700', '#313447')}>
                Jadwal Pengiriman
              </Text>
              <Text
                style={[
                  gStyles.text(16, '400', '#797B8A'),
                  {
                    padding: 5,
                    backgroundColor: '#F5F6F7',
                    textAlign: 'center',
                    marginTop: 10,
                  },
                ]}>
                {findMonthName(DataPengiriman?.shipping_mont)} (Minggu Ke-
                {DataPengiriman?.shipping_week})
              </Text>
            </View>

            {/* ================== ================== */}
            <View style={[styles.cardNoBorder, styles.cardSpace]}>
              <ShipingItem
                input={true}
                showCatatan={showCatatan}
                DataShipping={DataShipping}
                status={status}
                DataPengiriman={DataPengiriman}
                dataKomoditi={DataListKomoditi}
                setKomoditiPraSubmit={setKomoditiPraSubmit}
                KomoditiPraSubmit={KomoditiPraSubmit}
              />
            </View>
            {/* ================== ================== */}

            <View
              style={[
                styles.cardNoBorder,
                gStyles.row_center,
                // {position: 'absolute', bottom: 0},
              ]}>
              <Button
                title="Kirim"
                type="full"
                // isDisabled
                style={{width: '100%'}}
                onPress={() => submitPengiriman()}
              />
            </View>
            {/* </SafeAreaView> */}
          </Container>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default AturPengiriman;
