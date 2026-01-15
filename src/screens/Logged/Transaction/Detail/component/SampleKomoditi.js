import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  BadgeStatus,
  BottomPanelModal,
  Button,
  RadioButtons,
} from '../../../../../components';
import {colors, gStyles} from '../../../../../utils/styles';
import styles from '../../styles';
import API from '../../../../../services/api';
// import {_handleAlertMessage} from '../../../../../services';
import {useDispatch} from 'react-redux';
import {IconDownArrow, InfoCircle} from '../../../../../assets';
import {ImageProduct} from '../../../../../components/atoms/Product';
import DecimalInput from '../../../../../components/atoms/Form/DecimalInput';

const SampleKomoditi = ({data, offer, log}) => {
  const [KomoditiForm, setKomoditiForm] = useState([]);
  const [ShowDetail, setShowDetail] = useState(false);
  const [LogRequest, setLogRequest] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('log', log);
    if (log.length > 0) {
      if (
        log[0].status === 'Request Sample' ||
        log[0].status === 'Sample Dikirim' ||
        log[0].status === 'Sample Diterima' ||
        log[0].status === 'Sample Ditolak'
      ) {
        setLogRequest(log[0]);
      } else {
        setLogRequest({status: 'Sample Diterima'});
      }
    }
    // console.log('data SampleKomoditi', data);
  }, [data]);

  const onChangeQuantity = (value, id) => {
    console.log('onChangeQuantity', id, value);
    setKomoditiForm(
      KomoditiForm.map(dt =>
        dt.id === id ? {...dt, quantity: value} : {...dt},
      ),
    );
  };

  return (
    <View style={[styles.cardNoBorder]}>
      <TouchableOpacity
        onPress={() => setShowDetail(!ShowDetail)}
        style={gStyles.row}>
        <Text style={gStyles.text(16, '700', '#313447')}>Sample Komoditi</Text>
        <View
          style={{
            padding: 5,
            transform: [{rotateX: ShowDetail ? '180deg' : '0deg'}],
          }}>
          <IconDownArrow />
        </View>
      </TouchableOpacity>
      <View style={[gStyles.row_2, {alignItems: 'center', marginTop: 4}]}>
        <Text style={[gStyles.text(14, '500', '#313447')]}>Status</Text>
        {LogRequest && (
          <BadgeStatus
            status={LogRequest.status}
            backgroundColor={
              LogRequest.status === 'Sample Ditolak'
                ? '#FFEBEB'
                : LogRequest.status === 'Sample Diterima'
                ? '#EBFFEB'
                : '#FFF6EB'
            }
            textColor={
              LogRequest.status === 'Sample Ditolak'
                ? '#D80909'
                : LogRequest.status === 'Sample Diterima'
                ? '#149614'
                : '#FF9100'
            }
          />
        )}
      </View>
      {ShowDetail && (
        <>
          {offer?.sample_notes !== '' && (
            <View style={{marginVertical: 8}}>
              <Text
                style={[gStyles.text(14, '400', 'black'), {marginBottom: 4}]}>
                Notes :
              </Text>
              <Text style={[gStyles.text(14, '400', 'gray')]}>
                {offer?.sample_notes}
              </Text>
            </View>
          )}
          <View style={[styles.cardKomoditi, {paddingBottom: 0, padding: 6}]}>
            {data.map((komoditi, i) => {
              console.log('komoditi', komoditi);

              return (
                <View
                  key={i}
                  style={[
                    styles.item,
                    {
                      padding: 6,
                      paddingHorizontal: 8,
                      borderTopWidth: i == 0 ? 0 : 1,
                      borderColor: '#E3E3E5',
                    },
                  ]}>
                  <View style={[styles.boxIcon, {padding: 6, marginRight: 6}]}>
                    <ImageProduct
                      url={komoditi?.commoditie_photos}
                      style={[
                        gStyles.dimension('100%', '100%'),
                        {borderRadius: 40},
                      ]}
                    />
                  </View>
                  <View>
                    <Text style={[gStyles.text(14, '500', '#313447')]}>
                      {komoditi.commoditie_name}
                    </Text>
                    <Text
                      style={[
                        gStyles.text(12, '400', '#797B8A'),
                        {marginVertical: 4},
                      ]}>
                      (
                      {komoditi?.commoditie_or_variant_sku
                        ? komoditi.commoditie_or_variant_sku
                        : ''}
                      )
                    </Text>
                    <Text style={gStyles.text(14, '400', '#313447')}>
                      {komoditi.shipped_sample_quantity} gram
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
};

export default SampleKomoditi;
