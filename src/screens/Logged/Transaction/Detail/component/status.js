import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../../../Penawaran/styles';
import {gStyles} from '../../../../../utils/styles';
import {IconDownArrow} from '../../../../../assets';
import {statusList} from '../../../../../components';
import {format_date_penawaran} from '../../../../../utils/helpers/date';

const StatusComponent = ({status, DataLog}) => {
  const [StatusTrx, setStatusTrx] = useState(statusList[0]);
  const [ShowDetail, setShowDetail] = useState(false);

  useEffect(() => {
    let findStatus;
    if (status === 1 && DataLog.find(log => log.status === 'Request Sample')) {
      findStatus = {
        id: 1,
        name: DataLog[0].status === 'Sample Ditolak' ? 'Dibatalkan' : 'Baru',
        description: DataLog[0].description,
        status: DataLog[0].status,
        color: DataLog[0].status === 'Sample Ditolak' ? '#D80909' : '#2E3192',
        bg: DataLog[0].status === 'Sample Ditolak' ? '#FFEBEB' : '#EBF0FF',
        kategori: 'active',
      };
    } else {
      findStatus = statusList.find(stat => stat.id === status);
    }
    // console.log('status', status);
    // console.log('statusList', statusList);
    console.log('findStatus', findStatus);
    if (findStatus) {
      setStatusTrx(findStatus);
    } else {
      setStatusTrx({
        id: 1,
        name: 'Baru',
        description: 'Permintaan survey sedang diajukan.',
        status: 'Request Sample',
        color: '#2E3192',
        bg: '#EBF0FF',
        kategori: 'active',
      });
    }
  }, [status]);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShowDetail(!ShowDetail)}
        disabled={StatusTrx.id === 1}
        style={[
          styles.borderStatus,
          {
            borderLeftColor: StatusTrx.color,
          },
        ]}>
        <View style={gStyles.row}>
          <Text style={[gStyles.text(14, '700', '#313447'), {lineHeight: 25}]}>
            {StatusTrx.name}
          </Text>
          {StatusTrx.id > 1 && (
            <View
              style={{
                padding: 5,
                transform: [{rotateX: ShowDetail ? '180deg' : '0deg'}],
              }}>
              <IconDownArrow />
            </View>
          )}
        </View>
        <Text style={[gStyles.text(14, '400', '#797B8A'), {lineHeight: 20}]}>
          {StatusTrx.description}
        </Text>
      </TouchableOpacity>
      {ShowDetail && StatusTrx.id > 1 && DataLog && (
        <View style={gStyles.col}>
          <Text
            style={[gStyles.text(12, '500', '#797B8A'), {paddingVertical: 8}]}>
            Detail Status
          </Text>
          {DataLog.map((log, i) => (
            <View style={[gStyles.row_2, styles.progres]} key={i + log.status}>
              <View
                style={[
                  styles.dot,
                  i == 0 ? styles.activeDot : styles.inactiveDot,
                ]}
              />
              <View
                style={[
                  styles.progresDetail,
                  {borderLeftColor: i === 0 ? '#2E3192' : '#E3E3E5'},
                ]}>
                <View style={gStyles.row_2}>
                  <Text
                    style={gStyles.text(
                      12,
                      '400',
                      i == 0 ? '#313447' : '#93959E',
                    )}>
                    {log.status} -{' '}
                  </Text>
                  <Text
                    style={gStyles.text(
                      12,
                      '400',
                      i == 0 ? '#313447' : '#93959E',
                    )}>
                    {format_date_penawaran(log.created_at, true)}
                    {/* Sabtu, 4 Feb 2023, 13:00 WIT */}
                  </Text>
                </View>
                <Text
                  style={[
                    gStyles.text(12, '400', i == 0 ? '#313447' : '#93959E'),
                    {lineHeight: 23},
                  ]}>
                  {log.description}
                </Text>
                {log.sub_description !== '' ? (
                  <Text
                    style={[
                      gStyles.text(10.5, '400', i == 0 ? '#313447' : '#93959E'),
                      {lineHeight: 10},
                    ]}>
                    {log.sub_description}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default StatusComponent;
