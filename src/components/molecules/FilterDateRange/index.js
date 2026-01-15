import {
  View,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {gStyles} from '../../../utils/styles';
import {Container} from '../../atoms';
import {CalendarList} from 'react-native-common-date-picker';
import {
  changeFormatSaldo,
  tahun_bulan_tanggal,
} from '../../../utils/helpers/date';

const FilterDateRange = ({closePanel, setSelectedDate, selectedDate}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log('selectedDate calendar', selectedDate);
  }, []);

  return (
    <View style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* <Container backgroundColor={'#F5F6F7'}> */}
        <Modal animationType={'slide'} visible={visible}>
          <CalendarList
            containerStyle={{
              flex: 1,
              // position: 'relative',
              // paddingBottom: 80,
              backgroundColor: 'white',
            }}
            minDate={'2023-01-05'}
            maxDate={tahun_bulan_tanggal(new Date())}
            selectedDateMarkType={'semiellipse'}
            selectedDateMarkRangeColor={'#EBF0FF'}
            // selectedTextColor={'red'}
            // selectedTextStyle={{color: 'red'}}
            selectedDateMarkColor={'#4248ff'}
            headerTitleType={2}
            toolBarPosition={'bottom'}
            onPressDate={val => {
              console.log('val', val);
            }}
            // horizontal={true}
            // weeksStyle={}
            listItemStyle={{height: 40, backgroundColor: 'red'}}
            defaultDates={[
              changeFormatSaldo(selectedDate.from_date, '/', 2),
              changeFormatSaldo(selectedDate.to_date, '/', 2),
            ]}
            toolBarCancelStyle={[{fontSize: 13}]}
            toolBarConfirmStyle={[
              gStyles.btnSecondary,
              gStyles.btnSecondaryText,
              {
                fontSize: 13,
                paddingVertical: 8,
              },
            ]}
            rowHeight={80}
            selectedTextFontSize={35}
            selectedTextStyle={{backgroundColor: 'white'}}
            toolBarStyle={{
              justifyContent: 'flex-end',
              borderTopWidth: 1,
              borderColor: 'gray',
              backgroundColor: 'white',
              flex: 1,
              position: 'relative',
              paddingLeft: 15,
              bottom: 0,
              paddingRight: 15,
              width: '100%',
            }}
            cancelText={'Batal'}
            confirmText={'Simpan'}
            confirm={data => {
              // console.log('data', data);
              setSelectedDate({
                from_date: changeFormatSaldo(data[0], '-'),
                to_date: changeFormatSaldo(data[1], '-'),
              });
              setVisible(false);
              closePanel();
            }}
            cancel={() => {
              setVisible(false);
              closePanel();
            }}
          />
        </Modal>
        {/* </Container> */}
      </KeyboardAvoidingView>
    </View>
  );
};

export default FilterDateRange;
