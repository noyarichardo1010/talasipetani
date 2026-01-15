import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {gStyles} from '../../../../../utils/styles';
import {BankMandiri, IconAdd} from '../../../../../assets';
import {Button, RadioButtons} from '../../../../../components';

const dummyData = [
  {
    option: 1,
    rekening: 'mandiri',
    nama: 'Aji Muhammad Fauji',
    norek: '16000123123',
  },
  {
    option: 2,
    rekening: 'mandiri',
    nama: 'Aji Muhammad Fauji',
    norek: '16000123123',
  },
];

const GantiBank = ({setBottomPanelPopup, navigation}) => {
  const [SelectedBank, setSelectedBank] = useState(1);
  // const [ShowDetail, setShowDetail] = useState(false);
  return (
    <View style={[gStyles.cardNoBorder, {paddingBottom: 30, paddingTop: 5}]}>
      <ScrollView>
        {dummyData.map((bank, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setSelectedBank(bank.option)}
            style={[
              gStyles.card,
              gStyles.row_center3,
              {
                borderColor:
                  bank.option === SelectedBank ? '#2E3192' : '#E3E3E5',
              },
            ]}>
            <View style={{width: 70}}>
              <BankMandiri />
            </View>
            <View style={gStyles.col}>
              <Text style={gStyles.text(14, '500', '#313447')}>
                Bank Mandiri
              </Text>
              <Text style={gStyles.text(12, '400', '#797B8A')}>
                Aji Muhammad Fauji - 16000123123
              </Text>
            </View>
            <RadioButtons
              key={i}
              styleTouchButton={[
                gStyles.row_center3,
                {
                  width: 25,
                  position: 'absolute',
                  right: 5,
                },
              ]}
              option={bank}
              showOption={false}
              setOption={val => setSelectedBank(val)}
              selected={SelectedBank}
              radioButtonBorderColor="#BEBFC2"
              selectedRadioButtonColor="#fff"
              selectedRadioButtonBorderColor="#2E3192"
              radioButtonSize={18}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Button
        style={{marginTop: 10}}
        onPress={() => navigation.navigate('RekeningBank')}
        // onPress={() => setShowDetail(true)}
        title={
          <View style={gStyles.row_center}>
            <IconAdd />
            <Text
              style={[
                {lineHeight: 20, marginLeft: 8},
                gStyles.text(14, '500', '#2E3192'),
              ]}>
              Tambah Rekening
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default GantiBank;
