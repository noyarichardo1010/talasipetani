import {View, Text} from 'react-native';
import React from 'react';
import {gStyles} from '../../../../utils/styles';
import {
  BoxIcon,
  IconTriangleArrowUp,
  IconTriangleArrowDown,
} from '../../../../assets';
import {GradeItem, PriceInfo} from '../../../../components';
import {ImageProduct} from '../../../../components/atoms/Product';

const ListKomoditi = ({item, sku, ratePrice = null}) => {
  // console.log('item', item);
  return (
    <View style={gStyles.card}>
      <View style={[gStyles.row_center3, {marginBottom: 12}]}>
        <View style={gStyles.boxIcon}>
          {/* <BoxIcon width={40} height={40} /> */}
          <ImageProduct
            url={item?.commoditie_photos}
            style={[gStyles.dimension('100%', '100%'), {borderRadius: 40}]}
          />
        </View>
        <View style={{marginLeft: 8}}>
          <Text style={[gStyles.text(14, '500', '#313447'), {lineHeight: 27}]}>
            {item.commoditie_name}
          </Text>
        </View>
      </View>
      <View
        style={{
          borderTopWidth: 1,
          borderColor: '#E3E3E5',
          paddingTop: 5,
        }}>
        {item?.detail_prices?.map((price, idx) => (
          <View
            style={[
              gStyles.row_center3,
              {alignItems: 'flex-start', marginVertical: 4},
            ]}>
            <PriceInfo
              key={idx}
              index={idx}
              length={item.detail_prices.length}
              grade={price.grade_name}
              sku={price.sku}
              price={price.current_price}
              perQty={price.unit}
              upOrDown={price.label_color}
              howMuch={10000}
            />
          </View>
        ))}
        {/* )} */}
      </View>
    </View>
  );
};

export default ListKomoditi;
