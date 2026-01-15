import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {gStyles} from '../../../utils/styles';
import {IconLeftArrow, IconMoreMenu} from '../../../assets';
// import {useBackHandler} from '@react-native-community/hooks';

const {width} = Dimensions.get('window');

const AppBar = ({
  appBarColor,
  iconLeft,
  iconLeftColor,
  headerTextColor,
  navigation,
  leftContent,
  title,
  titleComponent,
  titleStyle,
  rightContent,
  onPressRightContent,
  align = 'flex-start',
  iconRightColor,
  hideRightContent = false,
  hideTitle = false,
  borderBottom = false,
  borderBottomColor,
  borderBottomHeight = 2.5,
  component = null,
  customBack = null,
  globalBackButton = null,
  hideLeftContent = false,
}) => {
  // useBackHandler(() =>
  //   globalBackButton ? globalBackButton() : navigation.goBack(),
  // );

  return component ? (
    <>
      {component}
      {borderBottom ? (
        <View
          style={[
            styles.borderBottom,
            {shadowColor: borderBottomColor, height: borderBottomHeight},
          ]}
        />
      ) : null}
    </>
  ) : (
    <>
      <View
        style={[
          styles.container,
          {backgroundColor: appBarColor, justifyContent: align},
        ]}>
        {hideLeftContent ? null : leftContent ? (
          <View style={styles.leftContentWrapper}>{leftContent}</View>
        ) : iconLeft ? (
          <TouchableOpacity
            onPress={() => (customBack ? customBack() : navigation.goBack())}
            style={styles.leftContentWrapper}>
            {iconLeft}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => (customBack ? customBack() : navigation.goBack())}
            style={styles.leftContentWrapper}>
            <IconLeftArrow width={20} height={20} fill={iconLeftColor} />
          </TouchableOpacity>
        )}
        {hideTitle ? null : (
          <View
            style={[
              hideLeftContent ? gStyles.marginLeft(0) : gStyles.marginLeft(40),
              titleStyle,
            ]}>
            {titleComponent ? (
              titleComponent
            ) : (
              <Text style={[gStyles.text(18, '700', headerTextColor)]}>
                {title ? title : 'Title'}
              </Text>
            )}
          </View>
        )}
        {hideRightContent ? null : rightContent ? (
          rightContent
        ) : (
          <TouchableOpacity
            onPress={() => Alert.alert('onPress right content')}
            style={[styles.rightContentWrapper]}>
            <IconMoreMenu width={20} height={20} fill={iconRightColor} />
          </TouchableOpacity>
        )}
      </View>
      {borderBottom ? (
        <View
          style={[
            styles.borderBottom,
            {shadowColor: borderBottomColor, height: borderBottomHeight},
          ]}
        />
      ) : null}
    </>
  );
};

export default AppBar;

const styles = StyleSheet.create({
  container: {
    width: width,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  leftContentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    left: 15,
  },
  rightContentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
  },
  borderBottom: {
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
  },
});
