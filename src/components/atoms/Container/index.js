import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import NoConnection from '../NoConnection';

const Container = ({children, style, backgroundColor}) => {
  const {theme} = useSelector(reducer => reducer.global);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={style}
      contentContainerStyle={{flexGrow: 1}}>
      <View
        style={[
          {
            backgroundColor: backgroundColor
              ? backgroundColor
              : theme.backgroundColor,
          },
          styles.container,
        ]}>
        <NoConnection />
        {children}
      </View>
    </ScrollView>
  );
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
