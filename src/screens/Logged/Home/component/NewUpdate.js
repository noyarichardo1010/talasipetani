import {View, Text, Modal, StyleSheet, Dimensions, Linking} from 'react-native';
import React from 'react';
import {Button} from '../../../../components';
import {gStyles} from '../../../../utils/styles';

let {height, width} = Dimensions.get('window');
const NewUpdate = props => {
  const {needUpdate, setNeedUpdate} = props;
  // console.log('NewUpdate needUpdate', needUpdate, Boolean(needUpdate));

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={Boolean(needUpdate)}
      onRequestClose={() => setNeedUpdate(false)}>
      <View style={[localStyles.wrapper]}>
        <View style={[localStyles.wrapper, localStyles.overlayBackground]} />
        <View
          style={[
            gStyles.col_2,
            gStyles.card,
            {
              padding: '5%',
              zIndex: 10,
              width: '90%',
            },
          ]}>
          <Text style={gStyles.text(20, '700', '#313447')}>
            Pembaharuan tersedia
          </Text>
          <Text
            style={[
              gStyles.text(14, '400', '#313447'),
              {marginTop: 8, marginBottom: 16, textAlign: 'center'},
            ]}>
            Silahkan melakukan update aplikasi anda.
          </Text>
          <View
            style={[
              gStyles.row_center,
              {
                width: '90%',
              },
            ]}>
            {needUpdate?.is_force_update_flag === 'N' && (
              <Button
                title={'Nanti saja'}
                onPress={() => setNeedUpdate(false)}
                type="outline"
                style={gStyles.btnSecondaryOutline}
                textStyle={gStyles.btnSecondaryOutlineText}
              />
            )}
            <Button
              title={'Update sekarang!'}
              onPress={() =>
                Linking.openURL(
                  'https://play.google.com/store/apps/details?id=com.talasipetani&hl=en',
                )
              }
              type="full"
              style={gStyles.btnSecondary}
              textStyle={gStyles.btnSecondaryText}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NewUpdate;

const localStyles = StyleSheet.create({
  wrapper: {
    opacity: 1,
    position: 'absolute',
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    elevation: 30,
  },
  overlayBackground: {
    zIndex: 1,
    elevation: 1,
    opacity: 0.3,
    backgroundColor: 'black',
  },
  image: {
    width: 100,
    height: 100,
    zIndex: 2,
    elevation: 2,
  },
});
