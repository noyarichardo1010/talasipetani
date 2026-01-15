import React from 'react';
import {Gap} from '../../../../components';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {UpGreen} from '../../../../assets';
import {colors, gStyles} from '../../../../utils/styles';
import {formatCurrency} from '../../../../utils/helpers/number';

const ChangePriceList = ({changePriceList}) => {
  return (
    <View style={{paddingHorizontal: 16, flex: 1}}>
      <Text style={[gStyles.textMdBold, {color: colors.black, fontSize: 16}]}>
        Perubahan Harga Komoditi{' '}
        <Text
          style={[gStyles.textMdBold, {color: colors.primary, fontSize: 16}]}>
          {'23 Maret 2023'}
        </Text>
      </Text>
      <Gap height={16} />
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <Gap width={16} />}
        data={changePriceList}
        renderItem={(item, index) => {
          return (
            <View style={styles.itemChange} key={index}>
              <Image
                source={{uri: item?.item?.image}}
                style={styles.image}
                resizeMode={'cover'}
              />
              <Gap width={8} />
              <View>
                <Text style={[gStyles.textSmRegular, {color: colors.black}]}>
                  {item?.item?.name}
                </Text>
                <Gap height={2} />
                <View style={styles.item}>
                  <Text style={[gStyles.textSmRegular, {fontSize: 12}]}>
                    {formatCurrency(item?.item?.price.toString())}/Kg
                  </Text>
                </View>
                <Gap height={4} />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <UpGreen />
                  <Gap height={4} />
                  <Text
                    style={[
                      gStyles.textSmRegular,
                      {color: colors.green, fontSize: 12},
                    ]}>
                    {item?.item?.change}
                  </Text>
                </View>
              </View>
              <Gap width={8} />
            </View>
          );
        }}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default ChangePriceList;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  logo: {
    width: 107,
    height: 40,
  },
  dashboard: {
    borderRadius: 8,
    padding: 16,
    margin: 16,
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: 13,
    borderRadius: 4,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4, // for Android only
    shadowColor: '#000', // for iOS only
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.neutral,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemChange: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.neutral,
  },
});
