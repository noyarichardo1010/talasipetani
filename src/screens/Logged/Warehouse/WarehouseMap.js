import {
  StyleSheet,
  Platform,
  Linking,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useRef} from 'react';

import {
  IconCloseCircle,
  IconLocationBlue,
  IconWarehuoseMap,
} from '../../../assets';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import {gStyles} from '../../../utils/styles';

import {Button} from '../../../components';

const WarehouseMap = ({navigation, route}) => {
  const {warehouse} = route.params;

  const mapRef = useRef(null);

  const koordinat = {
    latitude: parseFloat(warehouse.lat),
    longitude: parseFloat(warehouse.long),
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
    description: '-',
  };

  const openMapApp = (lat, lng, warehouseName) => {
    const scheme = Platform.select({
      ios: 'maps://0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${lat},${lng}`;
    const label = warehouseName;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  return (
    <View style={styles.wrapper}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={koordinat}
        ref={mapRef}>
        <Marker
          coordinate={{
            latitude: parseFloat(warehouse.lat),
            longitude: parseFloat(warehouse.long),
          }}
          style={styles.markerWrapper}>
          <Text style={styles.markerTitle}>{warehouse.warehouse_name}</Text>
          <IconWarehuoseMap fill="#2E3192" width={50} height={50} />
        </Marker>
      </MapView>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.closeIcon}>
        <IconCloseCircle fill="#313447" width={25} height={25} />
      </TouchableOpacity>

      <View style={styles.addressWrapper}>
        <Text
          style={[
            gStyles.text(14, '500', '#313447'),
            gStyles.marginVertical(4),
          ]}>
          {warehouse.warehouse_name}
        </Text>
        <View style={[gStyles.row_2, gStyles.marginBottom(16)]}>
          <IconLocationBlue fill="#2E3192" width={20} height={20} />
          <Text
            style={[gStyles.text(14, '400', '#313447'), gStyles.marginLeft(8)]}>
            {`${warehouse?.village_name ?? 'Desa'}, ${
              warehouse.district_name ?? 'Kec.'
            }, ${warehouse.city_name}, ${warehouse.province_name}`}
          </Text>
        </View>
        <Button
          title="Rute"
          type="full"
          textStyle={gStyles.weight('500')}
          onPress={() =>
            openMapApp(warehouse.lat, warehouse.long, warehouse.warehouse_name)
          }
        />
      </View>
    </View>
  );
};

export default WarehouseMap;

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  closeIcon: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginLeft: 20,
    marginTop: 20,
  },
  markerWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    backgroundColor: '#0E1054',
    padding: 8,
    borderRadius: 4,
  },
  addressWrapper: {
    display: 'flex',
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
  },
});
