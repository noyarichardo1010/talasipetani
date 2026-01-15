import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors, gStyles} from '../../../utils/styles';
import {Button} from '../../atoms';

const ModalComponent = ({
  navigation,
  handleSubmit,
  cancel,
  title = 'title',
  desc = 'desc',
  textBtnSubmit = 'Ya',
  textBtnCancel = 'Cancel',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
      <View style={gStyles.row}>
        <Button
          title={textBtnSubmit}
          onPress={() => handleSubmit()}
          type="full"
          style={[gStyles.btnSecondary, gStyles.marginRight(5)]}
          textStyle={gStyles.btnSecondaryText}
        />
        <Button
          title={textBtnCancel}
          onPress={() => cancel()}
          type="outline"
          style={[gStyles.btnSecondaryOutline, gStyles.marginRight(0)]}
          textStyle={gStyles.btnSecondaryOutlineText}
        />
      </View>
    </View>
  );
};

export default ModalComponent;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'left',
    color: colors.black,
  },
  desc: {
    textAlign: 'left',
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '400',
    color: colors.grey,
  },
});
