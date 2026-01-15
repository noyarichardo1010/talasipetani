import {View, Text, Alert} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {gStyles} from '../../../../../utils/styles';
import {Button, Input} from '../../../../../components';
import styles from '../../styles';
import {BoxIcon, IconNote} from '../../../../../assets';
import {ImageProduct} from '../../../../../components/atoms/Product';
import {
  NumberFormatter,
  delimiterFormat,
  formatNumberWithComma,
  getRawValue,
  removeNonNumeric,
} from '../../../../../utils/helpers/number';
import DecimalInput from '../../../../../components/atoms/Form/DecimalInput';

const ItemKirim = ({
  input = false,
  showCatatan,
  status,
  dataKomoditi,
  setKomoditiPraSubmit,
  KomoditiPraSubmit,
  DataShipping,
  DataPengiriman,
}) => {
  const [IsLoading, setIsLoading] = useState(false);
  // const [DataPengiriman, setDataPengiriman] = useState(dataKomoditi);

  // console.log('DataShipping', DataShipping);
  // console.log('DataPengiriman', DataPengiriman);
  // useEffect(() => {
  //   setIsLoading(true);
  //   // console.log('DataShipping', DataShipping);
  //   if (DataShipping) {
  //     DataShipping.map(data => {
  //       // console.log('data', data);
  //       // console.log('data.shipping_number', data.shipping_number);
  //       setPengiriman(data.shipping_number + 1);
  //     });
  //   }
  //   setIsLoading(false);
  // }, []);

  const showNote = komoditas => {
    console.log('komoditas', komoditas);
    showCatatan({
      detail: komoditas,
      name: komoditas.commoditie_name,
      sku: komoditas.commoditie_or_variant_sku || komoditas.sku,
      note: komoditas.note,
      shipping_number: DataPengiriman.count_pengiriman - 1,
      shipped_quantity: komoditas.terkirim_sebelum,
      received_quantity: komoditas.diterima,
    });
  };

  return (
    <>
      <View style={gStyles.row}>
        <Text style={gStyles.text(16, '700', '#313447')}>
          Pengiriman {DataPengiriman.count_pengiriman}
        </Text>
        {/* <Text
          style={[
            gStyles.text(10, '400', status === 10 ? '#149614' : '#FF9100'),
            {
              backgroundColor: status === 10 ? '#EBFFEB' : '#FFF6EB',
              padding: 5,
            },
          ]}>
          Pengiriman
        </Text> */}
      </View>
      <Text
        style={[
          gStyles.text(14, '400', '#313447'),
          {
            marginTop: 10,
            lineHeight: 20,
          },
        ]}>
        Silahkan atur berapa kuantitas komoditi yang akan Anda kirim.
      </Text>
      {DataPengiriman?.offer_commoditie_shipping.map((komoditi, i) => (
        <Item
          key={i}
          data={komoditi}
          pengirimanke={DataPengiriman.count_pengiriman}
          KomoditiPraSubmit={KomoditiPraSubmit}
          setKomoditiPraSubmit={setKomoditiPraSubmit}
          input={input}
          showNote={showNote}
          status={status}
        />
      ))}
    </>
  );
};

const Item = ({
  data,
  input,
  showNote,
  status,
  KomoditiPraSubmit,
  setKomoditiPraSubmit,
  pengirimanke,
}) => {
  // console.log('data item', data);
  const [Quantity, setQuantity] = useState(0);
  const [IsError, setIsError] = useState(false);

  const handleChange = useCallback(
    val => {
      console.log('val', val);
      setIsError(false);
      // let value = parseFloat(
      //   val?._dispatchInstances?.memoizedProps?.value ?? val,
      // );
      let value = val;
      console.log('value', value);
      // let quantityCheck = value;
      let quantityCheck = Number.isNaN(value) ? 0 : value;
      setQuantity(quantityCheck);
      let remap = KomoditiPraSubmit.map(dt => {
        if (dt.offer_commoditie_id === data.offer_commoditie_id) {
          return {
            offer_commoditie_id: data.offer_commoditie_id,
            sku: data.sku,
            qty: quantityCheck,
          };
        } else {
          return dt;
        }
      });
      console.log('remap concat', remap);
      setKomoditiPraSubmit(remap);
      return quantityCheck;
    },
    [KomoditiPraSubmit, setKomoditiPraSubmit, Quantity],
  );

  // const InputQuantity = useMemo(
  //   () => (
  //     <Input
  //       placeholder={'0'}
  //       name="number"
  //       placeholderTextColor={'#687083'}
  //       autoCorrect={false}
  //       autoCapitalize="none"
  //       value={formatNumberWithComma(Quantity)}
  //       onChangeText={value => handleChange(value)}
  //       // defaultValue={formatNumberWithComma(Quantity)}
  //       // onChangeText={value => setQuantity(parseInt(removeNonNumeric(value)))}
  //       // onEndEditing={val => handleChange(val)}
  //       // value={Quantity}
  //       // defaultValue={Quantity}
  //       keyboardType={'number-pad'}
  //       style={{paddingRight: 65, borderWidth: 0, width: '90%'}}
  //     />
  //   ),
  //   [KomoditiPraSubmit, Quantity, setKomoditiPraSubmit],
  // );
  const InputQuantity = useMemo(
    () => (
      <Input
        placeholder={'0'}
        name="number"
        placeholderTextColor={'#687083'}
        autoCorrect={false}
        autoCapitalize="none"
        value={Quantity}
        displayValue={formatNumberWithComma(Quantity)}
        onChangeText={value => handleChange(value)}
        // defaultValue={formatNumberWithComma(Quantity)}
        // onChangeText={value => setQuantity(parseInt(removeNonNumeric(value)))}
        // onEndEditing={val => handleChange(val)}
        // value={Quantity}
        // defaultValue={Quantity}
        keyboardType={'number-pad'}
        style={{paddingRight: 65, borderWidth: 0, width: '90%'}}
      />
    ),
    [KomoditiPraSubmit, Quantity, setKomoditiPraSubmit],
  );

  const [rawValueQuantity, setRawValueQuantity] = useState(0);
  const [displayValue, setDisplayValue] = useState('');

  const handleChangeKuantitas = val => {
    // console.log('value', val);
    setIsError(false);
    // let value = parseFloat(
    //   val?._dispatchInstances?.memoizedProps?.value ?? val,
    // );
    let value = getRawValue(val);
    console.log('value', value);
    // let quantityCheck = value;
    let quantityCheck = Number.isNaN(value) ? 0 : value;
    setQuantity(quantityCheck);
    let remap = KomoditiPraSubmit.map(dt => {
      if (dt.offer_commoditie_id === data.offer_commoditie_id) {
        return {
          offer_commoditie_id: data.offer_commoditie_id,
          sku: data.sku,
          qty: quantityCheck,
        };
      } else {
        return dt;
      }
    });
    console.log('remap concat', remap);
    setKomoditiPraSubmit(remap);
    return quantityCheck;
    // Handle the raw value (numeric) here
  };

  const onChangeInput = text => {
    let value = text.split('.').join('');

    let valid = /^[0-9]*$/.test(value) || text === '';
    // return {
    //   valid: valid,
    //   value: text === '' ? text : delimiterFormat(value, '.'),
    // };
    let dispValue = text === '' ? text : delimiterFormat(value, '.');
    // console.log('value', value);
    // console.log('dispValue', dispValue);
    // let quantityCheck = value;
    let quantityCheck = Number.isNaN(value) ? 0 : value;
    setDisplayValue(dispValue);
    setQuantity(parseFloat(value.replace(',', '.')));

    let remap = KomoditiPraSubmit.map(dt => {
      if (dt.offer_commoditie_id === data.offer_commoditie_id) {
        return {
          offer_commoditie_id: data.offer_commoditie_id,
          sku: data.sku,
          qty: parseFloat(quantityCheck.replace(',', '.')),
        };
      } else {
        return dt;
      }
    });
    console.log('remap concat', remap);
    setKomoditiPraSubmit(remap);
    return quantityCheck;
  };
  return (
    <View style={styles.cardKomoditi}>
      <View style={[styles.item, {padding: 5}]}>
        <View style={styles.boxIcon}>
          {/* <BoxIcon width={30} height={30} /> */}
          <ImageProduct
            url={data?.commoditie_photo}
            style={[gStyles.dimension('100%', '100%'), {borderRadius: 40}]}
          />
        </View>
        <View style={styles.sku}>
          <Text style={gStyles.text(14, '500', '#313447')}>
            {data.commoditie_name}
          </Text>
          {data?.sku ? (
            <Text style={gStyles.text(12, '400', '#797B8A')}>{data.sku}</Text>
          ) : null}
        </View>
      </View>
      <View style={{padding: 10}}>
        {input ? (
          <>
            <Text style={gStyles.text(14, '400', '#313447')}>Kuantitas</Text>
            <View
              style={[
                styles.cardKomoditi,
                gStyles.row_center2,
                gStyles.text(14, '400', '#797B8A'),
                {
                  paddingBottom: 0,
                  paddingHorizontal: 10,
                  position: 'relative',
                  borderColor: IsError ? 'red' : 'lightgray',
                },
              ]}>
              {/* {InputQuantity} */}
              <DecimalInput
                value={displayValue}
                onChangeText={onChangeInput}
                onChangeDisplayText={setDisplayValue}
              />
              <Text
                style={[
                  gStyles.text(14, '400', '#797B8A'),
                  {
                    position: 'absolute',
                    right: 0,
                    backgroundColor: 'white',
                    paddingRight: 2,
                    width: 80,
                  },
                ]}>
                {data.unit === 'kg' ? 'Kilogram' : data.unit}
              </Text>
            </View>
            <View
              style={[
                gStyles.row_center2,
                {backgroundColor: '#EBF0FF', padding: 8, marginTop: 8},
              ]}>
              <Text style={gStyles.text(12, '400', '#797B8A')}>Dikirim</Text>
              <View style={gStyles.row}>
                <Text style={gStyles.text(14, '400', '#313447')}>
                  {Number.isNaN(Quantity) ? 0 : displayValue}{' '}
                </Text>
                {status !== 8 && (
                  <Text style={gStyles.text(12, '400', '#797B8A')}>
                    {' '}
                    {data.unit}{' '}
                  </Text>
                )}
                {status === 8 && (
                  <Text style={gStyles.text(12, '400', '#797B8A')}>
                    dari {delimiterFormat(data.total_quantity)} {data.unit}
                  </Text>
                )}
              </View>
            </View>
            {status >= 9 && pengirimanke > 1 && (
              <>
                <View
                  style={[
                    gStyles.row_center2,
                    {backgroundColor: '#F5F6F7', padding: 8, marginTop: 8},
                  ]}>
                  <Text style={gStyles.text(12, '400', '#797B8A')}>
                    Terkirim Sebelumnya
                  </Text>
                  <View style={gStyles.row}>
                    <Text style={gStyles.text(12, '400', '#797B8A')}>
                      {delimiterFormat(data.terkirim_sebelum)} dari{' '}
                      {delimiterFormat(data.total_quantity)} {data.unit}
                    </Text>
                  </View>
                </View>
                <View style={gStyles.row}>
                  <View
                    style={[
                      gStyles.row_center2,
                      {
                        backgroundColor: '#EBFFEB',
                        padding: 8,
                        marginTop: 8,
                        width: '60%',
                      },
                    ]}>
                    <Text style={gStyles.text(12, '400', '#797B8A')}>
                      Sudah diterima
                    </Text>
                    <View style={gStyles.row}>
                      <Text style={gStyles.text(12, '400', '#797B8A')}>
                        {data.diterima} kg
                      </Text>
                    </View>
                  </View>
                  <Button
                    style={{marginTop: 12, width: '35%'}}
                    paddingVertical={8}
                    onPress={() => showNote(data)}
                    title={
                      <View style={gStyles.row_center3}>
                        <IconNote />
                        <Text
                          style={[
                            {
                              marginLeft: 8,
                            },
                            gStyles.text(14, '500', '#2E3192'),
                          ]}>
                          Catatan
                        </Text>
                      </View>
                    }
                  />
                </View>
              </>
            )}
          </>
        ) : (
          <>
            <View
              style={[
                gStyles.row_center2,
                {backgroundColor: '#F5F6F7', padding: 8, marginTop: 8},
              ]}>
              <Text style={gStyles.text(12, '400', '#797B8A')}>
                Sudah diterima
              </Text>
              <View style={gStyles.row}>
                <Text style={gStyles.text(12, '400', '#313447')}>
                  {data.diterima}{' '}
                </Text>
                <Text style={gStyles.text(12, '400', '#313447')}>
                  dari {data.terkirim_sebelum} kg
                </Text>
              </View>
            </View>
            <Button
              style={{marginTop: 12}}
              paddingVertical={8}
              onPress={() => showNote(data)}
              title={
                <View style={gStyles.row_center3}>
                  <IconNote />
                  <Text
                    style={[
                      {
                        marginLeft: 8,
                      },
                      gStyles.text(14, '500', '#2E3192'),
                    ]}>
                    Catatan
                  </Text>
                </View>
              }
            />
          </>
        )}
      </View>
    </View>
  );
};

export default ItemKirim;
