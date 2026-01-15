import React from 'react';
import {PermissionsAndroid, Alert} from 'react-native';

import {isArraySame} from '../helpers/array';
import Geolocation from '@react-native-community/geolocation';

const DEFAULT_LONGITUDE = 106.8271270815598;
const DEFAULT_LATITUDE = -6.174363471957644;
// const DEFAULT_LATITUDE = -3.0033866751551415;
// const DEFAULT_LONGITUDE = 114.77837831343327;

const useGetLocation = () => {
  const [mylocation, setMyLocation] = React.useState({
    long: null,
    lat: null,
    last_update: 0,
  });

  const getLocation = async (location = null) => {
    console.log('========== getCurrentPosition ==========', location);
    if (location)
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          // let res = await Geolocation.getCurrentPosition(
          info => {
            console.log('Geolocation', info);
            if (
              isArraySame(
                [info.coords.latitude, info.coords.longitude],
                [location.lat, location.long],
              )
            ) {
              console.log('sama');
              // return info;
              resolve(info);
            } else {
              console.log('posisi berubah', info);
              // setDistance(
              //   getDistance(
              //     [schedule.attLocation[0], schedule.attLocation[1]],
              //     coords,
              //   ),
              // );

              setMyLocation({
                long: info.coords.longitude,
                lat: info.coords.latitude,
                last_update: info.timestamp,
              });
              resolve(info);

              // setCurrTime(jam_menit_detik());
            }
          },
          error => {
            console.log('error Geolocation', JSON.stringify(error));
            // return JSON.stringify(error);
            reject(error);
          },
          // {enableHighAccuracy: true, timeout: 20000},
        );
      });
  };
  return {
    // location,
    mylocation,
    getLocation,
  };
};

export default useGetLocation;
