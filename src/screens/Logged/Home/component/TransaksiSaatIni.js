import {Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {gStyles} from '../../../../utils/styles';
import {CardTransaksi} from '../../../../components';
import EmptyTransaction from './EmptyTransaction';

const TransaksiSaatIni = ({data, navigation, handleBuatPenawaran}) => {
  // console.log('data', data);
  return (
    <View style={gStyles.padding(16)}>
      <View style={[gStyles.row, gStyles.marginBottom(12)]}>
        <Text style={gStyles.text(16, '700', '#313447')}>
          Transaksi Saat Ini
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('TransactionScreen')}>
          <Text style={gStyles.text(14, '500', '#2E3192')}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>
      {data?.length > 0 ? (
        data.map((transaksi, i) => (
          <CardTransaksi
            key={i}
            no={transaksi.offer_number}
            date={transaksi.offer_date}
            totalPrice={transaksi.total_price_offer}
            products={transaksi.offer_commodities}
            status={transaksi.status}
            onPress={() =>
              navigation.navigate('DetailTransaksi', {...transaksi})
            }
          />
        ))
      ) : (
        <View
          style={[
            gStyles.col_2,
            {
              backgroundColor: '#F5F6F7',
              padding: 24,
              borderWidth: 1,
              borderColor: '#E3E3E5',
              borderRadius: 4,
            },
          ]}>
          <EmptyTransaction handleBuatPenawaran={handleBuatPenawaran} />
        </View>
      )}
    </View>
  );
};

export default TransaksiSaatIni;
