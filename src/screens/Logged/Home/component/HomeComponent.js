import React from 'react';
import {Container, LoadingAnimated} from '../../../../components';
// import PropTypes from 'prop-types';
import {View} from 'react-native';

import DashboardAkunLama from './DashboardAkunLama';
import TransaksiSaatIni from './TransaksiSaatIni';
import UpdateHariIni from './UpdateHariIni';

const HomeComponent = props => {
  const {data, goToBalanceHistory, navigation, handleBuatPenawaran} = props;
  return (
    <View>
      <Container>
        {/* {userType === 'Akun Baru' ? (
          <>
            <DashboardAkunBaru
              balance={balance}
              totalTransaction={totalTransaction}
              transactionNow={transactionNow}
              goToBalanceHistory={goToBalanceHistory}
            />
            <Gap height={32} />
            {changeComodityList && (
              <ChangePriceList changePriceList={changeComodityList} />
            )}
            {newComodityList && (
              <View>
                <Gap height={16} />
                <NewComodityList comodityList={newComodityList} />
              </View>
            )}
            {buyingLocation && (
              <View>
                <Gap height={16} />
              </View>
            )}
            <View style={{paddingHorizontal: 16, flex: 1}}>
              <Text
                style={[
                  gStyles.textMdBold,
                  {color: colors.black, fontSize: 16},
                ]}>
                Transaksi Saat Ini
              </Text>
              <Gap height={8} />
              {transactions.map((item, i) => {
                return (
                  <ItemTransaction
                    key={i}
                    items={item?.items}
                    label={item?.label}
                    date={item.date}
                    transactionNumber={item?.transactionNumber}
                    totalOffer={item?.totalOffer}
                  />
                );
              })}
            </View>
          </>
        ) : (
          <> */}
        <DashboardAkunLama
          saldoPiutang={data?.balance?.current_receivables_balance}
          totalTransaksiPiutang={
            data?.balance?.total_current_receivables_balance
          }
          saldoTransaksiSaatIni={data?.balance?.current_transaction}
          totalTransaksiSaatIni={data?.balance?.total_current_transaction}
          goToBalanceHistory={goToBalanceHistory}
          navigation={navigation}
          haveNotif={data?.total_unread_notif > 0 ? true : false}
          haveDraft={data?.total_draft_offer > 0 ? true : false}
        />
        <TransaksiSaatIni
          data={data?.Offers}
          navigation={navigation}
          handleBuatPenawaran={handleBuatPenawaran}
        />
        <UpdateHariIni
          hargaKomoditi={data?.warehouse_commoditie_prices}
          komoditiTerbaru={data?.commodities}
          warehouse={data?.warehouses}
          navigation={navigation}
        />
        {/* </>
        )} */}
      </Container>
    </View>
  );
};

export default HomeComponent;

// HomeComponent.propTypes = {
//   balance: PropTypes.any,
// };
