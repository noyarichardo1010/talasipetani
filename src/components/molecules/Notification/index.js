import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AppBar from '../AppBar';
import {IconLeftArrow} from '../../../assets';
import {colors, gStyles} from '../../../utils/styles';
import API from '../../../services/api';
import {setNotification} from '../../../services';
import {format_tanggal_indo} from '../../../utils/helpers/date';
import {Gap, LoadingAnimated} from '../../atoms';
// import {useBackHandler} from '@react-native-community/hooks';

const NotificationScreen = ({navigation}) => {
  const {theme, listNotifications} = useSelector(reducer => reducer.global);
  const dispatch = useDispatch();

  const [NotificationData, setNotificationData] = useState(listNotifications);
  const [Loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [Search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const pageSize = 9;

  // console.log('warehouse active', warehouseTabActive);
  useEffect(() => {
    // console.log('page', page)
    getNotification();
  }, [page]);

  const getNotification = useCallback(async () => {
    setLoading(true);
    // await API.get(`notifications?page=${page}&limit=${pageSize}`)
    await API.get(`notifications?page=${page}&limit=${pageSize}`)
      .then(res => {
        console.log('getNotification', res);
        if (res?.meta?.http_status === 200)
          if (res?.data) {
            let newData =
              page === 1 ? res.data : listNotifications.concat(res.data);
            setNotificationData(newData);
            dispatch(setNotification(newData));
            if (res?.meta?.last_page === page) setLastPage(true);
            else setLastPage(false);
          }
      })
      .catch(err => console.log('err', err));
    setLoading(false);
    setLoadMoreLoading(false);
  }, [page, pageSize]);

  const readNotification = async id => {
    setLoading(true);
    await API.put(`notifications/mark-read/${id}`)
      .then(res => {
        setLoading(false);
        console.log('res', res);
        return true;
      })
      .catch(err => console.log('err', err));
    setLoading(false);
  };
  const handleLoadMore = () => {
    setLoadMoreLoading(true);
    setPage(page + 1);
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    getNotification();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleRefresh();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  // useBackHandler(() => handleBack());
  // const handleBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <LoadingAnimated
        visible={Loading}
        // handleBack={() => handleBack()}
      />
      <AppBar
        appBarColor={theme.backgroundColor}
        navigation={navigation}
        headerTextColor={theme.textColor}
        hideRightContent
        iconLeft={<IconLeftArrow width={18} height={18} fill={'#797B8A'} />}
        title="Notifikasi"
        borderBottom
        borderBottomColor={theme.textColor}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        style={{
          backgroundColor: theme.backgroundColor,
        }}>
        <View
          style={[
            styles.wrapper,
            {
              backgroundColor: theme.backgroundColor,
            },
          ]}>
          {NotificationData?.map((notif, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                // console.log('notif', notif);
                readNotification(notif?.id);
                switch (notif.content_type) {
                  case 'OFFER':
                    navigation.navigate('DetailTransaksi', notif);
                    break;
                  case 'balance': // ini
                    navigation.navigate('BalanceHistory', notif);
                    break;

                  default:
                    break;
                }
              }}
              style={[
                styles.notifItems,
                {
                  backgroundColor:
                    notif?.is_read_flag === 'N' ? '#EBF0FF' : '#FFFFFF',
                  borderBottomColor: '#E3E3E5',
                },
              ]}>
              <Text
                style={[
                  gStyles.text(12, '400', '#797B8A'),
                  gStyles.marginBottom(4),
                ]}>
                {notif?.created_at
                  ? format_tanggal_indo(new Date(notif.created_at))
                  : format_tanggal_indo(new Date())}
              </Text>
              <Text
                style={[
                  gStyles.text(14, '700', '#313447'),
                  gStyles.marginBottom(4),
                ]}>
                {notif?.title ?? 'TITLE NOTIFICATION'}
              </Text>
              <Text style={gStyles.text(14, '400', '#797B8A')}>
                {notif?.description ?? 'NOTIFICATION DESCRIPTION.'}
              </Text>
            </TouchableOpacity>
          ))}
          <Gap height={16} />
          {lastPage ? null : (
            <View style={styles.wrapperLoadMore}>
              <TouchableOpacity
                disabled={loadMoreLoading}
                style={[
                  styles.btnLoadMore,
                  {
                    backgroundColor: loadMoreLoading ? '#F5F6F7' : 'white',
                    opacity: loadMoreLoading ? 0.5 : 1,
                  },
                ]}
                onPress={handleLoadMore}>
                {/* {loadMoreLoading ? ( */}
                <Text style={gStyles.text(14, '600', '#1E1E1F')}>
                  Load More
                </Text>
                {/* )} */}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    padding: 0,
  },
  notifItems: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  wrapperLoadMore: {marginTop: 12, marginBottom: 14, marginHorizontal: 16},
  btnLoadMore: {
    minHeight: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BEBFC2',
  },
});
