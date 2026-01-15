import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useDispatch, useSelector} from 'react-redux';
import {AppBar, LoadingAnimated, statusQuery} from '../../../../components';
import ListTransaksi from './ListTransaksi';
import AlertBottomPanel from '../../Home/component/AlertBottomPanel';
import {
  _handleAlertMessage,
  getListTransaksi,
  getOfferNumber,
} from '../../../../services';
import {AddSquare} from '../../../../assets';
import {colors} from '../../../../utils/styles';
// import EmptyTransaction from '../../Home/component/EmptyTransaction';
// import {gStyles} from '../../../../utils/styles';

const Transaksi = ({navigation, route}) => {
  const layout = useWindowDimensions();
  const dispatch = useDispatch();
  const {theme, loading} = useSelector(reducer => reducer.global);
  const {transactionActive, transactionFinish} = useSelector(
    reducer => reducer.penawaran,
  );

  const [firstLoad, setFirstLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBottomPanel, setShowBottomPanel] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'aktif', title: 'Aktif', status: 1},
    {key: 'selesai', title: 'Selesai', status: 2},
  ]);

  const [Params, setParams] = useState({
    page: 1,
    limit: 999999,
    status: statusQuery(),
  });
  const [ListDataTransaksi, setListDataTransaksi] = useState({
    active: transactionActive,
    finish: transactionFinish,
  });

  const handleBuatPenawaran = () => {
    dispatch(getOfferNumber())
      .then(res => {
        if (res.success) {
          navigation.navigate('BuatPenawaran');
        } else {
          if (res.message) {
            Alert.alert(res.message);
          } else {
            setShowBottomPanel(true);
          }
        }
      })
      .catch(err => console.log('err', err));
  };

  useEffect(() => {
    // console.log('route', route);
    if (route?.params?.new) {
      setFirstLoad(true);
    }
    loadListTransaksi();
  }, [navigation, route]);

  const loadListTransaksi = () => {
    const page = Params.page ? '&page=' + Params.page : '';
    const limit = Params.limit ? '&limit=' + Params.limit : '';
    const status = Params.status ? '&status=' + Params.status : '';
    // let type = index === 0 ? 'active' : 'finish';
    dispatch(
      getListTransaksi(
        `farmer/offer/list?${page}${limit}${status}&sort=created_at-`,
      ),
    )
      .then(res => {
        console.log('res index', res);
        if (res?.meta?.http_status === 200) {
          setListDataTransaksi(res.data);
        } else {
          console.log('res', res?.message);
          dispatch(_handleAlertMessage(res, 'success'));
          if (res?.message) {
            Alert.alert('Gagal mengambil data', res?.message);
          }
        }
        setFirstLoad(false);
      })
      .catch(err => {
        console.log('err', err);
        dispatch(_handleAlertMessage(err));
      });
  };

  const renderLabel = ({route, focused, color}) => (
    <Text style={{color, fontWeight: '500'}}>{route.title}</Text>
  );

  const renderScene = SceneMap({
    // aktif: p => ComponentList(p),
    // selesai: p => ComponentList(p),
    aktif: p => (
      <ListTransaksi
        route={p.route}
        navigation={navigation}
        handleBuatPenawaran={handleBuatPenawaran}
        ListTransaksi={ListDataTransaksi.active}
        // ListTransaksi={transactionActive}
        refreshing={refreshing}
        handleRefresh={loadListTransaksi}
        firstLoad={firstLoad}
      />
    ),
    selesai: p => (
      <ListTransaksi
        route={p.route}
        navigation={navigation}
        handleBuatPenawaran={handleBuatPenawaran}
        ListTransaksi={ListDataTransaksi.finish}
        // ListTransaksi={transactionFinish}
        refreshing={refreshing}
        handleRefresh={loadListTransaksi}
        firstLoad={firstLoad}
      />
    ),
  });

  return (
    <>
      <LoadingAnimated visible={loading} />
      <View style={[styles.container, {position: 'relative'}]}>
        <AppBar
          appBarColor={theme.backgroundColor}
          navigation={navigation}
          headerTextColor={theme.textColor}
          title="Transaksi"
          borderBottom
          borderBottomColor={theme.textColor}
          borderBottomHeight={1.5}
          titleStyle={styles.screenTitle}
          hideRightContent
          hideLeftContent
        />
        {/*
      <View> */}
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          // lazy
          // renderLazyPlaceholder={<LoadingAnimated visible={true} />}
          renderTabBar={props => (
            <TabBar
              {...props}
              inactiveColor={'gray'}
              activeColor={theme.activeIconColor}
              indicatorStyle={{backgroundColor: theme.activeIconColor}}
              style={{backgroundColor: 'white'}}
              getLabelText={({route}) => route.title}
              renderLabel={renderLabel}
            />
          )}
          // renderTabBar={TabComponent}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        />
        {/* </View> */}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => handleBuatPenawaran()}>
          <AddSquare width={24} height={24} />
        </TouchableOpacity>
      </View>
      <AlertBottomPanel
        navigation={navigation}
        showBottomPanel={showBottomPanel}
        setShowBottomPanel={setShowBottomPanel}
      />
    </>
  );
};

export default Transaksi;

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
    borderBottomColor: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
    elevation: 4, // for Android only
    shadowColor: '#000', // for iOS only
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
