import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {useSelector} from 'react-redux';
import {Box, IconDot} from '../../../../assets';
import {gStyles} from '../../../../utils/styles';
import {delimiterFormat} from '../../../../utils/helpers/number';
import {format_tanggal_indo} from '../../../../utils/helpers/date';
import BadgeStatus from '../../itemComponent/status';
import {ImageProduct} from '../../../atoms/Product';
import CheckBox from '@react-native-community/checkbox';

const CardTransaksi = ({
  onPress = () => Alert.alert('prress'),
  products,
  no,
  date,
  totalPrice,
  status,
  isCart = false,
  isCartSelected = false,
  id = null,
  selectOffer = () => Alert.alert('Pilih Penawaran'),
}) => {
  const {theme} = useSelector(reducer => reducer.global);
  const CardBody = ({data, name, qty, price, unit}) => {
    // console.log('CardBody', data);
    return (
      <View style={styles.cardBodyWrapper}>
        <View style={styles.boxWrapper}>
          {/* <Image source={Box} style={gStyles.dimension(32, 32)} /> */}
          <ImageProduct
            url={data?.commoditie_photos}
            style={[gStyles.dimension('100%', '100%'), {borderRadius: 40}]}
          />
        </View>
        <View style={styles.cardBodyContent}>
          <Text style={gStyles.text(14, '500', theme.textColor)}>{name}</Text>
          <View style={gStyles.row_2}>
            <Text style={[gStyles.text(14, '400', theme.textColor)]}>
              {`${qty} ${unit}`}
            </Text>

            <View
              style={[gStyles.flexCenter('row'), gStyles.marginHorizontal(6)]}>
              <IconDot fill="#93959E" width={5} height={5} />
            </View>

            <Text style={[gStyles.text(14, '400', theme.textColor)]}>
              Rp {delimiterFormat(price)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          styles.container,
          {
            borderColor: isCartSelected ? '#2A378E' : '#E3E3E5',
          },
        ]}>
        {/* card header */}
        <View style={styles.cardHeaderWrapper}>
          <View>
            <View>
              <Text style={gStyles.text(12, '500', '#797B8A')}>{no}</Text>
            </View>
            <Text style={gStyles.text(12, '400', '#797B8A')}>
              {format_tanggal_indo(new Date(date))}
            </Text>
          </View>
          {isCart === true ? (
            <TouchableOpacity
              onPress={() => {
                selectOffer(id, !isCartSelected);
              }}>
              <CheckBox
                disabled={false}
                value={isCartSelected}
                tintColors={{true: '#2A378E', false: '#d4d4d4'}}
                onValueChange={newValue => selectOffer(id, newValue)}
              />
            </TouchableOpacity>
          ) : (
            <BadgeStatus status={status} />
          )}
        </View>
        {/* card body */}
        <View onStartShouldSetResponder={() => true}>
          <ScrollView
            style={styles.cardBody}
            showsHorizontalScrollIndicator={false}
            horizontal>
            <TouchableOpacity style={gStyles.row_2} onPress={onPress}>
              {products?.map((product, i) => (
                <CardBody
                  key={i}
                  data={product}
                  name={product.commoditie_name}
                  qty={delimiterFormat(product.quantity)}
                  price={
                    product.total_price_bid_correction !==
                      product.total_price &&
                    product.total_price_bid_correction !== 0
                      ? product.total_price_bid_correction
                      : product.total_price
                  }
                  unit={product.unit}
                />
              ))}
            </TouchableOpacity>
          </ScrollView>
        </View>
        {/* card footer */}
        <View style={styles.cardFooterWrapper}>
          <View style={gStyles.col}>
            <Text style={gStyles.text(14, '400', '#797B8A')}>
              Total Penawaran
            </Text>
          </View>
          <View style={gStyles.flexCenter('row')}>
            <Text style={[gStyles.text(14, '500', theme.textColor)]}>
              Rp {delimiterFormat(totalPrice)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CardTransaksi;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E3E3E5',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    maxWidth: '100%',
    maxHeight: 175,
  },
  cardHeaderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomColor: '#E3E3E5',
    borderBottomWidth: 1,
  },
  cardBody: {
    display: 'flex',
    marginVertical: 12,
  },
  cardBodyWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: 16,
  },
  boxWrapper: {
    width: 48,
    height: 48,
    borderRadius: 40,
    backgroundColor: '#F5F6F7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cardBodyContent: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  cardFooterWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopColor: '#E3E3E5',
    borderTopWidth: 1,
  },
});
