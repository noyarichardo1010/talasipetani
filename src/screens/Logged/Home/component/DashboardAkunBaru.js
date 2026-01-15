import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, gStyles} from '../../../../utils/styles';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import {
  BGSplash,
  HistoryPrimary,
  Logo,
  Message,
  NotificationOn,
} from '../../../../assets';
import {Button, Gap} from '../../../../components';
import styles from '../styles';

const DashboardAkunBaru = ({
  balance,
  totalTransaction,
  transactionNow,
  goToBalanceHistory,
}) => {
  return (
    <ImageBackground
      source={BGSplash}
      resizeMode="cover"
      style={styles.backgroundImage}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
        style={styles.gradient}
      />
      <View>
        <View style={styles.header}>
          <Image source={Logo} style={styles.logo} resizeMode={'stretch'} />
          <View style={{flexDirection: 'row'}}>
            <Message width={24} height={24} />
            <Gap width={16} />
            <NotificationOn width={24} height={24} />
          </View>
        </View>
        <View style={styles.dashboard}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <Text style={[gStyles.textSmRegular, {color: colors.grey}]}>
                Saldo Piutang
              </Text>
              <Gap height={4} />
              <Text style={[gStyles.textMdBold, {color: colors.black}]}>
                {balance}
              </Text>
              <Gap height={4} />
              <Text style={[gStyles.textSmRegular, {color: colors.primary}]}>
                {totalTransaction} Transaksi
              </Text>
            </View>
            <View
              style={{
                width: 1,
                height: '100%',
                backgroundColor: colors.neutral,
              }}
            />
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <Text style={[gStyles.textSmRegular, {color: colors.grey}]}>
                Transaksi Saat Ini
              </Text>
              <Gap height={4} />
              <Text style={[gStyles.textMdBold, {color: colors.black}]}>
                {transactionNow}
              </Text>
              <Gap height={4} />
              <Text style={[gStyles.textSmRegular, {color: colors.primary}]}>
                {totalTransaction} Transaksi
              </Text>
            </View>
          </View>
          <Gap height={16} />
          <Button
            title={'Riwayat'}
            onPress={goToBalanceHistory}
            left={<HistoryPrimary />}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default DashboardAkunBaru;
