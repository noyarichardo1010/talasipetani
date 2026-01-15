import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Box,
  BoxIcon,
  IconCloseCircle,
  IconLeftArrow,
  IconLoading,
  IconRightArrow,
  IconSearch,
} from '../../../../assets';
import {
  BottomPanel,
  Container,
  Gap,
  HeaderSearchBar,
  Input,
  LoadingAnimated,
} from '../../../../components';
import {gStyles} from '../../../../utils/styles';
import {useDispatch, useSelector} from 'react-redux';
import {getListKomoditi} from '../../../../services';
import {ImageProduct} from '../../../../components/atoms/Product';

const ListKomoditi = ({navigation}) => {
  const {theme, loading} = useSelector(reducer => reducer.global);
  const {listKomoditi} = useSelector(reducer => reducer.home);
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);
  const [ListKomoditi, setListKomoditi] = useState([]);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(true);

  const pageSize = 10;

  const handleLoadMore = () => {
    setLoadMoreLoading(true);
    setPage(page + 1);
  };

  useEffect(() => {
    getKomoditiList();
  }, [page]);

  const getKomoditiList = async () => {
    setLoading(true);
    await dispatch(getListKomoditi('/farmer/commoditie', page, pageSize)).then(
      res => {
        // console.log('redux listKomoditi', listKomoditi);
        // console.log('update komoditi hari ini', page, res);
        let newData = page === 1 ? res.data : ListKomoditi.concat(res.data);
        setListKomoditi(newData);
        if (res?.meta?.last_page === page) setLastPage(true);
        else setLastPage(false);
        setLoadMoreLoading(false);
      },
    );
    setLoading(false);
  };

  const handleRefresh = useCallback(() => {
    setPage(1);
    // setLastPage(false);
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
      let fill = ListKomoditi.filter(data => {
        const itemName = data.commoditie_name
          ? data.commoditie_name.toLowerCase()
          : '';
        const textName = text.toLowerCase();

        return itemName.indexOf(textName) > -1;
        // if(itemName)
      });

      setListKomoditi(fill);
    } else {
      setListKomoditi(listKomoditi);
    }
  };

  // useBackHandler(() => handleBack());
  // const handleBack = () => navigation.goBack();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <LoadingAnimated
        visible={Loading}
        // handleBack={() => handleBack()}
      />
      <HeaderSearchBar navigation={navigation} handleSearch={handleSearch} />

      <ScrollView
        style={[
          styles.bodyContent,
          {
            backgroundColor: theme.backgroundColor,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <View style={[gStyles.bottomBoxShadow(1, '#000')]} />
        {ListKomoditi.map((val, i) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('DetailHargaKomoditi', {
                idKomoditi: val.commoditie_id,
              })
            }
            key={i}
            style={styles.cardKomoditi}>
            {/* left */}
            <View style={gStyles.row}>
              <View style={[gStyles.boxWrapper]}>
                {/* <Image source={Box} style={gStyles.dimension(32, 32)} /> */}
                <ImageProduct
                  url={val?.commoditie_photos}
                  style={[
                    gStyles.dimension('100%', '100%'),
                    {borderRadius: 40},
                  ]}
                />
              </View>
              <View
                style={[
                  gStyles.marginLeft(5),
                  {
                    display: 'flex',
                    flexCenter: 'column',
                    alignItems: 'flex-start',
                  },
                ]}>
                <Text style={gStyles.text(14, '500', '#313447')}>
                  {val.commoditie_name}
                </Text>
                {val?.total_variant > 0 ? (
                  <Text style={gStyles.text(12, '400', '#797B8A')}>
                    {val.total_variant} varian
                  </Text>
                ) : null}
              </View>
            </View>

            <IconRightArrow fill={'#93959E'} width={15} height={15} />
          </TouchableOpacity>
        ))}
        <Gap height={12} />
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
        <Gap height={16} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListKomoditi;

const styles = StyleSheet.create({
  cardKomoditi: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#E3E3E5',
    borderBottomWidth: 1,
    margin: 12,
    marginTop: 0,
    paddingBottom: 15,
  },
  bodyContent: {
    display: 'flex',
    padding: 16,
    flex: 1,
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
