import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ImageBackground,
  Alert,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  AppBar,
  CustomAlert,
  Loading,
  LoadingAnimated,
} from '../../../../components';
import {
  BGBlue,
  BGGreen,
  IconLeftArrow,
  IconMail,
  IconRightArrow,
  IconSearch,
  IconWA,
} from '../../../../assets';
import {colors, gStyles} from '../../../../utils/styles';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import API, {getErrorResponse} from '../../../../services/api';
import {setAlert, setMessage, setMessageType} from '../../../../services';
import {useBackHandler} from '@react-native-community/hooks';

const PusatBantuan = ({navigation}) => {
  // useBackHandler(() => navigation.navigate('ProfileScreen'));
  const dispatch = useDispatch();
  const {theme, message, messageType, alert} = useSelector(
    reducer => reducer.global,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState('');
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getListPusatBantuan = (search = '') => {
    setIsLoading(true);
    console.log('getListPusatBantuan', search);
    API.get(
      `master/faq?page=1&limit=10&setIsLoadingsort=order_number&search=${search}`,
    )
      .then(res => {
        console.log('res list pusat bantuan', res);
        if (res?.meta?.http_status === 200) {
          setData(res.data.faqs);
        } else {
          console.log(
            'res?.response?.data?.errors',
            res?.response?.data?.errors,
          );
          const errMessage = getErrorResponse(res?.response?.data?.errors);
          // console.log('err response', errMessage);
          dispatch(setMessage(errMessage));
          dispatch(setMessageType('error'));
          dispatch(setAlert(true));
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getListPusatBantuan();
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    getListPusatBantuan();
    setInput('');
    setRefreshing(false);
  }, []);

  // useEffect(() => {
  //   // Hapus timer pencarian sebelumnya (jika ada)
  //   clearTimeout(timerId);

  //   // Membuat timer baru untuk mencari setelah 5 detik
  //   const timerId = setTimeout(() => {
  //     // Lakukan pencarian disini (misalnya dengan fungsi atau API call)
  //     // Misalnya: doSearch(searchText);
  //     console.log('Mencari...', input);
  //     getListPusatBantuan(input);
  //   }, 2000); // Tunggu 2000 milidetik (2 detik)
  // }, [input]);

  const handleSearch = () => {
    getListPusatBantuan(input);
  };

  const listBantuan = [
    {
      title: 'Cara mengubah kata sandi',
      onPress: () =>
        navigation.navigate('DetailPusatBantuan', {
          title: 'Cara mengubah kata sandi',
        }),
    },
    {
      title: 'Cara memulihkan kata sandi yang lupa',
      onPress: () =>
        navigation.navigate('DetailPusatBantuan', {
          title: 'Cara memulihkan kata sandi yang lupa',
        }),
    },
    {
      title: 'Cara menambahkan nomor handphone',
      onPress: () =>
        navigation.navigate('DetailPusatBantuan', {
          title: 'Cara menambahkan nomor handphone',
        }),
    },
    {
      title: 'Cara menambahkan rekening bank',
      onPress: () =>
        navigation.navigate('DetailPusatBantuan', {
          title: 'Cara menambahkan rekening bank',
        }),
    },
  ];

  return (
    <View style={styles.container}>
      <LoadingAnimated visible={isLoading} />
      <AppBar
        appBarColor={theme.backgroundColor}
        navigation={navigation}
        headerTextColor={theme.textColor}
        hideRightContent
        iconLeft={
          <IconLeftArrow width={20} height={20} fill={theme.textColor} />
        }
        title="Pusat Bantuan"
        borderBottom
        borderBottomColor={theme.textColor}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        style={{
          backgroundColor: theme.backgroundColor,
        }}>
        <View
          style={[
            styles.wrapper,
            {
              backgroundColor: theme.backgroundColor,
            },
          ]}>
          <View style={styles.searchField}>
            <TextInput
              style={[styles.field, {color: 'gray'}]}
              placeholder="Cari kata kunci"
              placeholderTextColor={theme.secondaryTextColor}
              onChangeText={text => setInput(text)}
              onSubmitEditing={() => handleSearch()}
              value={input}
            />
            <TouchableOpacity onPress={() => handleSearch()}>
              <IconSearch
                width={25}
                height={25}
                fill={theme.secondaryTextColor}
              />
            </TouchableOpacity>
          </View>
          {/* list bantuan */}
          <View style={gStyles.marginTop(12)}>
            {data.map((bantuan, i) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('DetailPusatBantuan', {
                    data: bantuan,
                  })
                }
                key={i}
                style={[
                  styles.listBantuan,
                  {
                    borderBottomColor: colors.neutral,
                  },
                ]}>
                <Text style={gStyles.text(14, '400', theme.textColor)}>
                  {bantuan.question}
                </Text>
                <IconRightArrow
                  fill={theme.secondaryTextColor}
                  width={14}
                  height={14}
                />
              </TouchableOpacity>
            ))}
          </View>
          {/* bantuan lainnya */}
          {/* <Text
            style={[
              gStyles.text(16, '700', theme.textColor),
              gStyles.marginTop(24),
              gStyles.marginBottom(12),
            ]}>
            Bantuan Lainnya
          </Text> */}
          {/* HUBUNGI LEWAT EMAIL */}

          {/* <TouchableWithoutFeedback
            onPress={() => navigation.navigate('ContactWithEmail')}>
            <View
              style={[
                styles.wrapperBantuanLainnya(8),
                {
                  backgroundColor: theme.activeIconColor,
                },
              ]}>
              <View style={styles.textBantuanLainnya}>
                <IconMail fill={'#fff'} width={30} height={30} />
                <Text
                  style={[
                    gStyles.text(14, '500', '#fff'),
                    gStyles.marginLeft(15),
                  ]}>
                  Hubungi Kami Lewat Email
                </Text>
              </View>

              <ImageBackground
                source={BGBlue}
                style={styles.imageBackgroundBantuanLainnya}
                resizeMode="cover"
                borderRadius={8}>
                <LinearGradient
                  colors={['#2E3192', 'rgba(46, 49, 146, 0)']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.gradient}
                />
              </ImageBackground>
            </View>
          </TouchableWithoutFeedback> */}
          {/* HUBUNGI LEWAT Whatsapp */}
          {/* <TouchableWithoutFeedback
            onPress={() => Alert.alert('open whatsapp')}>
            <View
              style={[
                styles.wrapperBantuanLainnya(8),
                gStyles.marginTop(12),
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  backgroundColor: '#149614',
                },
              ]}>
              <View style={styles.textBantuanLainnya}>
                <IconWA fill={'#fff'} width={30} height={30} />
                <Text
                  style={[
                    gStyles.text(14, '500', '#fff'),
                    gStyles.marginLeft(15),
                  ]}>
                  Hubungi Kami Lewat WhatsApp
                </Text>
              </View>

              <ImageBackground
                source={BGGreen}
                style={styles.imageBackgroundBantuanLainnya}
                resizeMode="cover"
                borderRadius={8}>
                <LinearGradient
                  colors={['#149617', 'rgba(20, 150, 23, 0)']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.gradient}
                />
              </ImageBackground>
            </View>
          </TouchableWithoutFeedback> */}
        </View>
      </ScrollView>
      {alert && (
        <CustomAlert
          text={message}
          handleClose={() => dispatch(setAlert(false))}
          type={messageType}
          alertType="bottom"
        />
      )}
    </View>
  );
};

export default PusatBantuan;
