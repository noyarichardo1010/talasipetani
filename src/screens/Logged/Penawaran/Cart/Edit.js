import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  View,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Detail from '../../Transaction/Detail/component/detail';
import {IconLeftArrow} from '../../../../assets';
import {AppBar, statusList} from '../../../../components';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../../../../utils/styles';
import API, {getErrorResponse} from '../../../../services/api';
import styles from './styles';

const EditCart = ({route, navigation}) => {
  const {theme, message, messageType, alert, alertType, loading} = useSelector(
    reducer => reducer.global,
  );
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.container}>
      <AppBar
        appBarColor={theme.backgroundColor}
        navigation={navigation}
        headerTextColor={theme.textColor}
        iconLeft={
          <IconLeftArrow width={20} height={20} fill={theme.textColor} />
        }
        hideRightContent
        title="Edit Penawaran"
        borderBottom
        borderBottomColor={theme.textColor}
      />
      <ScrollView
        style={[
          styles.bodyContent,
          {
            backgroundColor: '#F5F6F7',
          },
        ]}
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl refreshing={Refresh} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        <View style={[styles.cardNoBorder, styles.cardSpace]}>
          <Detail DataOffer={DataOffer} DataLog={DataLog} Status={Status} />
        </View>
        <View style={[styles.card, gStyles.row_center2, {marginVertical: 10}]}>
          <View style={[gStyles.col, {width: '90%'}]}>
            <Text style={gStyles.text(14, '500', '#313447')}>
              {SelectedWarehouse.name}
            </Text>
            <View style={gStyles.row_center3}>
              <View style={{paddingVertical: 5, paddingRight: 5}}>
                {reData ? (
                  <RouteSquareBlue width={17} height={17} />
                ) : (
                  <RouteSquare width={17} height={17} />
                )}
              </View>
              <Text style={gStyles.text(12, '400', '#797B8A')}>
                {SelectedWarehouse.distance} km
              </Text>
            </View>
            <View style={gStyles.row_center3}>
              <View style={{paddingRight: 5}}>
                {reData ? (
                  <IconLocationBlue width={17} height={17} />
                ) : (
                  <IconLocation width={17} height={17} />
                )}
              </View>
              <Text style={gStyles.text(12, '400', '#797B8A')}>
                {SelectedWarehouse.address}
              </Text>
            </View>
          </View>
          {!reData && (
            <TouchableOpacity
              onPress={() => showLocation()}
              style={{width: 40}}>
              <Text style={gStyles.text(14, '700', '#5C73BD')}>Ganti</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditCart;
