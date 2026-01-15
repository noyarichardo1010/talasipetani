import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import {gStyles} from '../../../../utils/styles';
import {IconLocation, IconMap} from '../../../../assets';
import {Button} from '../../../../components';

const List = ({navigation, warehouse}) => {
  if (!warehouse) return null;

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate('WarehouseDetail', {warehouse})}>
      <View style={gStyles.card}>
        <Text style={gStyles.text(14, '500', '#313447')}>
          {warehouse?.warehouse_name ?? 'Name'}
        </Text>
        <View style={[gStyles.row_center3, {marginVertical: 8}]}>
          <IconLocation width={17} height={17} />

          <Text style={[gStyles.text(12, '400', '#797B8A'), {marginLeft: 5}]}>
            {`${warehouse?.village_name ?? 'Desa'}, ${
              warehouse?.district_name ?? 'Kec.'
            }, ${warehouse?.city_name}, ${warehouse?.province_name}`}
          </Text>
        </View>
        <View onStartShouldSetResponder={() => true}>
          <Button
            style={{paddingVertical: 0, marginTop: 8}}
            onPress={() => navigation.navigate('WarehouseMap', {warehouse})}
            title={
              <View style={[gStyles.row_center2]}>
                <IconMap />
                <Text
                  style={[{marginLeft: 5}, gStyles.text(14, '500', '#2E3192')]}>
                  Lihat Lokasi Pada Map
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default List;
