import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';

import {useSelector} from 'react-redux';
import {gStyles} from '../../../utils/styles';
import {Box, IconHouse} from '../../../assets';
import {PriceInfo} from '../../atoms';
import {ImageProduct} from '../../atoms/Product';

const CardHargaKomoditi = ({
  onPress = () => Alert.alert('prress'),
  warehouseName = 'Warehouse Hub Name',
  name = 'Nama',
  prices,
  data,
  style = {},
}) => {
  const {theme} = useSelector(reducer => reducer.global);

  const getUpOrDownPrice = (previousPrice, currentPrice) => {
    if (previousPrice < currentPrice) {
      return 'up';
    } else if (previousPrice > currentPrice) {
      return 'down';
    } else {
      return 'no';
    }
  };
  // console.log('data', data);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.container, style]}>
        {/* card header */}
        <View style={styles.cardHeaderWrapper}>
          <IconHouse width={16} height={16} fill="#2E3192" />
          <Text
            style={[gStyles.text(12, '500', '#2E3192'), gStyles.marginLeft(4)]}>
            {warehouseName}
          </Text>
        </View>
        {/* card body */}
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
          </View>
        </View>
        {/* card footer/prices */}
        <View style={gStyles.marginTop(12)}>
          {prices?.map((price, i) => (
            <PriceInfo
              key={i}
              length={prices.length}
              index={i}
              grade={price.grade_name}
              price={price.current_price}
              perQty={price.unit}
              sku={price.sku}
              upOrDown={price.label_color}
              // upOrDown={getUpOrDownPrice(
              //   price.previous_price,
              //   price.current_price,
              // )}
              howMuch={price.difference_price}
            />
          ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CardHargaKomoditi;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E3E3E5',
    borderRadius: 8,
    marginBottom: 12,
  },
  cardHeaderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#EBF0FF',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  cardBody: {
    display: 'flex',
    marginVertical: 12,
  },
  cardBodyWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: 16,
    paddingBottom: 12,
    borderBottomColor: '#E3E3E5',
    borderBottomWidth: 1,
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
