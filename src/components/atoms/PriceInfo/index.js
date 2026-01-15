import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {IconTriangleArrowDown, IconTriangleArrowUp} from '../../../assets';
import {gStyles} from '../../../utils/styles';
import {delimiterFormat} from '../../../utils/helpers/number';
import {GradeItem} from '../../molecules';
import {getGradeStyle} from '../../../utils/helpers/text';

const PriceInfo = ({
  length,
  index,
  grade,
  price,
  perQty,
  upOrDown,
  howMuch,
  sku,
}) => {
  return (
    <View
      style={[
        styles.gradeWrapper,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          marginBottom: index === length - 1 ? 0 : 8,
        },
      ]}>
      {/* <Text
        style={[
          styles.textGrade,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            borderColor:
              grade === 'A'
                ? '#F36767'
                : grade === 'B'
                ? '#FFBD66'
                : grade === 'C'
                ? '#83D4FF'
                : '#83D4FF',
            backgroundColor:
              grade === 'A'
                ? '#FFEBEB'
                : grade === 'B'
                ? '#FFF6EB'
                : grade === 'C'
                ? '#EBF8FF'
                : '#EBF8FF',
          },
        ]}>
        Grade {grade}
      </Text> */}

      <GradeItem grade={grade} gradeColor={`${getGradeStyle(index)}`} />

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          flex: 1.5,
        }}>
        <View>
          <Text
            // eslint-disable-next-line no-sparse-arrays
            style={[
              gStyles.marginHorizontal(8),
              gStyles.text(14, '400', '#313447'),
            ]}>
            Rp. {delimiterFormat(price)}{' '}
            <Text style={gStyles.text(12, '400', '#797B8A')}>
              /{perQty !== '' ? perQty : 'kg'}
            </Text>
          </Text>
          {sku ? (
            <Text
              style={[
                gStyles.marginHorizontal(8),
                gStyles.text(12, '400', '#797B8A'),
              ]}>
              ( {sku} )
            </Text>
          ) : null}
        </View>
        {upOrDown === '' || upOrDown === 'no' || howMuch === 0 ? null : (
          <View style={gStyles.row}>
            {upOrDown === 'up' || upOrDown === 'green' ? (
              <>
                <IconTriangleArrowUp fill="#149614" width={16} height={16} />
                <Text
                  style={[gStyles.text(12, '400', '#149614'), {marginLeft: 2}]}>
                  Rp. {delimiterFormat(howMuch)}
                </Text>
              </>
            ) : (
              <>
                <IconTriangleArrowDown fill="#D80909" width={16} height={16} />
                <Text
                  style={[gStyles.text(12, '400', '#D80909'), {marginLeft: 2}]}>
                  Rp. {delimiterFormat(howMuch)}
                </Text>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default PriceInfo;

const styles = StyleSheet.create({
  gradeWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textGrade: {
    fontSize: 12,
    fontWeight: '500',
    color: '#313447',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderRadius: 4,
  },
});
