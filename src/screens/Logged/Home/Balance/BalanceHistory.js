import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  AppBar,
  Loading,
  BottomPanel,
  FilterDateRange,
  LoadingAnimated,
  BadgeStatus,
  BottomPanelModal,
} from '../../../../components';
import {IconCalendar, IconLeftArrow} from '../../../../assets';
import {colors, gStyles} from '../../../../utils/styles';
import {
  changeFormatSaldo,
  format_tanggal_indo,
  tahun_bulan_tanggal,
  tanggal_bulan_tahun,
} from '../../../../utils/helpers/date';
import API from '../../../../services/api';
import {delimiterFormat} from '../../../../utils/helpers/number';
// import {useBackHandler} from '@react-native-community/hooks';
import {CalendarList} from 'react-native-common-date-picker';

const BalanceHistory = ({navigation}) => {
  const dispatch = useDispatch();
  const {userInfo, theme} = useSelector(reducer => reducer.global);
  const [refreshing, setRefreshing] = useState(false);
  const [RiwayatSaldo, setRiwayatSaldo] = useState(null);
  const [filterDateShow, setFilterDateShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState({
    // from_date: '23/08/2023',
    // to_date: '01/10/2023',
    from_date: tanggal_bulan_tahun(
      new Date(`${new Date().getMonth() + 1}/01/${new Date().getFullYear()}`),
      '/',
    ),
    to_date: tanggal_bulan_tahun(new Date(), '/'),
  });
  const [IsLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('selectedDate', selectedDate);
    getRiwayatSaldo();
  }, [selectedDate]);

  const getRiwayatSaldo = async () => {
    setIsLoading(true);
    await API.get(
      `/farmer/transaction?start_date=${selectedDate.from_date}&end_date=${selectedDate.to_date}`,
    ).then(res => {
      console.log('getRiwayatSaldo', res);
      if (res?.meta?.http_status === 200) {
        if (res?.data) {
          setRiwayatSaldo(res.data);
        }
      }
    });
    setIsLoading(false);
  };

  const handleRefresh = useCallback(() => {
    getRiwayatSaldo();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleRefresh();
    });
    return unsubscribe;
  }, [navigation]);

  // useBackHandler(() => handleBack());
  // const handleBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <LoadingAnimated
        visible={IsLoading}
        // handleBack={() => handleBack()}
      />
      <AppBar
        appBarColor={theme.backgroundColor}
        navigation={navigation}
        headerTextColor={theme.textColor}
        hideRightContent
        iconLeft={
          <IconLeftArrow width={20} height={20} fill={theme.textColor} />
        }
        title="Riwayat Saldo"
        borderBottom
        borderBottomColor={theme.textColor}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: theme.backgroundColor,
          padding: 16,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <View
          style={[
            {
              backgroundColor: theme.backgroundColor,
            },
          ]}>
          <TouchableOpacity
            style={styles.filterDate}
            onPress={() => setFilterDateShow(true)}>
            <Text style={gStyles.text(14, '400', '#313447')}>
              {selectedDate.from_date} - {selectedDate.to_date}
            </Text>
            <IconCalendar fill="#93959E" width={20} height={20} />
          </TouchableOpacity>
          <View>
            {RiwayatSaldo && (
              <>
                {RiwayatSaldo?.map(riwayat => (
                  <View style={gStyles.card}>
                    <BalanceItem
                      navigation={navigation}
                      riwayat={riwayat}
                      offer={riwayat.offer_number}
                      amount={riwayat.value}
                      date={riwayat.date}
                      status={riwayat.offer_status}
                      type={riwayat.type}
                    />
                  </View>
                ))}
              </>
            )}

            {/* <View style={styles.date}>
              <Text style={gStyles.text(12, '500', '#797B8A')}>3 Feb 2023</Text>
            </View>
            <BalanceItemOld
              amount="+Rp 8.000.000"
              time="09:37 WIT"
              transactionType="Pembayaran Diterima"
            />

            <View style={styles.date}>
              <Text style={gStyles.text(12, '500', '#797B8A')}>1 Feb 2023</Text>
            </View>
            <BalanceItemOld
              amount="+Rp 20.000.000"
              time="09:37 WIT"
              transactionType="Pembayaran Diterima"
            />
            <View style={styles.date}>
              <Text style={gStyles.text(12, '500', '#797B8A')}>
                25 Des 2022
              </Text>
            </View>

            <BalanceItemOld
              amount="+Rp 68.290.000"
              time="13:24 WIT"
              transactionType="Pembayaran Diterima"
            /> */}
          </View>
        </View>
      </ScrollView>
      {/* {filterDateShow && (
        <BottomPanelModal
          animate
          withHeader
          // radius={12}
          clickOutsideToClosePanel
          height={'70%'}
          positionAnimatePop={-1000}
          durationPop={800}
          closePanel={() => setFilterDateShow(false)}
          content={
            <FilterDateRange
              closePanel={() => setFilterDateShow(false)}
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
            />
          }
        />
      )} */}
      <Modal
        animationType={'slide'}
        visible={filterDateShow}
        onBackdropPress={() => setFilterDateShow(false)}
        transparent={true}>
        <TouchableOpacity
          onPress={() => setFilterDateShow(false)}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              height: '67%',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              backgroundColor: '#FFF',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            <CalendarList
              containerStyle={{
                flex: 1,
                position: 'relative',
                paddingBottom: 60,
                paddingTop: 10,
                backgroundColor: 'white',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
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
              toolBarCancelStyle={[{fontSize: 14}]}
              toolBarConfirmStyle={[
                gStyles.btnSecondary,
                gStyles.btnSecondaryText,
                {
                  fontSize: 14,
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
                position: 'absolute',
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
                setFilterDateShow(false);
                // closePanel();
              }}
              cancel={() => {
                setFilterDateShow(false);
                // closePanel();
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default BalanceHistory;

// const BalanceItemOld = ({, offer_id, time, amount, transactionType}) => {
//   return (
//     <View style={styles.itemTitle}>
//       <Text style={gStyles.text(12, '400', '#797B8A')}>{time}</Text>
//       <View style={styles.itemContent}>
//         <Text style={gStyles.text(14, '500', '#313447')}>
//           {transactionType}
//         </Text>
//         <Text style={gStyles.text(14, '400', '#149614')}>{amount}</Text>
//       </View>
//       <View style={styles.line} />
//     </View>
//   );
// };
const BalanceItem = ({
  navigation,
  riwayat,
  date,
  offer,
  amount,
  status,
  type,
}) => {
  return (
    <TouchableOpacity
      style={[styles.itemTitle]}
      onPress={() => navigation.navigate('BalanceDetail', riwayat)}>
      <View style={[gStyles.row_center2, {alignItems: 'flex-start'}]}>
        <View style={gStyles.col}>
          <Text style={gStyles.text(12, '400', '#797B8A')}>{offer}</Text>
          <Text style={gStyles.text(12, '400', '#797B8A')}>
            {format_tanggal_indo(new Date(date))}
          </Text>
        </View>
        <BadgeStatus status={status} />
      </View>
      <View style={styles.line} />

      <View style={styles.itemContent}>
        <Text style={gStyles.text(14, '500', '#797B8A')}>
          Total{' '}
          {type === 'current_transaction'
            ? 'transaksi saat ini'
            : 'saldo piutang'}
        </Text>
        <Text style={gStyles.text(14, '400', 'black')}>
          Rp. {delimiterFormat(amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filterDate: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderColor: '#CBCCD1',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
  },
  date: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F6F7',
  },
  itemTitle: {padding: 6},
  itemContent: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    marginTop: 12,
    height: 1,
    backgroundColor: '#E3E3E5',
  },
});
