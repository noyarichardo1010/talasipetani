import React from 'react';
import {StyleSheet, View, StatusBar, SafeAreaView} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

const CustomStatusBar = ({backgroundColor, ...props}) => {
  const isFocused = useIsFocused();
  return isFocused ? (
    <View style={[styles.statusBar, {backgroundColor}]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  ) : null;
};

export default CustomStatusBar;

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});
