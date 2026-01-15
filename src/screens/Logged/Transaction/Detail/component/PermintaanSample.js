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
  BottomPanelModal,
  Button,
  LoadingAnimated,
  RadioButtons,
} from '../../../../../components';
import {colors, gStyles} from '../../../../../utils/styles';
import styles from '../../styles';
import API from '../../../../../services/api';
import {useDispatch} from 'react-redux';
import {InfoCircle} from '../../../../../assets';
import {ImageProduct} from '../../../../../components/atoms/Product';
import DecimalInput from '../../../../../components/atoms/Form/DecimalInput';
import {delimiterFormat} from '../../../../../utils/helpers/number';

const PermintaanSample = ({
  data,
  setIsLoading,
  Status,
  _handleAlertMessage,
  getDetailOffer,
}) => {
  const [isBottomPanelForm, setIsBottomPanelForm] = useState(false);
  const [KomoditiForm, setKomoditiForm] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    // console.log('data offerID', offerID);
    console.log('data offerID', data.id, data?.offer_number);
    if (data?.offer_commodities?.length > 0) {
      setKomoditiForm(
        data.offer_commodities.map(komoditi => ({
          offer_commoditie_id: komoditi.id,
          name: komoditi.commoditie_name,
          sku: komoditi?.commoditie_or_variant_sku
            ? komoditi.commoditie_or_variant_sku
            : '',
          image: komoditi?.commoditie_photos,
          sample_quantity: 0,
          showAlert: false,
        })),
      );
    }
  }, [data]);

  const handleFormShow = (show = false) => {
    if (show) {
      setIsBottomPanelForm(true);
    } else {
      setIsBottomPanelForm(false);
    }
  };

  const onChangeQuantity = (text, id) => {
    let value = text.split('.').join('');
    value = delimiterFormat(value, '.');
    console.log('value', value);

    setKomoditiForm(
      KomoditiForm.map(dt =>
        dt.offer_commoditie_id === id
          ? {...dt, sample_quantity: value}
          : {...dt},
      ),
    );
  };

  const handleSubmitFormSample = async (show = false) => {
    let isEmpty = false;
    let formData = KomoditiForm.map(komoditi => {
      if (komoditi.sample_quantity === 0) {
        isEmpty = true;
      }
      return {
        sample_quantity: parseFloat(komoditi.sample_quantity.replace(',', '.')),
        offer_commoditie_id: komoditi.offer_commoditie_id,
      };
    });
    setKomoditiForm(
      KomoditiForm.map(komoditi => ({
        ...komoditi,
        showAlert: komoditi.sample_quantity === 0,
      })),
    );
    console.log('offerID', data.id);
    console.log('formData', formData);
    if (isEmpty) {
      return;
    }
    // return;

    setIsLoading(true);
    await API.put('/farmer/offer/ship-sample/' + data.id, formData)
      .then(async res => {
        console.log('res handleSubmitFormSample', res);
        if (res?.meta?.http_status === 200) {
          _handleAlertMessage('', 'success', 'Berhasil Dikirim');
          await getDetailOffer(data?.offer_number);
          setIsBottomPanelForm(false);
        } else {
          _handleAlertMessage(res, 'error');
        }
      })
      .catch(err => {
        _handleAlertMessage(err, 'error');
      });
    setIsLoading(false);
    setIsBottomPanelForm(false);
  };

  return (
    <>
      {/* <LoadingAnimated visible={isLoading} /> */}
      <View
        style={[
          styles.cardNoBorder,
          gStyles.col,
          {marginBottom: 0, backgroundColor: '#2E3192', borderRadius: 0},
        ]}>
        <View style={gStyles.row_center3}>
          <InfoCircle height={20} width={20} fill="#fff" />
          <Text
            style={[
              gStyles.text(16, '700', '#fff'),
              {margin: 0, marginLeft: 6},
            ]}>
            Permintaan Sample Komoditi
          </Text>
        </View>

        <Text
          style={[
            gStyles.text(14, '400', '#fff'),
            {marginVertical: 6, lineHeight: 20},
          ]}>
          Talasi membutuhkan beberapa Sample komoditi untuk dapat melanjutkan
          proses penawaran
        </Text>
        <TouchableOpacity
          style={[styles.btnCancel, {backgroundColor: '#fff', width: '100%'}]}
          onPress={handleFormShow}>
          <Text style={[gStyles.text(14, '500', '#2E3192'), {margin: 0}]}>
            Kirim Sample
          </Text>
        </TouchableOpacity>
      </View>

      {isBottomPanelForm ? (
        <BottomPanelModal
          radius={12}
          clickOutsideToClosePanel
          closePanel={() => setIsBottomPanelForm(false)}
          height={'100%'}
          withHeader={'Kirim Sample Komoditi'}
          showCloseBtn={'Kirim Sample Komoditi'}
          title={'Kirim Sample Komoditi'}
          shadowTitle={true}
          backgroundPanel={'#fff'}
          content={
            <View
              style={[
                {
                  flex: 1,
                  backgroundColor: '#fff',
                },
              ]}>
              <KeyboardAvoidingView behavior={'height'}>
                <ScrollView
                  style={{
                    padding: 16,
                  }}
                  automaticallyAdjustKeyboardInsets={true}
                  contentContainerStyle={{flexGrow: 1}}>
                  <Text style={[gStyles.text(14, '400', 'black')]}>
                    Silahkan atur beberapa kuantitas komoditi yang akan Anda
                    kirim untuk Sample.
                  </Text>
                  {data?.request_sample_notes !== '' && (
                    <View style={{marginVertical: 8}}>
                      <Text
                        style={[
                          gStyles.text(14, '400', 'black'),
                          {marginBottom: 4},
                        ]}>
                        Notes :
                      </Text>
                      <Text style={[gStyles.text(14, '400', 'gray')]}>
                        {data?.request_sample_notes}
                      </Text>
                    </View>
                  )}
                  <View>
                    {KomoditiForm.map((komoditi, i) => (
                      <View style={styles.cardKomoditi} key={i}>
                        <View style={[styles.item, {padding: 5}]}>
                          <View style={[styles.boxIcon, {padding: 6}]}>
                            {/* <BoxIcon width={35} height={35} /> */}
                            <ImageProduct
                              url={komoditi?.image}
                              style={[
                                gStyles.dimension('100%', '100%'),
                                {borderRadius: 40},
                              ]}
                            />
                          </View>
                          <View style={styles.sku}>
                            <Text style={[gStyles.text(14, '500', '#313447')]}>
                              {komoditi.name}
                            </Text>
                            {komoditi?.sku ? (
                              <Text style={gStyles.text(12, '400', '#797B8A')}>
                                ( {komoditi?.sku} )
                              </Text>
                            ) : null}
                          </View>
                        </View>
                        <View style={[gStyles.col, {marginHorizontal: 10}]}>
                          <Text style={gStyles.text(14, '400', '#313447')}>
                            Kuantitas
                          </Text>
                          <View
                            style={[
                              gStyles.position('relative'),
                              {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: 6,
                              },
                            ]}>
                            <DecimalInput
                              value={komoditi.sample_quantity}
                              keyboardType={'numeric'}
                              onChangeText={val =>
                                onChangeQuantity(
                                  val,
                                  komoditi.offer_commoditie_id,
                                )
                              }
                              // onChangeDisplayText={setDisplayValueFarmerPrice}
                              style={[
                                gStyles.inputField,
                                {
                                  borderColor: komoditi.showAlert
                                    ? 'red'
                                    : 'lightgray',
                                },
                              ]}
                            />
                            <Text
                              style={[
                                gStyles.position('absolute'),
                                {right: 10},
                              ]}>
                              Gram
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                  <View
                    style={[
                      styles.cardNoBorder,
                      {padding: 0, marginVertical: 16},
                    ]}>
                    <View
                      style={[
                        gStyles.col_2,
                        {marginBottom: 0, height: 'auto'},
                      ]}>
                      <Text style={[gStyles.text(14, '400', 'black')]}>
                        Tekan tombol ini ketika barang sudah siap dikirim
                      </Text>
                      <Button
                        title={'Kirim'}
                        type="full"
                        style={{width: '100%', marginVertical: 8}}
                        textStyle={gStyles.btnSecondaryText}
                        onPress={() => handleSubmitFormSample()}
                      />
                    </View>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          }
        />
      ) : null}
    </>
  );
};

export default PermintaanSample;
