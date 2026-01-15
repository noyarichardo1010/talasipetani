import React from 'react';
import messaging from '@react-native-firebase/messaging';

const useNotif = () => {
  const getFCMToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      return fcmToken;
    } catch (err) {
      console.warn(err);
    }
  };
  return {
    getFCMToken,
  };
};

export default useNotif;
