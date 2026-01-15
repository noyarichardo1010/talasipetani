import {View, Text} from 'react-native';
import React from 'react';
import {gStyles} from '../../../../../utils/styles';
import {IconInfo, IconNote, IconPengirimian} from '../../../../../assets';
import styles from '../../../Penawaran/styles';
import ShipingItem from '../../AturPengiriman/component/itemKirim';
import {
  convertDayToWeek,
  findMonthName,
} from '../../../../../utils/helpers/date';
import {BadgeStatus, Button} from '../../../../../components';
import {ImageProduct} from '../../../../../components/atoms/Product';
import {
  NumberFormatter,
  formatNumberWithComma,
} from '../../../../../utils/helpers/number';

const Pengiriman = ({
  status,
  showCatatan,
  DataOffer,
  DataShipping,
  isLoadingShipping,
  Toleransi,
}) => {
  console.log('DataShipping', DataShipping);
  return (
    <>
      <View style={[gStyles.row_2, styles.infoPengiriman]}>
        <IconPengirimian />
        <Text style={{paddingLeft: 8, color: '#2E3192'}}>
          Pengiriman barang dilakukan oleh Petani.
        </Text>
      </View>
      <View style={[gStyles.col]}>
        <View style={[gStyles.row]}>
          <View style={gStyles.row}>
            <Text
              style={[gStyles.text(14, '400', '#797B8A'), {marginRight: 5}]}>
              Jadwal Pengiriman
            </Text>
            <IconInfo height={20} width={20} fill="#93959E" />
          </View>
          <View style={gStyles.row}>
            <Text
              style={[gStyles.text(14, '400', '#313447'), {marginRight: 5}]}>
              {findMonthName(DataOffer.shipping_month)}{' '}
              {DataOffer.shipping_year}
            </Text>
            <Text
              style={[gStyles.text(14, '400', '#797B8A'), {marginRight: 5}]}>
              (Minggu ke {DataOffer.shipping_week})
            </Text>
          </View>
        </View>
        {Toleransi?.lewat > 0 && (
          <View
            style={[gStyles.row, {justifyContent: 'flex-end', marginTop: 4}]}>
            <IconInfo height={20} width={20} fill="#fc0303" />
            <Text
              style={[
                gStyles.text(14, '400', 'red'),
                {marginHorizontal: 5, justifySelf: 'end'},
              ]}>
              Sudah lewat {convertDayToWeek(Toleransi.lewat)}{' '}
              {convertDayToWeek(Toleransi.lewat, true)}
            </Text>
          </View>
        )}
      </View>
      {status >= 9 && DataShipping?.length > 0 && !isLoadingShipping && (
        <>
          {DataShipping?.map((shiping, i) => (
            <View
              style={[styles.cardNoBorder, styles.cardKomoditi]}
              key={'shipping' + i}>
              <View style={gStyles.row}>
                <Text style={gStyles.text(16, '700', '#313447')}>
                  Pengiriman {shiping.shipping_number}
                </Text>
                <BadgeStatus status={shiping.status} />
              </View>
              {shiping?.detail?.map(detail => (
                <View
                  style={{
                    borderTopWidth: 1,
                    borderColor: '#E3E3E5',
                    paddingTop: 12,
                    marginTop: 12,
                  }}
                  // key={j}
                >
                  {console.log('detail', detail)}
                  <View style={[styles.item, {padding: 5}]}>
                    <View style={styles.boxIcon}>
                      {/* <BoxIcon width={30} height={30} /> */}
                      <ImageProduct
                        url={detail?.photo}
                        style={[
                          gStyles.dimension('100%', '100%'),
                          {borderRadius: 40},
                        ]}
                      />
                    </View>
                    <View style={styles.sku}>
                      <Text style={gStyles.text(14, '500', '#313447')}>
                        {detail?.commoditie_name ?? 'Nama Komoditi'} -{' '}
                        {detail?.variant_name ?? 'Variant'}
                      </Text>
                      {detail?.sku ? (
                        <Text style={gStyles.text(12, '400', '#797B8A')}>
                          ( {detail?.sku} )
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={gStyles.col}>
                    <View
                      style={[
                        gStyles.row_center2,
                        {
                          backgroundColor: '#F5F6F7',
                          padding: 8,
                          marginTop: 8,
                          // width: '100%',
                        },
                      ]}>
                      <Text style={gStyles.text(12, '400', '#797B8A')}>
                        Sudah diterima
                      </Text>
                      <View style={gStyles.row}>
                        <View style={gStyles.row}>
                          <Text style={gStyles.text(12, '400', '#313447')}>
                            {formatNumberWithComma(detail.received_quantity)}{' '}
                          </Text>
                          <Text style={gStyles.text(12, '400', '#797B8A')}>
                            dari{' '}
                            {formatNumberWithComma(detail.shipped_quantity)} kg
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Button
                      style={{marginTop: 12}}
                      paddingVertical={8}
                      onPress={() =>
                        showCatatan({
                          detail: detail,
                          name: detail.commoditie_name,
                          sku: detail.sku,
                          shipped_quantity: detail.shipped_quantity,
                          received_quantity: detail.received_quantity,
                          note: detail.note,
                          shipping_number: DataShipping[i].shipping_number,
                        })
                      }
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
                </View>
              ))}
              {/* ))} */}
            </View>
          ))}
        </>
      )}
    </>
  );
};

export default Pengiriman;
