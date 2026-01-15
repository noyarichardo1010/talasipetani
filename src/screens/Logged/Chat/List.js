import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {AppBar, CustomAlert, Gap, Loading} from '../../../components';

import {IconLeftArrow} from '../../../assets';
import ActiveChat from './components/ActiveChat';
import PreviousChat from './components/PreviousChat';
import API, {getErrorResponse} from '../../../services/api';
import {
  setAlert,
  setAlertType,
  setLoading,
  setMessage,
  setMessageType,
} from '../../../services';

const ListChat = ({navigation}) => {
  const {theme, message, messageType, alert, alertType, loading} = useSelector(
    reducer => reducer.global,
  );
  const dispatch = useDispatch();
  const [listChat, setListChat] = useState([]);
  const [activeChat, setActiveChat] = useState([]);
  const [previousChat, setPreviousChat] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const goToRoomChat = chat => {
    navigation.navigate('RoomChat', {
      chat,
      type:
        chat?.is_finish_flag === 'Y' && chat?.is_active_flag === 'Y'
          ? 'history'
          : chat?.is_finish_flag === 'Y' || chat?.is_active_flag === 'Y'
          ? 'chat'
          : null,
    });
  };

  const pageSize = 10;

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const handleLoadMore = () => {
    setLoadMoreLoading(true);
    setPage(page + 1);
  };

  const createRoomChat = () => {
    dispatch(setLoading(true));

    API.get('farmer/chat/create-room')
      .then(res => {
        console.log('res create chat room', res);
        if (res?.meta?.http_status === 200) {
          getListChat();
          dispatch(setLoading(false));
        } else {
          const errMessage =
            getErrorResponse(res?.response?.data?.errors) ||
            res?.response?.data?.message ||
            res?.message;
          console.log('errMessage', errMessage);

          dispatch(setMessage(errMessage));
          dispatch(setMessageType('error'));
          dispatch(setAlertType('top'));
          dispatch(setLoading(false));
          dispatch(setAlert(true));
        }
      })
      .catch(err => {
        console.log('err create chat room', err);
        const errMessage =
          getErrorResponse(err?.response?.data?.errors) ||
          err?.response?.data?.message;
        console.log('errMessage', errMessage);

        dispatch(setMessage(errMessage));
        dispatch(setMessageType('error'));
        dispatch(setAlertType('top'));

        dispatch(setLoading(false));
        dispatch(setAlert(true));
      });
  };

  const getListChat = useCallback(() => {
    if (page !== 1) {
      API.get(`farmer/chat?page=${page}&limit=${pageSize}&sort=updated_at-`)
        .then(res => {
          console.log(`res get chat page ${page}`, res);
          const newData = listChat.concat(res.data.chat_room);
          // if (res.data.length < 1) {
          //   setLastPage(true);
          // }
          if (res.meta.last_page === page) {
            setLastPage(true);
          }

          console.log('newData', newData);
          // console.log('message', message);
          const active = newData?.filter(
            item => item.is_active_flag === 'Y' && item.is_finish_flag === 'N',
          );
          const previous = newData?.filter(item => item.is_finish_flag === 'Y');
          setActiveChat(active);
          setPreviousChat(previous);
          setListChat(newData);

          // Alert.alert('Berhasil melakukan sync data');
          // setAlert(true)
          setLoadMoreLoading(false);
        })
        .catch(err => {
          console.log('err get list chat petani', err);
        });
    } else {
      API.get(`farmer/chat?page=1&limit=${pageSize}&sort=updated_at-`)
        .then(res => {
          console.log('res get chat page 1', res);

          const active = res.data?.chat_room?.filter(
            item => item.is_active_flag === 'Y' && item.is_finish_flag === 'N',
          );
          const previous = res.data?.chat_room?.filter(
            item => item.is_finish_flag === 'Y',
          );
          setActiveChat(active);
          setPreviousChat(previous);

          setListChat(res.data);

          setLoadMoreLoading(false);
        })
        .catch(err => {
          console.log('err get list chat petani ', err);
        });
    }
  }, [page]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    getListChat();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleRefresh();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <AppBar
        appBarColor={theme.backgroundColor}
        navigation={navigation}
        headerTextColor={theme.textColor}
        hideRightContent
        iconLeft={
          <IconLeftArrow width={20} height={20} fill={theme.textColor} />
        }
        title="Chat"
        borderBottom
        borderBottomColor={theme.textColor}
      />

      {/* body content */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        style={{
          backgroundColor: '#F5F6F7',
        }}>
        <ActiveChat
          createRoomChat={createRoomChat}
          chats={activeChat}
          goToRoomChat={goToRoomChat}
        />
        <Gap height={16} />
        <PreviousChat chats={previousChat} goToRoomChat={goToRoomChat} />
        {/* <Gap height={16} />
        {lastPage ? null : (
          <View style={styles.wrapperLoadMore}>
            <TouchableOpacity
              style={styles.btnLoadMore}
              onPress={handleLoadMore}>
              {loadMoreLoading ? (
                <Lottie
                  style={gStyles.height(20)}
                  source={require('../../../assets/icon/loading.json')}
                  autoPlay
                  loop
                />
              ) : (
                <Text style={gStyles.text(14, '600', '#1E1E1F')}>
                  Load More
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )} */}
      </ScrollView>
      {loading && <Loading />}
      {alert ? (
        <CustomAlert
          text={message}
          handleClose={() => dispatch(setAlert(false))}
          type={messageType}
          alertType={alertType}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default ListChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 0,
  },
  bodyContent: {
    display: 'flex',
    padding: 16,
    flex: 1,
  },
  wrapperLoadMore: {marginTop: 12, marginBottom: 14, marginHorizontal: 16},
  btnLoadMore: {
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
