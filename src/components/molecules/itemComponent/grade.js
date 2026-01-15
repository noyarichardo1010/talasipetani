import {View, Text} from 'react-native';
import React from 'react';
import {gStyles} from '../../../utils/styles';

const GradeItem = ({grade, style, gradeColor}) => {
  // console.log('grade', grade);
  // console.log('style', style);
  // console.log('gradeColor', gradeColor);

  const recheckGrade = grd => {
    let split = grd.split(' ');

    if (split.length > 1) {
      // return split[1];
      return grade;
    } else {
      return split[0];
    }
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
      }}>
      <Text style={[gStyles.gradeCard, gStyles[`${gradeColor}`], style]}>
        Grade {recheckGrade(grade)}
      </Text>
    </View>
  );
};

export default GradeItem;
