import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Button} from '../../../components';
import {colors, gStyles} from '../../../utils/styles';

const ConfirmBottom = ({
  handleSubmit,
  cancel,
  title,
  desc,
  yesTitle = 'Iya',
  cancelTitle = 'Tidak',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
      <View style={gStyles.row}>
        <Button
          title={yesTitle}
          onPress={() => handleSubmit()}
          type="outline"
          style={styles.btnLogoutOutline}
          textStyle={styles.btnLogoutOutlineText}
        />
        <Button
          title={cancelTitle}
          onPress={() => cancel()}
          type="full"
          style={styles.btnLogout}
          textStyle={styles.btnLogoutText}
        />
      </View>
    </View>
  );
};

export default ConfirmBottom;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 20,
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
  btnLogoutOutline: {
    paddingVertical: 13,
    borderRadius: 4,
    flex: 1,
    borderColor: '#2A378E',
    borderWidth: 1,
    marginRight: 5,
  },
  btnLogout: {
    paddingVertical: 13,
    borderRadius: 4,
    backgroundColor: '#2A378E',
    flex: 1,
  },
  btnLogoutOutlineText: {
    color: '#2A378E',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  btnLogoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
