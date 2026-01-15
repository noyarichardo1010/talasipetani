import {View, Text, TouchableOpacity} from 'react-native';
import React, {useCallback, useState} from 'react';
import styles from '../../../Penawaran/styles';
import {gStyles} from '../../../../../utils/styles';
import {
  ArchiveBook,
  BoxIcon,
  ErrorWarningFill,
  IconCoupon,
  IconCouponInvert,
  IconDownArrow,
  IconEdit,
  IconDiscount,
  IconRightLine,
} from '../../../../../assets';
import {color} from 'react-native-reanimated';
import {GradeItem} from '../../../../../components';
import {
  NumberFormatter,
  delimiterFormat,
} from '../../../../../utils/helpers/number';
import {format_tanggal_indo} from '../../../../../utils/helpers/date';
import {ImageProduct} from '../../../../../components/atoms/Product';
import {getGradeStyle} from '../../../../../utils/helpers/text';

const Komoditi = ({note = false, status, komoditi, index}) => {
  const [riwayatShown, setRiwayatShown] = useState(true);
  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);

  const onTextLayout = useCallback(e => {
    setLengthMore(e.nativeEvent.lines.length >= 2);
  }, []);
  // console.log('komoditiii', komoditi);
  // console.log('index', index);
  // console.log(
  //   'log_price_commoditie_offer',
  //   komoditi.log_price_commoditie_offer.length,
  //   komoditi.log_price_commoditie_offer,
  // );

  return (
    <View style={styles.cardKomoditi}>
      {komoditi?.special_price > 0 ? (
        <View style={styles.badgeVoucher}>
          <IconCoupon width={17} height={17} />
          <Text style={gStyles.text(12, '500', 'white')}>Harga Khusus</Text>
          <View style={styles.triangleCorner} />
        </View>
      ) : null}
      <View style={[styles.item, {padding: 5}]}>
        <View style={styles.boxIcon}>
          {/* <BoxIcon width={35} height={35} /> */}
          <ImageProduct
            url={komoditi?.commoditie_photos}
            style={[gStyles.dimension('100%', '100%'), {borderRadius: 40}]}
          />
        </View>
        <View style={styles.sku}>
          <Text style={[gStyles.text(14, '500', '#313447')]}>
            {komoditi.commoditie_name}
          </Text>
          {komoditi.commoditie_or_variant_sku &&
          komoditi.commoditie_or_variant_sku !== '' ? (
            <Text style={gStyles.text(12, '400', '#797B8A')}>
              ( {komoditi?.commoditie_or_variant_sku} )
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.detailSku}>
        <View style={gStyles.row_center2}>
          <Text style={[gStyles.text(14, '400', '#797B8A'), {lineHeight: 30}]}>
            Grade
          </Text>
          <View
            style={{
              position: 'absolute',
              right: 0,
            }}>
            <GradeItem
              grade={komoditi.grade_name}
              gradeColor={`${getGradeStyle(index)}`}
            />
          </View>
        </View>
        <View style={gStyles.row_center2}>
          <Text style={[gStyles.text(14, '400', '#797B8A'), {lineHeight: 30}]}>
            Harga per Satuan
          </Text>
          <Text style={gStyles.text(14, '400', '#313447')}>
            {komoditi.special_price > 0 ||
            (komoditi.unit_price_bid_correction > 0 &&
              komoditi.unit_price_bid_correction !== komoditi.unit_price) ? (
              <>
                <Text
                  style={[
                    gStyles.text(12, '400', '#797B8A'),
                    {
                      textDecorationLine: 'line-through',
                      textDecorationStyle: 'solid',
                    },
                  ]}>
                  Rp.{' '}
                  {/* komoditi.special_price > 0 &&
                      komoditi.special_price > komoditi.unit_price
                      ? komoditi.special_price
                      : komoditi.unit_price_bid_correction > 0 &&
                        komoditi.unit_price ===
                          komoditi.unit_price_bid_correction
                      ? komoditi?.unit_price_bid_correction
                      : komoditi.unit_price, */}
                  {delimiterFormat(
                    komoditi.special_price > 0 &&
                      komoditi.unit_price_bid_correction < 0 //jika ada special_price dan belum dikoreksi harga
                      ? komoditi.special_price //tampilkan special_price
                      : komoditi.unit_price_bid_correction > 0 && //jika sudah ada koreksi harga
                        komoditi.special_price > 0 //dan ada spesial price
                      ? komoditi?.special_price //tampilkan spesial price
                      : komoditi.unit_price, //jika tidak ada tampilkan harga awal
                    'Rp. ',
                  )}{' '}
                </Text>
                {/* jika ada koreksi harga, ambil yang koreksi harga, jika tidak ambil yang special_Price */}
                {' Rp. '}
                {delimiterFormat(
                  komoditi.unit_price_bid_correction > 0
                    ? komoditi.unit_price_bid_correction
                    : komoditi.special_price,
                )}
              </>
            ) : (
              delimiterFormat(komoditi.unit_price)
            )}
          </Text>
        </View>
        <View style={gStyles.row_center2}>
          <Text style={[gStyles.text(14, '400', '#797B8A'), {lineHeight: 30}]}>
            Kuantitas
          </Text>
          <Text style={gStyles.text(14, '400', '#313447')}>
            {delimiterFormat(komoditi.quantity)}
            <Text> {komoditi.unit}</Text>
          </Text>
        </View>
        <View style={styles.dashed} />
        <View style={gStyles.row}>
          <Text style={[gStyles.text(14, '400', '#797B8A'), {lineHeight: 25}]}>
            Sub Total
          </Text>
          <Text style={gStyles.text(14, '400', '#313447')}>
            {/* {komoditi.total_price_bid_correction > 0 &&
            komoditi.total_price_bid_correction !== komoditi.total_price ? (
              <>
                <Text
                  style={[
                    gStyles.text(12, '400', '#797B8A'),
                    {
                      textDecorationLine: 'line-through',
                      textDecorationStyle: 'solid',
                    },
                  ]}>
                  {delimiterFormat(komoditi.total_price)}{' '}
                </Text>
                {delimiterFormat(komoditi.total_price_bid_correction, ' Rp. ')}
              </>
            ) : (
              delimiterFormat(komoditi.total_price)
            )} */}
            {/* ini kode yang sesuai untuk status survey */}
            {komoditi.unit_price_bid_correction !== 0 ||
            komoditi.special_price !== 0 ? ( //jika ada koreksi harga atau ada harga khusus, masuk kesini
              <Text
                style={[
                  gStyles.text(12, '400', '#797B8A'),
                  {
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                  },
                ]}>
                Rp.{' '}
                {komoditi?.special_price !== 0 &&
                komoditi?.unit_price_bid_correction === 0 //harga khususnya ada, tapi belum dikoreksi
                  ? delimiterFormat(komoditi.quantity * komoditi.unit_price) //coret sub total harga khusus
                  : komoditi?.special_price !== 0 &&
                    komoditi?.unit_price_bid_correction !== 0 //harga khususnya ada dan sudah dikoreksi
                  ? delimiterFormat(komoditi.quantity * komoditi.special_price)
                  : komoditi?.special_price === 0 &&
                    komoditi?.unit_price_bid_correction !== 0
                  ? delimiterFormat(komoditi.quantity * komoditi.unit_price)
                  : delimiterFormat(komoditi.sub_total)}
              </Text>
            ) : null}{' '}
            Rp.{' '}
            {(komoditi.unit_price_bid_correction !== 0 ||
              komoditi.special_price !== 0) &&
            komoditi?.final_price !== 0 //kalo ada bid correction atau ada harga khusus atau diskon
              ? delimiterFormat(
                  komoditi?.total_price_bid_correction ?? komoditi?.final_price,
                )
              : delimiterFormat(komoditi?.sub_total)}
          </Text>
        </View>
      </View>
      {komoditi.log_price_commoditie_offer.length > 0 && (
        <View style={styles.cardRiwayat}>
          <View>
            <TouchableOpacity
              onPress={() => setRiwayatShown(!riwayatShown)}
              style={[gStyles.row_center2, {width: '100%'}]}>
              <View style={[gStyles.row_center2, {width: 120}]}>
                <ArchiveBook width={20} height={20} />
                <Text style={gStyles.text(14, '400', '#313447')}>
                  Riwayat Harga
                </Text>
              </View>
              <IconDownArrow />
            </TouchableOpacity>
            {riwayatShown && (
              <View style={styles.riwayatDetail}>
                {komoditi.log_price_commoditie_offer.map(logprice => (
                  <View
                    style={[
                      gStyles.line('#797B8A', 0.3),
                      gStyles.paddingVertical(10),
                      // eslint-disable-next-line react-native/no-inline-styles
                      {
                        opacity: komoditi.log_price_commoditie_offer.some(
                          item => item.type === 'discount_price',
                        ) //jika true, maka cek lagi
                          ? logprice.type === 'discount_price'
                            ? 1
                            : 0.4
                          : 1,
                      },
                    ]}>
                    {/* {console.log('logprice', logprice)} */}
                    <View style={gStyles.row_center2}>
                      <View
                        style={[
                          logprice.type === 'special_price'
                            ? styles.coupon
                            : logprice.type === 'discount_price'
                            ? styles.discount
                            : styles.koreksi,
                          gStyles.row_center2,
                          {
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                          },
                        ]}>
                        {logprice.type === 'special_price' ? (
                          <IconCouponInvert width={20} height={20} />
                        ) : logprice.type === 'discount_price' ? (
                          <IconDiscount width={20} height={20} fill="#D80909" />
                        ) : (
                          <IconEdit width={20} height={20} fill={'#2E3192'} />
                        )}

                        <Text
                          style={[
                            gStyles.text(14, '500', '#797B8A'),
                            {
                              color:
                                logprice.type === 'special_price'
                                  ? '#FF9100'
                                  : logprice.type === 'discount_price'
                                  ? '#D80909'
                                  : '#2E3192',
                            },
                          ]}>
                          {logprice.type === 'special_price'
                            ? 'Harga Khusus'
                            : logprice.type === 'discount_price'
                            ? 'Harga Diskon'
                            : 'Koreksi Harga'}
                        </Text>
                      </View>
                      <Text style={gStyles.text(12, '400', '#797B8A')}>
                        {format_tanggal_indo(new Date(logprice.created_at))}
                      </Text>
                    </View>
                    <View style={[gStyles.row_center3, styles.riwayatHarga]}>
                      <Text style={gStyles.text(14, '400', '#797B8A')}>
                        {/* {delimiterFormat(komoditi.unit_price)} */}
                        Rp.
                        {delimiterFormat(
                          logprice.type === 'special_price'
                            ? komoditi.unit_price
                            : logprice.type === 'discount_price'
                            ? komoditi.sub_total
                            : komoditi.special_price > 0
                            ? komoditi.special_price
                            : komoditi.unit_price,
                        )}
                      </Text>
                      {logprice.type === 'discount_price' && (
                        <Text style={gStyles.text(14, '400', '#797B8A')}>
                          {'Rp. '}- {delimiterFormat(logprice.price)} =
                        </Text>
                      )}
                      {/* <Text style={gStyles.text(12, '400', '#797B8A')}>
                        {'  --->  '}
                      </Text> */}
                      {logprice.type === 'discount_price' ? null : (
                        <>
                          <IconRightLine
                            fill="#93959E"
                            width={20}
                            height={20}
                            style={gStyles.marginHorizontal(8)}
                          />
                          <Text style={gStyles.text(14, '400', '#313447')}>
                            Rp.
                            {delimiterFormat(
                              logprice.type === 'special_price'
                                ? komoditi.special_price
                                : logprice.type === 'discount_price'
                                ? komoditi.sub_total - logprice.price
                                : komoditi.unit_price_bid_correction,
                            )}
                          </Text>
                        </>
                      )}
                    </View>
                    {logprice.type === 'discount_price' ? (
                      <Text style={gStyles.text(14, '500', '#313447')}>
                        Rp.{' '}
                        {delimiterFormat(komoditi.sub_total - logprice.price)}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}
      {status === 4 && komoditi.unit_price_bid_correction > 0 && (
        <View style={[styles.cardRiwayat, {backgroundColor: '#FFF6EB'}]}>
          <View style={[gStyles.row_center, {width: 195}]}>
            <ErrorWarningFill width={20} height={20} />
            <Text style={gStyles.text(14, '400', '#313447')}>
              Harga Yang Perlu Disetujui
            </Text>
          </View>
          <View style={styles.riwayatDetail}>
            <View style={gStyles.row_center2}>
              <Text style={gStyles.text(12, '400', '#797B8A')}>
                Koreksi Harga per satuan
              </Text>
            </View>
            <View style={[gStyles.row, styles.riwayatHarga]}>
              <Text style={gStyles.text(14, '400', '#797B8A')}>
                Rp.
                {komoditi?.special_price && komoditi?.special_price > 0
                  ? delimiterFormat(komoditi.special_price)
                  : delimiterFormat(komoditi.unit_price)}
              </Text>
              <IconRightLine
                fill="#93959E"
                width={20}
                height={20}
                style={gStyles.marginHorizontal(8)}
              />
              <Text style={gStyles.text(14, '400', '#313447')}>
                {delimiterFormat(komoditi.unit_price_bid_correction)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {komoditi.note !== '' && (
        <View style={styles.cardRiwayat}>
          {komoditi.note !== '' && (
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
                  {komoditi.note}
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
    </View>
  );
};

export default Komoditi;
