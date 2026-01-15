import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {gStyles} from '../../../../../utils/styles';
import {IconCouponInvert, IconLeftArrow} from '../../../../../assets';
import {useSelector} from 'react-redux';

const Coupon = ({
  SelectedKupon,
  setBottomPanelPopup,
  SelectedKomoditi,
  showAlert,
}) => {
  const {theme} = useSelector(reducer => reducer.global);
  // console.log('selectedKupon', SelectedKupon);
  return (
    <>
      <TouchableOpacity
        style={[gStyles.row_center2, {paddingVertical: 20}]}
        onPress={() => {
          SelectedKomoditi.length === 0
            ? showAlert()
            : setBottomPanelPopup({
                show: true,
                content: 'kupon',
                title: 'Kupon Harga Khusus',
                type: 'full',
              });
        }}>
        <View style={gStyles.row_center3}>
          <IconCouponInvert width={17} height={17} />
          <Text
            style={[gStyles.text(14, '400', '#313447'), {marginLeft: 20}, ,]}>
            {SelectedKupon
              ? 'Kupon ' + SelectedKupon?.coupon_code
              : 'Gunakan Kupon kode khusus'}
          </Text>
        </View>
        <View style={{transform: [{rotate: '180deg'}]}}>
          <IconLeftArrow width={15} height={15} fill={theme.textColor} />
        </View>
      </TouchableOpacity>
    </>
  );
};

export default Coupon;
