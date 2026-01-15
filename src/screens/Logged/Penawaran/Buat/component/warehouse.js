import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {gStyles} from '../../../../../utils/styles';
import {Button} from '../../../../../components';
import {
  IconLocation,
  IconWarehouse,
  RouteSquare,
  RouteSquareBlue,
  IconLocationBlue,
} from '../../../../../assets';
import styles from '../../styles';

const Warehouse = ({setBottomPanelPopup, SelectedWarehouse, reData}) => {
  const showLocation = () => {
    // if (!reData)
    setBottomPanelPopup({
      show: true,
      data: {},
      title: 'Pilih Lokasi Warehouse Hub',
      type: 'full',
      content: 'warehouse',
    });
  };
  // console.log('SelectedWarehouse', SelectedWarehouse);
  if (reData && !SelectedWarehouse) {
    return null;
  }
  return (
    <>
      <Text style={gStyles.text(16, '500', '#313447')}>
        Lokasi Warehouse Hub
      </Text>
      {SelectedWarehouse ? (
        <View style={[styles.card, gStyles.row_center2, {marginVertical: 10}]}>
          <View style={[gStyles.col, {width: '100%'}]}>
            <View style={gStyles.row_center2}>
              <Text style={gStyles.text(14, '500', '#313447')}>
                {SelectedWarehouse?.name}
              </Text>
              {!reData && (
                <TouchableOpacity
                  onPress={() => showLocation()}
                  style={{width: 40}}>
                  <Text style={gStyles.text(14, '700', '#5C73BD')}>Ganti</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={gStyles.row_center3}>
              <View style={{paddingVertical: 5, paddingRight: 5}}>
                {reData ? (
                  <RouteSquareBlue width={17} height={17} />
                ) : (
                  <RouteSquare width={17} height={17} />
                )}
              </View>
              <Text style={gStyles.text(12, '400', '#797B8A')}>
                {SelectedWarehouse?.distance} km
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
              <Text
                style={[
                  gStyles.text(12, '400', '#797B8A'),
                  {paddingRight: 10},
                ]}>
                {SelectedWarehouse?.address ??
                  SelectedWarehouse?.address_full?.address}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={[gStyles.row, {paddingVertical: 8}]}>
          <Button
            title={
              <View style={gStyles.row_center3}>
                <IconWarehouse />
                <Text
                  style={[
                    {lineHeight: 20, marginLeft: 8},
                    gStyles.text(14, '500', '#fff'),
                  ]}>
                  Pilih Lokasi Warehouse Hub
                </Text>
              </View>
            }
            type="full"
            style={gStyles.btnSecondary}
            textStyle={gStyles.btnSecondaryText}
            onPress={() => showLocation()}
            isDisabled={reData}
          />
        </View>
      )}
    </>
  );
};

export default Warehouse;
