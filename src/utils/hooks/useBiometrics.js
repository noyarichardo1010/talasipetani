import React, {useEffect, useState} from 'react';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import DeviceInfo from 'react-native-device-info';
export const useBiometrics = () => {
  let deviceId = DeviceInfo.getDeviceId();
  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  const checkSensorAvailable = async () => {
    const resultObject = await rnBiometrics.isSensorAvailable();
    return resultObject;
  };

  const createKeys = async () => {
    const resultObject = await rnBiometrics.createKeys();
    return resultObject;
  };

  const deleteKeys = async () => {
    const resultObject = await rnBiometrics.deleteKeys();
    return resultObject;
  };

  const promptBiometrics = async () => {
    const biometricKeys = await rnBiometrics.biometricKeysExist();
    // console.log('biometricKeys', biometricKeys);
    if (biometricKeys?.keysExist) {
      // console.log('payload', payload);
      const resultObject = await rnBiometrics
        .createSignature({
          promptMessage: 'Masuk',
          payload: deviceId,
        })
        .catch(err => console.log('err prompt', err));
      return resultObject;
    } else {
      const {publicKey} = await createKeys();
      console.log('sendPublicKeyToServer', publicKey);
    }
  };

  return {
    createKeys,
    deleteKeys,
    promptBiometrics,
    BiometryTypes,
    checkSensorAvailable,
  };
};
