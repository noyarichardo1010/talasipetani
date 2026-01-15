import {View, Text} from 'react-native';
import React from 'react';
import {gStyles} from '../../../utils/styles';
import statusList from './status-data';

const statusQuery = () => {
  let status = '';
  statusList
    .map(stat => {
      if (stat.status !== 'Draft') {
        if (status === '') {
          status = stat.status;
        } else {
          status = status + ',' + stat.status;
        }
      }
    })
    .filter(data => data);

  return status;
};

const CheckingStatus = st => {
  // console.log('st', st);
  let status = st.toLowerCase();
  let findStatus = statusList.find(
    stat => stat.status.toLowerCase() === status,
  );
  // console.log('findStatus', findStatus);
  if (findStatus) {
    return findStatus;
  }
  return {color: '#2E3192'};
};

const BadgeStatus = ({status, style, textColor, backgroundColor}) => {
  if (!status) {
    return <></>;
  }
  return (
    <Text
      style={[
        gStyles.text(
          12,
          '700',
          textColor ? textColor : CheckingStatus(status)?.color,
        ),
        {
          paddingVertical: 4,
          paddingHorizontal: 8,
          backgroundColor: backgroundColor
            ? backgroundColor
            : CheckingStatus(status)?.bg,
          borderRadius: 4,
        },
      ]}>
      {status}
    </Text>
  );
};

export {statusList, statusQuery, CheckingStatus};
export default BadgeStatus;
