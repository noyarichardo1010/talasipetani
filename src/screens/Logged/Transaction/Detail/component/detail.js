import {View, Text} from 'react-native';
import React from 'react';
import styles from '../../../Penawaran/styles';
import {gStyles} from '../../../../../utils/styles';
import StatusComponent from './status';
import {format_date_penawaran} from '../../../../../utils/helpers/date';
import {delimiterFormat} from '../../../../../utils/helpers/number';

const Detail = ({Status = 0, DataLog, DataOffer}) => {
  return (
    <>
      {DataOffer && (
        <View style={gStyles.row}>
          <Text style={[gStyles.text(14, '400', '#797B8A'), {lineHeight: 25}]}>
            No. Penawaran
          </Text>
          <Text style={gStyles.text(14, '400', '#313447')}>
            {DataOffer?.offer_number}
          </Text>
        </View>
      )}
      <View style={gStyles.row}>
        <Text style={[gStyles.text(14, '400', '#797B8A'), {lineHeight: 25}]}>
          Tgl. Pengajuan
        </Text>
        <Text style={gStyles.text(14, '400', '#313447')}>
          {format_date_penawaran(DataOffer?.offer_date)}
        </Text>
      </View>
      <View style={gStyles.row}>
        <Text style={[gStyles.text(14, '400', '#797B8A'), {lineHeight: 25}]}>
          Total Penawaran
        </Text>
        <Text style={gStyles.text(14, '400', '#313447')}>
          Rp. {delimiterFormat(DataOffer?.total_penawaran)}
        </Text>
      </View>
      {Status >= 6 && Status != 13 && (
        <>
          <View style={gStyles.row}>
            <Text
              style={[gStyles.text(14, '400', '#797B8A'), {lineHeight: 25}]}>
              Total Harga Disetujui
            </Text>
            <Text style={gStyles.text(14, '400', '#313447')}>
              Rp. {delimiterFormat(DataOffer?.total_harga_setujui)}
            </Text>
          </View>
        </>
      )}
      {Status >= 10 && Status != 13 && (
        <View style={gStyles.row}>
          <Text style={[gStyles.text(14, '500', '#000'), {lineHeight: 25}]}>
            Harga Akhir
          </Text>
          <Text style={gStyles.text(14, '800', '#07bc0c')}>
            Rp. {delimiterFormat(DataOffer?.total_akhir)}
          </Text>
        </View>
      )}

      {/* Status */}
      {Status !== 0 && <StatusComponent status={Status} DataLog={DataLog} />}
    </>
  );
};

export default Detail;
