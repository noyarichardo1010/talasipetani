import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  useWindowDimensions,
} from 'react-native';

import React, {useEffect, useState} from 'react';
import {AppBar} from '../../../components';
import {useDispatch, useSelector} from 'react-redux';
import {gStyles} from '../../../utils/styles';
import ListTransaksi from './ListTransaksi';

const Transaction = ({navigation}) => {
  const {theme} = useSelector(reducer => reducer.global);
  const dispatch = useDispatch();
  const [viewStatus, setViewStatus] = useState('aktif');
  const [TabOne, setTabOne] = useState();
  const [TabTwo, setTabTwo] = useState();
  const [TranslateX, setTranslateX] = useState(new Animated.Value(0));

  const changeViewTransaction = status => {
    setViewStatus(status);
  };

  const handleSlide = (status, type) => {
    setViewStatus(status);
    Animated.spring(TranslateX, {toValue: type, duration: 100}).start();
  };

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <AppBar
        appBarColor={theme.backgroundColor}
        navigation={navigation}
        headerTextColor={theme.textColor}
        title="Transaksi"
        borderBottom
        borderBottomColor={theme.textColor}
        borderBottomHeight={1.5}
        titleStyle={styles.screenTitle}
      />
      {/* aktif/selesai */}
      <View
        style={[
          styles.topMenuWrapper,
          {
            backgroundColor: theme.backgroundColor,
          },
        ]}>
        <TouchableOpacity
          onPress={() => changeViewTransaction('aktif')}
          style={[
            styles.topMenuButton,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderBottomColor:
                viewStatus === 'aktif' ? theme.activeIconColor : 'transparent',
            },
          ]}
          onLayout={e => setTabOne(e.nativeEvent.layout.x)}
          onPress={() => handleSlide('aktif', TabOne)}>
          <Text
            style={[
              viewStatus === 'aktif'
                ? gStyles.text(14, '500', theme.activeIconColor)
                : gStyles.text(14, '400', theme.secondaryTextColor),
            ]}>
            Aktif
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeViewTransaction('selesai')}
          style={[
            styles.topMenuButton,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderBottomColor:
                viewStatus === 'selesai'
                  ? theme.activeIconColor
                  : 'transparent',
            },
          ]}
          onLayout={e => setTabTwo(e.nativeEvent.layout.x)}
          onPress={() => handleSlide('selesai', TabTwo)}>
          <Text
            style={[
              viewStatus === 'selesai'
                ? gStyles.text(14, '500', theme.activeIconColor)
                : gStyles.text(14, '400', theme.secondaryTextColor),
            ]}>
            Selesai
          </Text>
        </TouchableOpacity>
      </View>

      {/* ====================== */}

      <View style={gStyles.bottomBoxShadow(1.5, theme.textColor)} />
      {/* body content */}
      <ScrollView
        style={{
          display: 'flex',
          padding: 16,
          backgroundColor: theme.backgroundColor,
        }}
        showsVerticalScrollIndicator={false}>
        <ListTransaksi />
        <ListTransaksi />
      </ScrollView>
    </View>
  );
};

export default Transaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  topMenuWrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
  },
  topMenuButton: {
    display: 'flex',
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
  },
});
