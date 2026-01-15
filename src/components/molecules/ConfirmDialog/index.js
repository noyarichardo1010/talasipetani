import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {gStyles} from '../../../utils/styles';

let {height, width} = Dimensions.get('window');

const ConfirmDialog = ({
  confirmTitle,
  confirmDesc,
  textCancel,
  textNext,
  confirmType = 'next-process',
  handleNext,
  handleCancel,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper} />
      <View style={styles.wrapperBoxConfirmDialog}>
        <View style={styles.boxConfirmDialog}>
          <Text style={styles.confirmTitle}>{confirmTitle}</Text>
          <Text style={styles.confirmDesc}>{confirmDesc}</Text>
          <View style={styles.wrapperButtonConfirmDialog}>
            {confirmType === 'cancel-process' ? (
              <>
                <TouchableOpacity
                  onPress={handleNext}
                  style={styles.textButton}>
                  <Text style={gStyles.textRed}>{textNext}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCancel}
                  style={styles.buttonFullColor}>
                  <Text style={styles.textButtonFullColor}>{textCancel}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={handleCancel}
                  style={styles.textButton}>
                  <Text style={gStyles.textRed}>{textCancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNext}
                  style={styles.buttonFullColor}>
                  <Text style={styles.textButtonFullColor}>{textNext}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ConfirmDialog;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: width,
    height: height,
  },
  wrapper: {
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: '#092540',
    opacity: 0.25,
  },

  wrapperBoxConfirmDialog: {
    backgroundColor: '#fff',
    marginVertical: 312,
    marginHorizontal: 24,
    borderRadius: 8,
  },
  boxConfirmDialog: {
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 17,
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#092540',
    marginBottom: 8,
  },
  confirmDesc: {
    fontSize: 12,
    fontWeight: '400',
    color: '#687083',
    marginBottom: 24,
  },
  wrapperButtonConfirmDialog: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  textButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 6,
    marginRight: 13,
  },
  buttonFullColor: {
    backgroundColor: '#CF1701',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 45,
  },
  textButtonFullColor: {fontSize: 14, fontWeight: '600', color: '#fff'},
});
