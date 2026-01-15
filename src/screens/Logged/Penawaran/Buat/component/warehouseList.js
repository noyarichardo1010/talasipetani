import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Container, RadioButtons} from '../../../../../components';
import {gStyles} from '../../../../../utils/styles';
import styles from '../../styles';
import {IconLocation, RouteSquare} from '../../../../../assets';
import {useSelector} from 'react-redux';
import {useBackHandler} from '@react-native-community/hooks';

const WarehouseList = ({
  SelectedWarehouse,
  setSelectedWarehouse,
  closePanel,
  WarehouseListData,
  getListWarehouse,
  BottomPanelPopup,
}) => {
  const [Selected, setSelected] = useState(null);
  const [ListWarehouse, setListWarehouse] = useState(WarehouseListData);

  // useBackHandler(() => closePanel());

  useEffect(() => {
    if (BottomPanelPopup.content === 'warehouse') {
      getListWarehouse();
    }
  }, [BottomPanelPopup]);

  useEffect(() => {
    setListWarehouse(WarehouseListData);
  }, [WarehouseListData]);

  useEffect(() => {
    if (SelectedWarehouse) {
      const find = WarehouseListData.find(
        data => data.option === SelectedWarehouse.option,
      );
      console.log('selected find', find);
      setSelected(find?.option);
    }
  }, []);

  const handlerApply = () => {
    const find = WarehouseListData.find(data => data.option === Selected);
    console.log('WarehouseListData', WarehouseListData);
    console.log('Selected', Selected);
    console.log('find SelectedWarehouse', find);
    setSelectedWarehouse(find);
    closePanel();
  };

  return (
    <View style={{flex: 1, padding: 12, justifyContent: 'center'}}>
      <ScrollView>
        {ListWarehouse.map((warehouse, i) => (
          <TouchableOpacity
            onPress={() => setSelected(warehouse.option)}
            key={i}
            style={[styles.card, gStyles.row, {padding: 0}]}>
            <View style={[gStyles.col, {padding: 10}]}>
              <View style={gStyles.row}>
                <Text style={gStyles.text(14, '700', '#313447')}>
                  {warehouse.name}
                </Text>
              </View>
              <View style={gStyles.row_center3}>
                <RouteSquare width={17} height={17} />
                <Text
                  style={[
                    gStyles.text(12, '400', '#313447'),
                    {lineHeight: 30, paddingLeft: 5},
                  ]}>
                  {warehouse.distance} km
                </Text>
              </View>
              <View style={gStyles.row}>
                <IconLocation width={17} height={17} />
                <Text
                  style={[
                    gStyles.text(12, '400', '#313447'),
                    {
                      display: 'flex',
                      paddingLeft: 5,
                      marginRight: 35,
                      width: '85%',
                    },
                  ]}>
                  {warehouse.address}
                </Text>
                <RadioButtons
                  key={i}
                  styleTouchButton={[
                    gStyles.row_center3,
                    {
                      width: 25,
                      position: 'absolute',
                      right: 0,
                      bottom: 0,
                    },
                  ]}
                  option={warehouse}
                  showOption={false}
                  setOption={val => setSelected(val)}
                  selected={Selected}
                  radioButtonBorderColor="#BEBFC2"
                  selectedRadioButtonColor="#fff"
                  selectedRadioButtonBorderColor="#2E3192"
                  radioButtonSize={18}
                />
              </View>
            </View>
            <View style={gStyles.col}>
              {warehouse.near && (
                <Text
                  style={[
                    gStyles.text(12, '500', '#FFFFFF'),
                    {
                      backgroundColor: '#2E3192',
                      padding: 5,
                      position: 'absolute',
                      width: 65,
                      right: 0,
                      textAlign: 'center',
                      borderBottomLeftRadius: 8,
                      borderTopRightRadius: 8,
                    },
                  ]}>
                  Terdekat
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={[{width: '100%'}]}>
        <Button
          type="full"
          title={'Simpan'}
          isDisabled={!Selected}
          onPress={() => handlerApply()}
        />
      </View>
    </View>
  );
};

export default WarehouseList;
