import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  Splash,
  Login,
  Register,
  ForgotPassword,
  NewPassword,
  TermsAndConditions,
  EditProfile,
  ChangePassword,
  PhoneNumber,
  RekeningBank,
  ChangeAddress,
  PickLocation,
  PusatBantuan,
  DetailTransaksi,
  BalanceHistory,
  BuatPenawaran,
  RoomChat,
  WarehouseLocation,
  WarehouseDetail,
  PerubahanHargaKomoditi,
  DetailHargaKomoditi,
  ListKomoditi,
  CameraDocument,
  DetailPusatBantuan,
  ContactWithEmail,
  TentangAplikasi,
  KuponDetail,
  WarehouseMap,
  BalanceDetail,
  ListChat,
  Panggilan,
} from '../../screens';
import {BottomTabs} from './bottom-tabs';
import {NotificationScreen} from '../../components';
import ListCart from '../../screens/Logged/Penawaran/Cart';
import EditCart from '../../screens/Logged/Penawaran/Cart/Edit';

const AuthStack = createNativeStackNavigator();
const LoggedStack = createNativeStackNavigator();

export const StackAuthScreen = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen name="Splash" component={Splash} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
      <AuthStack.Screen name="NewPassword" component={NewPassword} />
      <AuthStack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
      />
      <AuthStack.Screen name="PickLocation" component={PickLocation} />
      <AuthStack.Screen name="PusatBantuan" component={PusatBantuan} />
      <AuthStack.Screen
        name="DetailPusatBantuan"
        component={DetailPusatBantuan}
      />
    </AuthStack.Navigator>
  );
};

export const StackLoggedScreen = () => {
  return (
    <LoggedStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <LoggedStack.Screen name="Home" component={BottomTabs} />
      <LoggedStack.Screen name="BalanceHistory" component={BalanceHistory} />
      <LoggedStack.Screen name="BalanceDetail" component={BalanceDetail} />
      <LoggedStack.Screen name="EditProfile" component={EditProfile} />
      <LoggedStack.Screen name="PhoneNumber" component={PhoneNumber} />
      <LoggedStack.Screen name="ChangeAddress" component={ChangeAddress} />
      <LoggedStack.Screen name="PickLocation" component={PickLocation} />
      <LoggedStack.Screen name="RekeningBank" component={RekeningBank} />
      <LoggedStack.Screen name="ChangePassword" component={ChangePassword} />
      <LoggedStack.Screen name="PusatBantuan" component={PusatBantuan} />
      <LoggedStack.Screen name="Panggilan" component={Panggilan} />
      <LoggedStack.Screen
        name="DetailPusatBantuan"
        component={DetailPusatBantuan}
      />
      <LoggedStack.Screen
        name="ContactWithEmail"
        component={ContactWithEmail}
      />
      <LoggedStack.Screen name="BuatPenawaran" component={BuatPenawaran} />
      <LoggedStack.Screen name="DetailTransaksi" component={DetailTransaksi} />
      <LoggedStack.Screen name="Cart" component={ListCart} />
      <LoggedStack.Screen name="EditCart" component={EditCart} />
      <LoggedStack.Screen name="ListChat" component={ListChat} />
      <LoggedStack.Screen name="RoomChat" component={RoomChat} />
      <LoggedStack.Screen name="Notification" component={NotificationScreen} />
      <LoggedStack.Screen name="CameraDocument" component={CameraDocument} />
      <LoggedStack.Screen
        name="WarehouseLocation"
        component={WarehouseLocation}
      />
      <LoggedStack.Screen name="WarehouseMap" component={WarehouseMap} />
      <LoggedStack.Screen name="WarehouseDetail" component={WarehouseDetail} />
      <LoggedStack.Screen name="KuponDetail" component={KuponDetail} />
      <LoggedStack.Screen name="ListKomoditi" component={ListKomoditi} />
      <LoggedStack.Screen
        name="PerubahanHargaKomoditi"
        component={PerubahanHargaKomoditi}
      />
      <LoggedStack.Screen
        name="DetailHargaKomoditi"
        component={DetailHargaKomoditi}
      />
      <LoggedStack.Screen name="TentangAplikasi" component={TentangAplikasi} />
    </LoggedStack.Navigator>
  );
};
