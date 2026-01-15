import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
const {width} = Dimensions.get('window');

const OfflineSign = () => {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
  );
};

export default OfflineSign;

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: 30,
  },
  offlineText: {color: '#fff'},
});
