import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';

const NoConnection = () => {
  const netInfo = useNetInfo();

  return (
    netInfo &&
    (netInfo.isConnected ? null : (
      <View style={styles.offlineContainer}>
        <Text style={styles.offlineText}>No Internet Connection</Text>
      </View>
    ))
  );
};

export default NoConnection;

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    zIndex: 9999,
  },
  offlineText: {
    color: '#fff',
  },
});
