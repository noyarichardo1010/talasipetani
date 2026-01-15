import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {gStyles} from '../../../../utils/styles';
import {
  CardHargaKomoditi,
  CardKomoditi,
  EmptyStateUpdateHariIni,
} from '../../../../components';
import {
  IconArchive,
  IconLoading,
  IconMoneyRemove,
  IconWarehouse2,
} from '../../../../assets';
import {useDispatch, useSelector} from 'react-redux';
import {getListKomoditi} from '../../../../services';
import List from '../../Warehouse/component/listWarehouse';

const UpdateHariIni = ({
  hargaKomoditi,
  komoditiTerbaru,
  warehouse,
  navigation,
}) => {
  const [activeTabMenu, setActiveTabMenu] = useState('Harga');

  const _hargaKomoditiComponent = () => {
    return (
      <View style={styles.contentUpdateHariIni}>
        {hargaKomoditi?.length > 0 ? (
          <>
            {hargaKomoditi.map((hk, i) => (
              <>
                <CardHargaKomoditi
                  key={i}
                  data={hk}
                  warehouseName={hk.warehouse_name}
                  name={hk.commoditie_name}
                  prices={hk.commoditie_prices}
                  onPress={() =>
                    navigation.navigate('DetailHargaKomoditi', {
                      idKomoditi: hk.commoditie_id,
                    })
                  }
                />
              </>
            ))}
            <TouchableOpacity
              style={styles.btnSeeAll}
              onPress={() => navigation.navigate('PerubahanHargaKomoditi')}>
              <Text style={gStyles.text(14, '500', '#313447')}>
                Lihat Semua Harga Komoditi
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <EmptyStateUpdateHariIni
              icon={<IconMoneyRemove fill="#CBCCD1" width={64} height={64} />}
              title="Belum Ada Pembaruan Harga"
              desc="Harga Komoditi belum diperbarui."
            />
            <TouchableOpacity
              style={[styles.btnSeeAll, {marginTop: 10}]}
              onPress={() => navigation.navigate('PerubahanHargaKomoditi')}>
              <Text style={gStyles.text(14, '500', '#313447')}>
                Lihat Semua Harga Komoditi
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  const _komoditiTerbaruComponent = () => {
    return (
      <View style={styles.contentUpdateHariIni}>
        {komoditiTerbaru?.length > 0 ? (
          <>
            <View
              style={{
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
              {komoditiTerbaru.map(komoditi => (
                <CardKomoditi
                  onPress={() =>
                    navigation.navigate('DetailHargaKomoditi', {
                      idKomoditi: komoditi.commoditie_id, //untuk get detail harga komoditi
                    })
                  }
                  data={komoditi}
                  name={komoditi.commoditie_name}
                  totalVariant={komoditi.total_variant}
                />
              ))}
            </View>
            <TouchableOpacity
              style={styles.btnSeeAll}
              onPress={() => navigation.navigate('ListKomoditi')}>
              <Text style={gStyles.text(14, '500', '#313447')}>
                Lihat Semua Komoditi
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <EmptyStateUpdateHariIni
              icon={<IconArchive fill="#CBCCD1" width={64} height={64} />}
              title="Belum Ada Komoditi Baru"
              desc="Belum ada pembaruan komoditi."
            />
            <TouchableOpacity
              style={[styles.btnSeeAll, {marginTop: 10}]}
              onPress={() => navigation.navigate('ListKomoditi')}>
              <Text style={gStyles.text(14, '500', '#313447')}>
                Lihat Semua Komoditi
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  const _warehouseHubComponent = () => {
    return (
      <View style={styles.contentUpdateHariIni}>
        {warehouse?.length > 0 ? (
          <>
            {warehouse.map((w, i) => (
              <List key={i} warehouse={w} navigation={navigation} />
            ))}
            <TouchableOpacity
              style={styles.btnSeeAll}
              onPress={() => navigation.navigate('WarehouseLocation')}>
              <Text style={gStyles.text(14, '500', '#313447')}>
                Lihat Semua Warehouse Hub
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <EmptyStateUpdateHariIni
              icon={<IconWarehouse2 fill="#CBCCD1" width={64} height={64} />}
              title="Belum Ada Warehouse Baru"
              desc="Belum ada pembaruan warehouse."
            />
            <TouchableOpacity
              style={[styles.btnSeeAll, {marginTop: 10}]}
              onPress={() => navigation.navigate('WarehouseLocation')}>
              <Text style={gStyles.text(14, '500', '#313447')}>
                Lihat Semua Warehouse Hub
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  const updateHariIniMenu = [
    {title: 'Harga', componentName: _hargaKomoditiComponent},
    {title: 'Komoditi', componentName: _komoditiTerbaruComponent},
    {title: 'Warehouse Hub', componentName: _warehouseHubComponent},
  ];

  let updateHariIniActiveComponent = updateHariIniMenu.find(
    o => o.title === activeTabMenu,
  );

  return (
    <View style={gStyles.paddingHorizontal(16)}>
      <Text
        style={[gStyles.text(16, '700', '#313447'), gStyles.marginBottom(12)]}>
        Update Terbaru
      </Text>
      {/* horizontal scroll tab */}
      <ScrollView
        nestedScrollEnable={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {updateHariIniMenu.map((menu, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.tab,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                backgroundColor:
                  activeTabMenu === menu.title ? '#2E3192' : '#F5F6F7',
                marginRight: i === updateHariIniMenu.length - 1 ? 0 : 8,
              },
            ]}
            onPress={() => setActiveTabMenu(menu.title)}>
            <Text
              style={[
                styles.tabText,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  color: activeTabMenu === menu.title ? '#FFFFFF' : '#93959E',
                },
              ]}>
              {menu.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {updateHariIniActiveComponent.componentName()}
      {/* bikin screen untuk lihat list perubahan harga komoditi */}
    </View>
  );
};

export default UpdateHariIni;

const styles = StyleSheet.create({
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 40,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  contentUpdateHariIni: {
    marginVertical: 12,
  },
  btnSeeAll: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#F5F6F7',
    paddingVertical: 10,
  },
});
