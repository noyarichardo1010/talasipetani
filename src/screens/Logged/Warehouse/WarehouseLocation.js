import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {gStyles} from '../../../utils/styles';
import {IconLeftArrow, IconSearch} from '../../../assets';
import {Gap, Input, LoadingAnimated} from '../../../components';
import List from './component/listWarehouse';
import {useDispatch, useSelector} from 'react-redux';
import {getListWarehouse} from '../../../services';

const WarehouseLocation = ({navigation}) => {
  const {theme, loading} = useSelector(reducer => reducer.global);
  // const {listWarehouse} = useSelector(reducer => reducer.home);
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);
  const [ListWarehouse, setListWarehouse] = useState([]);
  const [BaseListWarehouse, setBaseListWarehouse] = useState([]);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(true);

  const pageSize = 10;

  const handleLoadMore = () => {
    setLoadMoreLoading(true);
    setPage(page + 1);
  };

  useEffect(() => {
    getWarehouseList();
  }, [page]);

  const getWarehouseList = async () => {
    console.log('getWarehouseList');
    setLoading(true);
    await dispatch(getListWarehouse(page, pageSize)).then(res => {
      // console.log('redux listWarehouse', listWarehouse);
      console.log('update warehouse hari ini', page, res);
      let newData = page === 1 ? res.data : ListWarehouse.concat(res.data);
      setListWarehouse(newData);
      setBaseListWarehouse(newData);
      if (res?.meta?.last_page === page) setLastPage(true);
      else setLastPage(false);
      setLoadMoreLoading(false);
    });
    setLoading(false);
  };

  const handleRefresh = useCallback(() => {
    setPage(1);
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleRefresh();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const handleSearch = text => {
    if (text) {
      let fill = ListWarehouse.filter(data => {
        const itemName = data.warehouse_name
          ? data.warehouse_name.toLowerCase()
          : data.city_name
          ? data.city_name.toLowerCase()
          : data.province_name
          ? data.province_name.toLowerCase()
          : data.village_name
          ? data.village_name.toLowerCase()
          : '';
        const textName = text.toLowerCase();

        return itemName.indexOf(textName) > -1;
        // if(itemName)
      });

      setListWarehouse(fill);
    } else {
      setListWarehouse(BaseListWarehouse);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <LoadingAnimated visible={Loading} />
      {/* Header Appp Bar */}
      <View style={[gStyles.contentHeader, gStyles.shadowTitle]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconLeftArrow fill={'#9AA2B1'} width={20} height={20} />
        </TouchableOpacity>
        <Input
          style={{marginLeft: 8, width: '92%', height: 40}}
          placeholder={'Cari Warehouse Hub'}
          onChangeText={val => handleSearch(val)}
        />
        <TouchableOpacity style={{position: 'absolute', right: 30}}>
          <IconSearch fill={'#CBCCD1'} width={20} height={20} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={gStyles.cardNoBorder}>
        {ListWarehouse?.map((w, i) => (
          <List key={i} warehouse={w} navigation={navigation} />
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
              <Text style={gStyles.text(14, '600', '#1E1E1F')}>Load More</Text>
              {/* )} */}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default WarehouseLocation;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filterWarehouse: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  cardNoBorder: {
    display: 'flex',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
  },
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
