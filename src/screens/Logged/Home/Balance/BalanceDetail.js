import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {AppBar, LoadingAnimated, BadgeStatus} from '../../../../components';
import {IconCalendar, IconLeftArrow} from '../../../../assets';
import {colors, gStyles} from '../../../../utils/styles';
import {
  format_tanggal_indo,
  getTimeZoneIndo,
  tanggal_bulan_tahun,
} from '../../../../utils/helpers/date';
import API from '../../../../services/api';
import {delimiterFormat} from '../../../../utils/helpers/number';
// import {useBackHandler} from '@react-native-community/hooks';

const BalanceDetail = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {userInfo, theme} = useSelector(reducer => reducer.global);
  const [refreshing, setRefreshing] = useState(false);
  const [RiwayatSaldo, setRiwayatSaldo] = useState(null);
  const [DetailSaldo, setDetailSaldo] = useState(null);
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
    console.log('route', route);
    if (route?.params?.offer_id) {
      setRiwayatSaldo(route.params);
      getDetailSaldo(route?.params?.offer_id);
    }

    // console.log('selectedDate', selectedDate);
  }, [selectedDate]);

  const getDetailSaldo = async offer_id => {
    setIsLoading(true);
    await API.get(`/farmer/transaction/detail/${offer_id}`).then(res => {
      console.log('getDetailSaldo', res);
      if (res?.meta?.http_status === 200) {
        if (res?.data?.transactions) {
          setDetailSaldo(res.data.transactions);
        }
      }
    });
    setIsLoading(false);
  };

  const handleRefresh = useCallback(() => {
    getDetailSaldo();
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
      <LoadingAnimated visible={IsLoading} handleBack={() => handleBack()} />
      <AppBar
        appBarColor={theme.backgroundColor}
        navigation={navigation}
        headerTextColor={theme.textColor}
        hideRightContent
        iconLeft={
          <IconLeftArrow width={20} height={20} fill={theme.textColor} />
        }
        title={`Riwayat Transaksi ${
          RiwayatSaldo ? RiwayatSaldo.offer_number : ''
        }`}
        borderBottom
        borderBottomColor={theme.textColor}
      />
      {RiwayatSaldo && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: theme.backgroundColor,
            // padding: 16,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>
          <View>
            <View>
              {DetailSaldo && (
                <>
                  {DetailSaldo?.map(riwayat => (
                    <View key={riwayat.date}>
                      <View style={styles.date}>
                        <Text style={gStyles.text(12, '500', '#797B8A')}>
                          {format_tanggal_indo(new Date(riwayat.date))}
                        </Text>
                      </View>
                      {riwayat.transactions?.map(trx => (
                        <BalanceItem
                          key={trx.offer_id}
                          current={trx.current_value}
                          value={trx.value}
                          time={trx.hour_minutes}
                          date={trx.date}
                          type={trx.type}
                          name={trx.name}
                        />
                      ))}
                    </View>
                  ))}
                </>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default BalanceDetail;

const BalanceItem = ({current, value, time, type, name, date}) => {
  return (
    <View style={styles.itemTitle}>
      <Text style={gStyles.text(12, '400', '#797B8A')}>
        {time} {getTimeZoneIndo(date)}
      </Text>
      <View style={styles.itemContent}>
        <Text style={gStyles.text(14, '500', '#313447')}>{name}</Text>
        {value !== 0 && type !== 'current_receivables_balance' ? (
          <Text style={gStyles.text(14, '400', value < 0 ? 'red' : '#149614')}>
            {delimiterFormat(value, 'Rp. ')}
          </Text>
        ) : null}
      </View>
      <Text style={gStyles.text(12, '400', '#797B8A')}>
        Total{' '}
        {type === 'current_transaction'
          ? 'transaksi saat ini'
          : 'saldo piutang'}{' '}
        : {delimiterFormat(current, 'Rp. ')}
      </Text>
      <View style={styles.line} />
    </View>
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
  itemTitle: {padding: 12},
  itemContent: {
    marginVertical: 6,
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
