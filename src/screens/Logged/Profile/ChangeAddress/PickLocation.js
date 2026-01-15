/* eslint-disable react-hooks/exhaustive-deps */
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import useGetLocation from '../../../../utils/hooks/useGetLocation';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {
  Button,
  GooglePlacesInput,
  Loading,
  LoadingAnimated,
} from '../../../../components';
import {gStyles} from '../../../../utils/styles';
import {
  IconCloseCircle,
  IconLoading,
  IconLocation,
  IconSearch,
} from '../../../../assets';
import {useDispatch, useSelector} from 'react-redux';
import API, {getErrorResponse} from '../../../../services/api';
import {setPickedAddress} from '../../../../services';
import {isArraySame} from '../../../../utils/helpers/array';
import {useBackHandler} from '@react-native-community/hooks';
import {GMAPS_KEY} from '../../../../services/api/url';
// import {GMAPS_KEY} from '@env';

// const {height, width} = Dimensions.get('window');

const DEFAULT_LONGITUDE = 106.8271270815598;
const DEFAULT_LATITUDE = -6.174363471957644;

const PickLocation = ({navigation}) => {
  const {
    // location,
    mylocation,
    getLocation,
  } = useGetLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const mapRef = useRef(null);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({
    lat: null,
    long: null,
    last_update: 0,
  });

  const {pickedAddress} = useSelector(reducer => reducer.location);
  const [searchedLocation, setSearchedLocation] = useState({
    latitude: mylocation.lat,
    longitude: mylocation.long,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
    description: '-',
  });
  const [region, setRegion] = useState({
    latitude: mylocation.lat,
    longitude: mylocation.long,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
    description: '-',
  });

  useEffect(() => {
    checkCurrentLocation();
  }, []);

  const checkCurrentLocation = async () => {
    console.log('await');
    await getLocation(location)
      .then(res => {
        console.log('checkCurrentLocation res', res);
        const coords = res?.coords;
        console.log('long res', coords.longitude);
        console.log('lat res', coords.latitude);
        setLocation({
          long: coords.longitude,
          lat: coords.latitude,
          last_update: res.timestamp,
        });

        getGoogleMaps({
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
          longitude: coords.longitude,
          latitude: coords.latitude,
        });
        setSearchedLocation({
          ...searchedLocation,
          longitude: coords.longitude,
          latitude: coords.latitude,
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.error('err checkCurrentLocation', err);
        Alert.alert('', err.message);
        // setLocation({
        //   long: DEFAULT_LONGITUDE,
        //   lat: DEFAULT_LATITUDE,
        //   last_update: new Date().getTime(),
        // });
        // setRegion({
        //   ...region,
        //   longitude: DEFAULT_LONGITUDE,
        //   latitude: DEFAULT_LATITUDE,
        // });
        // getGoogleMaps({
        //   latitudeDelta: 0.01,
        //   longitudeDelta: 0.01,
        //   longitude: DEFAULT_LONGITUDE,
        //   latitude: DEFAULT_LATITUDE,
        // });
        // setSearchedLocation({
        //   ...searchedLocation,
        //   longitude: DEFAULT_LONGITUDE,
        //   latitude: DEFAULT_LATITUDE,
        // });
        setIsLoading(false);
        setIsError(true);
      });
    // getGoogleMaps();
    // if(res)
  };

  useEffect(() => {
    if (location.lat && location.long) {
      handleCamera();
    }
  }, [location]);

  const handleCamera = () => {
    console.log('location handleCamera', location);

    mapRef?.current?.animateCamera({
      center: {
        latitude: location.lat,
        longitude: location.long,
      },
      pitch: 0,
      heading: 0,
    });
  };

  // useEffect(() => {
  // console.log('========= region =========');
  // if (region.longitude && region.latitude) getGoogleMaps();
  // }, [region]);

  const getGoogleMaps = async reg => {
    // console.log('region getGoogleMaps', reg);

    // if (
    //   isArraySame(
    //     [region.latitude, region.longitude],
    //     [location.lat, location.long],
    //   )
    // ) {
    //   console.log('sama');
    //   return;
    // } else {

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${reg.latitude},${reg.longitude}&key=${GMAPS_KEY}`;
    console.log('url', url);

    // setIsLoading(true);
    await API.get(url)
      .then(res => {
        // console.log('res getGoogleMaps', res);
        const addr =
          res?.results?.[1]?.formatted_address ?? 'Jl. Tidak Dikenali';
        // console.log('res', res);
        setAddress(addr);
        // mapRef.current?.animateToRegion(region, 1000);

        setRegion({
          ...reg,
          longitude: reg.longitude,
          latitude: reg.latitude,
        });
        mapRef?.current?.animateCamera({
          center: {
            latitude: reg.latitude,
            longitude: reg.longitude,
          },
          pitch: 0,
          heading: 0,
        });
      })
      .catch(err => {
        console.error('err getGoogleMaps', err);
        getErrorResponse(err);
      });
    setIsLoading(false);
    // }
  };

  useEffect(() => {
    if (searchedLocation?.description !== '-') {
      console.log('searchedLocation', searchedLocation);
      mapRef?.current?.animateCamera({
        center: {
          latitude: searchedLocation.latitude,
          longitude: searchedLocation.longitude,
        },
      });
      setAddress(searchedLocation?.description);
    }
  }, [searchedLocation]);

  // useBackHandler(() => handleBack());
  // const handleBack = () => navigation.goBack();

  return (
    <View style={styles.wrapper}>
      <LoadingAnimated
        visible={isLoading}
        // handleBack={() => handleBack()}
      />

      {region.latitude && region.longitude ? (
        <>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            region={region}
            ref={mapRef}
            initialRegion={region}
            onRegionChangeComplete={reg => getGoogleMaps(reg)}
          />
          {/* marker di tengah */}
          <View style={styles.marker}>
            <IconLocation fill="#2E3192" width={40} height={40} />
          </View>
        </>
      ) : (
        <>
          {isError ? null : (
            <View
              style={[
                styles.wrapper,
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Image
                style={{
                  width: 100,
                  height: 100,
                }}
                source={IconLoading}
              />
            </View>
          )}
        </>
      )}
      {/* top section */}

      <View style={styles.searchWrapper}>
        <View style={styles.searchField}>
          <GooglePlacesInput
            region={searchedLocation}
            setRegion={setSearchedLocation}
            placeholder="Cari lokasi"
            // eslint-disable-next-line react-native/no-inline-styles
            containerStyle={{
              marginTop: 4,
              width: '100%',
              flex: 1,
            }}
            // eslint-disable-next-line react-native/no-inline-styles
            inputTextStyle={{
              color: '#687083',
              fontSize: 14,
            }}
            leftButton={el => (
              <TouchableOpacity
                // onPress={deleteInput}
                onPress={() => {
                  console.log('el', el);
                  el?.clear();
                  navigation.goBack();
                }}
                style={styles.searchTextDel}>
                <IconCloseCircle fill="#797B8A" width={25} height={25} />
              </TouchableOpacity>
            )}
            rightButton={() => (
              <IconSearch
                width={25}
                height={25}
                fill={'#93959E'}
                style={gStyles.marginTop(13)}
              />
            )}
          />
        </View>
        <View style={styles.guideWrapper}>
          <View style={gStyles.row_2}>
            <Text style={gStyles.text(14, '400', '#313447')}>
              Geser peta dan posisikan tanda{' '}
            </Text>
            <IconLocation fill="#2E3192" width={20} height={20} />
            <Text style={gStyles.text(14, '400', '#313447')}> pada lokasi</Text>
          </View>
        </View>
      </View>
      <View style={styles.addressWrapper}>
        <View style={[gStyles.row_2, gStyles.marginBottom(16)]}>
          <IconLocation fill="#2E3192" width={20} height={20} />

          <Text
            style={[gStyles.text(14, '400', '#313447'), gStyles.marginLeft(8)]}>
            {address !== ''
              ? address
              : pickedAddress?.name ?? 'Jl. Tidak diketahui'}
          </Text>
        </View>
        <Button
          title="Gunakan Lokasi Ini"
          type="full"
          textStyle={gStyles.weight('500')}
          onPress={() => {
            dispatch(
              setPickedAddress({
                latitude: region.latitude,
                longitude: region.longitude,
                name: address,
              }),
            );
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );
};

export default PickLocation;

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    // flex: 1,
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
  },
  searchField: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderColor: '#D1D5DC',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 1,
    paddingHorizontal: 13.25,
    position: 'relative',
  },
  searchTextDel: {
    position: 'relative',
    marginTop: 13,
    paddingRight: 13.25,
    borderRightWidth: 1,
    borderRightColor: '#E3E3E5',
  },
  searchWrapper: {
    padding: 16,
    display: 'flex',
  },
  marker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
  },
  guideWrapper: {
    display: 'flex',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderColor: '#829BDE',
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
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
