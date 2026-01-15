import {View, Text} from 'react-native';
import React from 'react';
import {gStyles} from '../../../../../utils/styles';
import styles from '../../../Penawaran/styles';
import {BoxIcon} from '../../../../../assets';
import {ImageProduct} from '../../../../../components/atoms/Product';

const CatatanPopup = ({data}) => {
  console.log('CatatanPopup', data.detail);
  return (
    <View
      style={[
        gStyles.col,
        styles.cardNoBorder,
        styles.cardSpace,
        {paddingBottom: 30},
      ]}>
      <View style={[styles.item, {padding: 5}]}>
        <View style={gStyles.boxIcon}>
          {/* <BoxIcon width={30} height={30} /> */}
          <ImageProduct
            url={
              data?.detail?.photo ??
              data?.detail?.commoditie_photo ??
              data?.detail?.commodities_photo
            }
            style={[gStyles.dimension('100%', '100%'), {borderRadius: 40}]}
          />
        </View>
        <View style={styles.sku}>
          <Text style={gStyles.text(14, '500', '#313447')}>{data.name}</Text>
          {data?.sku ? (
            <Text style={gStyles.text(12, '400', '#797B8A')}>{data.sku}</Text>
          ) : null}
        </View>
      </View>
      <View style={gStyles.row_center}>
        <View
          style={[
            gStyles.col,
            {
              backgroundColor: '#F5F6F7',
              padding: 8,
              marginTop: 8,
              width: '100%',
            },
          ]}>
          {data?.note && data?.note?.length ? (
            <>
              <Text style={gStyles.text(14, '700', '#313447')}>
                Penerimaan {data.shipping_number}
              </Text>
              {data.note.map(note => (
                <View style={[gStyles.col, {marginVertical: 6}]}>
                  <Text
                    style={[
                      gStyles.text(14, '400', '#797B8A'),
                      {lineHeight: 22},
                    ]}>
                    {note.quality_characteric_name}
                  </Text>
                  <Text
                    style={[
                      gStyles.text(14, '400', '#313447'),
                      {lineHeight: 22},
                    ]}>
                    {note.note}
                  </Text>
                </View>
              ))}
              <View
                style={[
                  gStyles.row_center2,
                  {
                    backgroundColor: '#fff',
                    padding: 8,
                    marginTop: 8,
                    width: '100%',
                  },
                ]}>
                <Text style={gStyles.text(12, '400', '#797B8A')}>
                  Sudah diterima
                </Text>
                <View style={gStyles.row}>
                  <Text style={gStyles.text(12, '400', '#797B8A')}>
                    {data.received_quantity} kg
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <Text
              style={[
                gStyles.text(14, '400', '#797B8A'),
                {lineHeight: 20, marginVertical: 10, textAlign: 'center'},
              ]}>
              Tidak ada catatan
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default CatatanPopup;
