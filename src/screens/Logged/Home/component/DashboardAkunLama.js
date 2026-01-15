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
import React from 'react';
import {
  BGDashboard,
  BGSplash,
  HistoryPrimary,
  IconEmptyWalletTime,
  IconRightArrow,
  Logo,
  Message,
  Notification,
  NotificationOn,
  TruckWithRed,
  Truck,
  WhiteLogo,
} from '../../../../assets';
import {Button, Gap} from '../../../../components';
import styles from '../styles';
import {delimiterFormat} from '../../../../utils/helpers/number';

const DashboardAkunLama = ({
  saldoPiutang,
  totalTransaksiPiutang,
  saldoTransaksiSaatIni,
  totalTransaksiSaatIni,
  goToBalanceHistory,
  navigation,
  haveNotif,
  haveDraft
}) => {
  return (
    <ImageBackground
      source={BGDashboard}
      resizeMode="cover"
      style={styles.wrapperDashboardAkunLama}>
      <View>
        <View style={styles.header}>
          <Image
            source={WhiteLogo}
            style={styles.logo}
            resizeMode={'stretch'}
          />
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            {haveDraft ? (
              <TruckWithRed fill="#ffffff" width={24} height={24} />
              ) : (
                <Truck fill="#ffffff" width={24} height={24} />
              )}
            </TouchableOpacity>

            <Gap width={16} />
            <TouchableOpacity onPress={() => navigation.navigate('ListChat')}>
              <Message fill="#ffffff" width={24} height={24} />
            </TouchableOpacity>

            <Gap width={16} />
            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}>
              {haveNotif ? (
                <NotificationOn fill="#ffffff" width={24} height={24} />
              ) : (
                <Notification fill="#ffffff" width={24} height={24} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.dashboardAkunLama}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <Text style={gStyles.text(12, '400', '#fff')}>Saldo Piutang</Text>
              <Gap height={4} />
              <Text style={gStyles.text(16, '700', '#fff')}>
                Rp {delimiterFormat(saldoPiutang)}
              </Text>
              <Gap height={4} />
              <Text style={gStyles.text(12, '400', '#fff')}>
                {totalTransaksiPiutang} Transaksi
              </Text>
            </View>
            <View
              style={{
                width: 1,
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.24)',
              }}
            />
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <Text style={gStyles.text(12, '400', '#fff')}>
                Transaksi Saat Ini
              </Text>
              <Gap height={4} />
              <Text style={gStyles.text(16, '700', '#fff')}>
                Rp {delimiterFormat(saldoTransaksiSaatIni)}
              </Text>
              <Gap height={4} />
              <Text style={gStyles.text(12, '400', '#fff')}>
                {totalTransaksiSaatIni} Transaksi
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            paddingLeft: 12,
            backgroundColor: '#fff',
            borderRadius: 8,
            marginBottom: 16,
            marginHorizontal: 16,
          }}
          onPress={goToBalanceHistory}>
          <IconEmptyWalletTime fill="#2E3192" width={20} height={20} />
          <Text
            style={[
              gStyles.text(14, '500', '#2E3192'),
              gStyles.marginLeft(8),
              gStyles.flex(1),
            ]}>
            Riwayat Saldo
          </Text>
          <IconRightArrow fill="#93959E" width={15} height={15} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default DashboardAkunLama;
