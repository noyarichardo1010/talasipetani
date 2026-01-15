import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {gStyles} from '../../../../../utils/styles';
import {IconDownArrow, SurveyorProfile} from '../../../../../assets';
import styles from '../../../Penawaran/styles';
import {format_date_penawaran} from '../../../../../utils/helpers/date';

const Surveyor = ({DataSurvey}) => {
  const [ShowDetail, setShowDetail] = useState(false);
  return (
    <View style={[gStyles.col]}>
      <TouchableOpacity
        style={[gStyles.row_center3]}
        onPress={() => setShowDetail(!ShowDetail)}>
        <Image
          source={
            DataSurvey?.photo && DataSurvey?.photo !== ''
              ? {uri: DataSurvey?.photo}
              : SurveyorProfile
          }
          style={[styles.profileImage, {marginRight: 10}]}
        />
        <View style={gStyles.col}>
          <Text style={gStyles.text(14, '500', '#313447')}>
            {DataSurvey?.surveyor_name ?? ''}
          </Text>

          <View style={[gStyles.row_center, {width: 100}]}>
            <Text style={gStyles.text(12, '400', '#797B8A')}>
              Surveyor Talasi
            </Text>
            <View
              style={{
                transform: [{rotateX: ShowDetail ? '180deg' : '0deg'}],
              }}>
              <IconDownArrow />
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {ShowDetail && (
        <View
          style={[
            gStyles.col,
            {
              borderTopWidth: 1,
              marginTop: 8,
              paddingVertical: 8,
              borderColor: '#E3E3E6',
            },
          ]}>
          {DataSurvey.jadwal_survey && (
            <View style={[gStyles.row_center2, {paddingVertical: 3}]}>
              <Text style={gStyles.text(14, '400', '#797B8A')}>
                Jadwal Survey
              </Text>
              <Text style={gStyles.text(14, '400', '#313447')}>
                {format_date_penawaran(DataSurvey.jadwal_survey, true)}
              </Text>
            </View>
          )}
          {DataSurvey.survey_selesai && (
            <View style={[gStyles.row_center2, {paddingVertical: 3}]}>
              <Text style={gStyles.text(14, '400', '#797B8A')}>
                Survey Selesai
              </Text>
              <Text style={gStyles.text(14, '400', '#313447')}>
                {format_date_penawaran(DataSurvey.survey_selesai, true)}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default Surveyor;
