import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {colors, gStyles} from '../../../utils/styles';
import {AlertProfile} from '../../../assets';
import {Button} from '../../../components';

const ModalNotVerified = ({title, desc, btnText, onPressBtn}) => {
  return (
    <View
      style={[gStyles.col_2, {marginBottom: 30, padding: 16, paddingTop: 0}]}>
      <Image source={AlertProfile} style={{margin: 16}} />
      <Text style={[{textAlign: 'center'}, gStyles.text(20, '700', '#313447')]}>
        {title}
      </Text>
      <Text
        style={[
          gStyles.text(12, '400', '#313447'),
          {marginTop: 8, marginBottom: 16, textAlign: 'center'},
        ]}>
        {desc}
      </Text>
      <Button
        title={btnText}
        onPress={() => onPressBtn()}
        type="full"
        style={{
          paddingVertical: 13,
          borderRadius: 4,
          width: '100%',
          borderWidth: 1,
          borderColor: colors.primary,
        }}
      />
    </View>
  );
};

export default ModalNotVerified;

const styles = StyleSheet.create({});
