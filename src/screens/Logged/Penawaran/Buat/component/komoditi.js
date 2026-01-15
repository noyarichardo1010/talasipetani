import {View, Text, TouchableOpacity} from 'react-native';
import React, {useCallback, useState} from 'react';
import {gStyles} from '../../../../../utils/styles';
import {
  BoxBgIcon,
  BoxIcon,
  IconAdd,
  IconCoupon,
  IconEdit,
  IconTrash,
} from '../../../../../assets';
import {Button, GradeItem} from '../../../../../components';
import styles from '../../styles';
import {
  NumberFormatter,
  delimiterFormat,
} from '../../../../../utils/helpers/number';
import {ImageProduct} from '../../../../../components/atoms/Product';
import {getGradeStyle} from '../../../../../utils/helpers/text';
import {assignBooleanValue} from '../../../../../utils/helpers/array';

const Komoditi = ({
  setBottomPanelPopup,
  SelectedKomoditi,
  setSelectedKomoditi,
  reData,
  SelectedKupon,
}) => {
  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);

  const onTextLayout = useCallback(e => {
    setLengthMore(e.nativeEvent.lines.length >= 2);
  }, []);
  const showKomoditi = () => {
    if (!reData) {
      setBottomPanelPopup({
        show: true,
        data: null,
        // title: 'Pilih Lokasi Warehouse Hub',
        type: 'full',
        content: 'komoditi',
      });
    }
  };
  {
    // console.log('SelectedKomoditiiii', SelectedKomoditi);
    // console.log('SelectedKupon', SelectedKupon);
  }
  return (
    <>
      <Text style={gStyles.text(16, '500', '#313447')}>Komoditi</Text>
      {SelectedKomoditi.length === 0 ? (
        <View style={gStyles.col_2}>
          <BoxBgIcon />
          <Text
            style={[
              gStyles.text(14, '700', '#313447'),
              {lineHeight: 25, marginTop: 10},
            ]}>
            Belum ada komoditi
          </Text>
          <Text style={gStyles.text(14, '400', '#797B8A')}>
            Tambahkan komoditi melalui tombol di bawah.
          </Text>
          <Button
            style={{marginVertical: 10, marginTop: 20}}
            onPress={() => showKomoditi()}
            title={
              <View style={gStyles.row_center}>
                <IconAdd />
                <Text
                  style={[
                    {lineHeight: 20, marginLeft: 8},
                    gStyles.text(14, '500', '#2E3192'),
                  ]}>
                  Tambah komoditi
                </Text>
              </View>
            }
          />
        </View>
      ) : (
        <View style={[gStyles.col, {marginTop: 15}]}>
          {SelectedKomoditi.map((data, i) => (
            <View key={i} style={styles.card}>
              {/* {console.log('data uat penawaran', data)} */}
              {data?.has_special_price ? (
                <View style={styles.badgeVoucher}>
                  <IconCoupon width={17} height={17} />
                  <Text style={gStyles.text(12, '500', 'white')}>
                    Harga Khusus
                  </Text>
                  <View style={styles.triangleCorner} />
                </View>
              ) : null}
              <View style={[gStyles.row_center3, {marginBottom: 10}]}>
                <View style={[gStyles.boxIcon, {marginRight: 12}]}>
                  {/* {console.log('data komoditi', data)} */}
                  <ImageProduct
                    url={data?.commoditie_photo ?? data?.commoditie_photos}
                    style={[
                      gStyles.dimension('100%', '100%'),
                      {borderRadius: 40},
                    ]}
                  />
                </View>
                <View style={styles.sku}>
                  <Text
                    style={[
                      gStyles.text(14, '500', '#313447'),
                      {width: '100%', maxWidth: '100%'},
                    ]}>
                    {data.name ??
                      data.commoditie_name + data.commoditie_variant_name}
                  </Text>
                  {data?.sku ? (
                    <Text style={gStyles.text(12, '400', '#797B8A')}>
                      ( {data.sku} )
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.detailSku}>
                <View style={gStyles.row}>
                  <Text
                    style={[
                      gStyles.text(14, '400', '#797B8A'),
                      gStyles.flex(1),
                      {lineHeight: 30},
                    ]}>
                    Grade
                  </Text>
                  <View
                    style={{
                      position: 'absolute',
                      right: 0,
                    }}>
                    <GradeItem
                      grade={data.grade_name}
                      gradeColor={getGradeStyle(i)}
                    />
                  </View>
                </View>
                <View style={gStyles.row}>
                  <Text
                    style={[
                      gStyles.text(14, '400', '#797B8A'),
                      {lineHeight: 30},
                    ]}>
                    Harga per Satuan
                  </Text>
                  {data?.has_special_price ? (
                    <Text
                      style={[
                        gStyles.text(12, '400', '#797B8A'),
                        {
                          textDecorationLine: 'line-through',
                          textDecorationStyle: 'solid',
                        },
                      ]}>
                      {delimiterFormat(data.unit_price, 'Rp. ')}
                    </Text>
                  ) : (
                    <Text style={gStyles.text(14, '400', '#313447')}>
                      Rp. {delimiterFormat(data.unit_price)}
                    </Text>
                  )}
                </View>
                {data?.has_special_price ? (
                  <View style={gStyles.row}>
                    <Text
                      style={[
                        gStyles.text(14, '500', '#797B8A'),
                        {lineHeight: 30},
                      ]}>
                      Harga Khusus
                    </Text>
                    <Text style={gStyles.text(14, '500', '#07bc0c')}>
                      Rp. {delimiterFormat(data.special_price)}
                    </Text>
                  </View>
                ) : null}

                <View style={gStyles.row}>
                  <Text
                    style={[
                      gStyles.text(14, '400', '#797B8A'),
                      {lineHeight: 30},
                    ]}>
                    Kuantitas
                  </Text>
                  <Text style={gStyles.text(14, '400', '#313447')}>
                    {delimiterFormat(data.quantity)}
                    <Text> {data.unit}</Text>
                  </Text>
                </View>
                <View style={styles.dashed} />
                <View style={gStyles.row}>
                  <Text
                    style={[
                      gStyles.text(14, '400', '#797B8A'),
                      {lineHeight: 30},
                    ]}>
                    Sub Total
                  </Text>
                  <Text style={gStyles.text(14, '400', '#313447')}>
                    Rp.{' '}
                    {reData?.reApply
                      ? delimiterFormat(
                          data?.has_special_price
                            ? data?.quantity * data?.special_price
                            : data?.quantity * data?.unit_price,
                        )
                      : delimiterFormat(
                          data?.has_special_price
                            ? data?.quantity * data?.special_price
                            : data?.quantity * data?.unit_price,
                        )}
                  </Text>
                </View>
              </View>
              {data.note !== '' && (
                <View style={styles.cardRiwayat}>
                  {data.note !== '' && (
                    <View style={gStyles.col}>
                      {/* Catatan */}
                      <Text
                        style={[
                          gStyles.text(14, '600', '#313447'),
                          {paddingVertical: 4},
                        ]}>
                        Catatan
                      </Text>
                      <View>
                        <Text
                          onTextLayout={onTextLayout}
                          numberOfLines={textShown ? undefined : 2}
                          style={[
                            gStyles.text(14, '400', '#313447'),
                            {lineHeight: 20, marginVertical: 4},
                          ]}>
                          {data.note}
                        </Text>
                        {lengthMore && (
                          <Text
                            onPress={() => setTextShown(!textShown)}
                            style={gStyles.text(14, '700', '#5C73BD')}>
                            {textShown ? 'Lihat Ringkas' : 'Lihat selengkapnya'}
                          </Text>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              )}
              {reData?.reApply === true ? null : (
                <View style={gStyles.row_center}>
                  <TouchableOpacity
                    style={{
                      padding: 5,
                      width: '45%',
                      borderRadius: 4,
                      backgroundColor: '#F5F6F7',
                    }}
                    disabled={reData}
                    onPress={() => {
                      if (!reData) {
                        console.log('redata', reData);
                        //check apakah ada kupon harga khusus
                        console.log('SelectedKupon', SelectedKupon);
                        if (SelectedKupon) {
                          let komoditiWithKupon =
                            SelectedKupon?.commoditie_detail?.map(
                              kmdt =>
                                kmdt?.commoditie_id === data?.commoditie_id,
                            );

                          komoditiWithKupon =
                            assignBooleanValue(komoditiWithKupon);

                          if (komoditiWithKupon) {
                            setBottomPanelPopup({
                              show: true,
                              data: data,
                              // title: 'Pilih Lokasi Warehouse Hub',
                              type: 'auto',
                              content: 'komoditiWithKuponDelete',
                            });
                            // setShowAlertChangeKomoditi(true);
                          } else {
                            setBottomPanelPopup({
                              show: true,
                              data: data,
                              // title: 'Pilih Lokasi Warehouse Hub',
                              type: 'auto',
                              content: 'komoditiDelete',
                            });
                          }
                        } else {
                          setBottomPanelPopup({
                            show: true,
                            data: data,
                            // title: 'Pilih Lokasi Warehouse Hub',
                            type: 'auto',
                            content: 'komoditiDelete',
                          });
                        }
                      }
                    }}>
                    <View style={[gStyles.row_center4]}>
                      <IconTrash fill={'black'} />
                      <Text
                        style={[
                          {
                            lineHeight: 20,
                            marginLeft: 8,
                          },
                          gStyles.text(12, '500', 'black'),
                        ]}>
                        Hapus
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      borderColor: reData ? 'transparent' : '#2E3192',
                      backgroundColor: reData ? '#F5F6F7' : 'white',
                      borderWidth: 1,
                      padding: 5,
                      width: '45%',
                      borderRadius: 4,
                    }}
                    disabled={reData}
                    onPress={() => {
                      let editData = SelectedKomoditi.find(
                        dataAll => dataAll._id === data._id,
                      );
                      if (!reData) {
                        setBottomPanelPopup({
                          show: true,
                          data: editData,
                          // title: 'Pilih Lokasi Warehouse Hub',
                          type: 'full',
                          content: 'KomoditiList',
                        });
                      }
                    }}>
                    <View style={[gStyles.row_center4]}>
                      <IconEdit fill={reData ? 'black' : '#2E3192'} />
                      <Text
                        style={[
                          {
                            lineHeight: 20,
                            marginLeft: 8,
                          },
                          gStyles.text(12, '500', reData ? 'black' : '#2E3192'),
                        ]}>
                        Ubah
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
          {reData?.reApply ? null : (
            <Button
              onPress={() => showKomoditi()}
              isDisabled={reData}
              style={{
                borderColor: reData ? 'transparent' : '#2E3192',
                backgroundColor: reData ? '#F5F6F7' : 'white',
              }}
              title={
                <View style={gStyles.row_center}>
                  <IconAdd />
                  <Text
                    style={[
                      {lineHeight: 20, marginLeft: 8},
                      gStyles.text(14, '500', reData ? 'black' : '#2E3192'),
                    ]}>
                    Tambah komoditi
                  </Text>
                </View>
              }
            />
          )}
        </View>
      )}
    </>
  );
};

export default Komoditi;
