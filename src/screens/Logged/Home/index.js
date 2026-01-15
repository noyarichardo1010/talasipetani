import {
  View,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import styles from './styles';

import {useDispatch, useSelector} from 'react-redux';
import HomeComponent from './component/HomeComponent';
import API from '../../../services/api';
import {gStyles} from '../../../utils/styles';
import {
  getOfferNumber,
  getVersion,
  setLoading,
  setSelectedKupon,
} from '../../../services';
import AlertBottomPanel from './component/AlertBottomPanel';
import {AddSquare} from '../../../assets';
import {LoadingAnimated, Button} from '../../../components';
import DeviceInfo from 'react-native-device-info';
import NewUpdate from './component/NewUpdate';

const PetaniHome = ({route, navigation}) => {
  const {loading, userInfo} = useSelector(reducer => reducer.global);
  const {userType, setUserType} = useState('Akun Lama'); //ganti nanti untuk melihat dashboard akun lama atau akun beda
  // console.log('userInfo', userInfo);
  const dispatch = useDispatch();

  const [needUpdate, setNeedUpdate] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showBottomPanel, setShowBottomPanel] = useState(false);

  const [data, setData] = useState({
    Offers: [],
    balance: null,
    warehouse_commoditie_prices: [],
    commodities: [],
    warehouses: [],
  });
  const goToBalanceHistory = () => {
    navigation.navigate('BalanceHistory');
  };

  const getver = async () => {
    await dispatch(getVersion())
      .then(res => {
        if (res.success && res.data) {
          if (res.data?.version === DeviceInfo.getVersion()) {
            console.log(
              '=== Versi sama === ',
              res.data?.version,
              DeviceInfo.getVersion(),
            );
            setNeedUpdate(false);
          } else {
            setNeedUpdate(res.data);
          }
        } else {
          setNeedUpdate(false);
        }
      })
      .catch(err => {
        console.log('err getver', err);
      });
    dispatch(setLoading(false));
  };

  const getDashboard = async () => {
    dispatch(setLoading(true));
    await API.get('farmer/dashboard?limit=3')
      .then(res => {
        console.log('get dashboard', res);
        setData(res.data);
      })
      .catch(err => {
        console.log('err get dashboard', err);
      });
    dispatch(setLoading(false));
  };

  const handleBuatPenawaran = async () => {
    await dispatch(getOfferNumber())
      .then(res => {
        console.log('res handleBuatPenawaran', res);
        dispatch(setSelectedKupon(null));
        if (res.success) {
          navigation.navigate('BuatPenawaran');
        } else if (res.message) {
          Alert.alert(res.message);
        } else {
          setShowBottomPanel(true);
        }
      })
      .catch(err => {
        console.log('err', err);
        Alert.alert(err?.message);
      });
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    getDashboard();
    setRefreshing(false);
    getver();
  }, []);

  useEffect(() => {
    setNeedUpdate(false);
    const unsubscribe = navigation.addListener('focus', () => {
      handleRefresh();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={[gStyles.screenContainer('#fff'), {flex: 1}]}>
      <NewUpdate needUpdate={needUpdate} setNeedUpdate={setNeedUpdate} />
      <LoadingAnimated visible={loading} />
      <ScrollView
        style={{flex: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <HomeComponent
          data={data}
          goToBalanceHistory={goToBalanceHistory}
          navigation={navigation}
          refreshing={refreshing}
          setRefreshing={setRefreshing}
          handleBuatPenawaran={handleBuatPenawaran}
        />
      </ScrollView>
      {data?.Offers?.length > 0 ? (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => handleBuatPenawaran()}>
          <AddSquare width={24} height={24} />
        </TouchableOpacity>
      ) : null}
      <AlertBottomPanel
        navigation={navigation}
        showBottomPanel={showBottomPanel}
        setShowBottomPanel={setShowBottomPanel}
      />
    </View>
  );
};

export default PetaniHome;
