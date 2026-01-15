import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import React from 'react';
import {Box} from '../../../assets';
import {gStyles} from '../../../utils/styles';
import {useSelector} from 'react-redux';
import {ImageProduct} from '../../atoms/Product';

const CardKomoditi = ({
  data,
  onPress,
  name = 'Name',
  totalVariant = 0,
  onLoading = false,
}) => {
  const {theme} = useSelector(reducer => reducer.global);
  // console.log('data', data);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          styles.container,
          {
            opacity: onLoading ? 0.5 : 1,
            // backgroundColor: onLoading ? '#F5F6F7' : 'white',
            width: '100%',
          },
        ]}>
        <View style={styles.cardBodyWrapper}>
          <View style={styles.boxWrapper}>
            <ImageProduct
              url={data?.commoditie_photos}
              style={[gStyles.dimension('100%', '100%'), {borderRadius: 40}]}
            />
          </View>
          <View style={styles.cardBodyContent}>
            <Text style={gStyles.text(14, '500', theme.textColor)}>{name}</Text>
            {totalVariant > 0 ? (
              <View style={gStyles.row_2}>
                <Text style={[gStyles.text(12, '400', '#797B8A')]}>
                  {totalVariant} varian
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CardKomoditi;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E3E3E5',
    borderRadius: 8,
    marginBottom: 12,
  },
  cardBodyWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  boxWrapper: {
    width: 48,
    height: 48,
    borderRadius: 40,
    // backgroundColor: '#F5F6F7',
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
});
