import {View, Text, Image, Modal} from 'react-native';
import React from 'react';
import {BottomPanel, Button} from '../../../../components';
import {gStyles} from '../../../../utils/styles';
import {AlertProfile} from '../../../../assets';
import styles from '../styles';
import {useSelector} from 'react-redux';

const AlertBottomPanel = ({
  navigation,
  showBottomPanel,
  setShowBottomPanel,
}) => {
  const {userInfo} = useSelector(reducer => reducer.global);
  const {bankList} = useSelector(reducer => reducer.profile);

  const handleGoToProfile = () => {
    // console.log('userInfo?.farmer_profile', userInfo?.farmer_profile);
    const userProfile = userInfo?.farmer_profile;
    const emptyBank = bankList.length === 0;
    const emptyAddress =
      userProfile?.address &&
      userProfile?.address_map &&
      userProfile?.province_id &&
      userProfile?.village_id &&
      userProfile?.city_id &&
      userProfile?.lat &&
      userProfile?.long &&
      userProfile?.district_id;
    setShowBottomPanel(false);
    setTimeout(() => {
      navigation.navigate('ProfileScreen', {emptyAddress, emptyBank});
    }, 200);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showBottomPanel}
      onRequestClose={() => setShowBottomPanel(false)}>
      <BottomPanel
        closePanel={() => setShowBottomPanel(false)}
        height={'auto'}
        radius={12}
        clickOutsideToClosePanel
        showCloseBtn
        backgroundPanel="#fff"
        title={''}
        content={
          <View
            style={[
              gStyles.col_2,
              {marginBottom: 10, padding: 16, paddingTop: 0},
            ]}>
            <Image source={AlertProfile} style={{margin: 16}} />
            <Text style={gStyles.text(20, '700', '#313447')}>
              Lengkapi Profil Anda
            </Text>
            <Text
              style={[
                gStyles.text(14, '400', '#313447'),
                {marginTop: 8, marginBottom: 16, textAlign: 'center'},
              ]}>
              Lengkapi terlebih dahulu profil Anda sebelum bisa membuat
              Penawaran.
            </Text>
            <Button
              title={'Lengkapi Profile Sekarang'}
              onPress={() => handleGoToProfile()}
              type="full"
              style={styles.button}
              // textStyle={styles.buttonText}
            />
          </View>
        }
      />
    </Modal>
  );
};

export default AlertBottomPanel;
