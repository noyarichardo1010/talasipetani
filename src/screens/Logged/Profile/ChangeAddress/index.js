import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppBar,
  Button,
  Input,
  LoadingAnimated,
  Select,
} from '../../../../components';
import {IconLeftArrow} from '../../../../assets';
import {colors, gStyles} from '../../../../utils/styles';
import {
  setAlert,
  setLoading,
  setMessage,
  setMessageType,
} from '../../../../services';
import API, {
  editAddressPetani,
  getErrorResponse,
} from '../../../../services/api';
import {SET_EMPTY_ADDRESS} from '../../../../services/redux/action/list';
import {useBackHandler} from '@react-native-community/hooks';

const ChangeAddress = ({navigation}) => {
  const {theme, token, userInfo, loading} = useSelector(
    reducer => reducer.global,
  );
  const {pickedAddress} = useSelector(reducer => reducer.location);
  // console.log('userInfo', userInfo);
  const dispatch = useDispatch();
  const [provinces, setProvinces] = useState([]);
  const [provinceId, setProvinceId] = useState(
    userInfo?.farmer_profile?.province_id ?? 0,
  );

  const [cities, setCity] = useState([]);
  const [cityId, setCityId] = useState(userInfo?.farmer_profile?.city_id ?? 0);

  const [kecamatans, setKecamatans] = useState([]);
  const [kecamatanId, setKecamatanId] = useState(
    userInfo?.farmer_profile?.district_id ?? 0,
  );

  const [kelurahans, setKelurahans] = useState([]);
  const [kelurahanId, setKelurahanId] = useState(
    userInfo?.farmer_profile?.village_id ?? 0,
  );

  const [kodePos, setKodePos] = useState(
    userInfo?.farmer_profile?.postal_code ?? '',
  );

  const [data, setData] = useState({
    address: userInfo?.farmer_profile?.address ?? '',
  });

  const handleChange = (forField, value) => {
    setData({
      ...data,
      [forField]: value,
    });
  };
  const isDisabled = data.address === '' || data.koordinat === false;

  const handlePickLocation = () => {
    navigation.navigate('PickLocation');
  };

  useEffect(() => {
    dispatch(setLoading(true));
    API.get('master/province?page=1&limit=1000')
      .then(res => {
        // console.log('res provinces', res);
        const dt = res.data.provinces;
        const options = [];
        for (let i = 0; i < dt.length; i++) {
          options.push({id: dt[i].id, value: dt[i].id, label: dt[i].name});
        }
        options.sort((a, b) =>
          a.label.toUpperCase() > b.label.toUpperCase() ? 1 : -1,
        );
        setProvinces(options);
        dispatch(setLoading(false));
      })
      .catch(err => {
        console.log('err', err);
        dispatch(setLoading(false));
      });
  }, []);

  useEffect(() => {
    // console.log('provinceId', provinceId);

    if (provinceId !== 0) {
      API.get(`master/city?page=1&limit=1000&province_id=${provinceId}`)
        .then(res => {
          console.log('res get city', res);
          const dt = res.data.citys;
          const options = [];
          for (let i = 0; i < dt.length; i++) {
            options.push({id: dt[i].id, value: dt[i].id, label: dt[i].name});
          }
          options.sort((a, b) =>
            a.label.toUpperCase() > b.label.toUpperCase() ? 1 : -1,
          );
          // console.log('kota', options);

          setCity(options);
        })
        .catch(err => console.log('err', err));
    }
  }, [provinceId]);

  useEffect(() => {
    // console.log('cityId', cityId);
    if (cityId !== 0) {
      API.get(`master/district?page=1&limit=1000&city_id=${cityId}`)
        .then(res => {
          // console.log('res get distrik', res);
          const dt = res.data.districts;
          const options = [];
          for (let i = 0; i < dt.length; i++) {
            options.push({id: dt[i].id, value: dt[i].id, label: dt[i].name});
          }
          options.sort((a, b) =>
            a.label.toUpperCase() > b.label.toUpperCase() ? 1 : -1,
          );
          console.log('kecamatan', options);

          setKecamatans(options);
        })
        .catch(err => console.log('err get district', err));
    }
  }, [cityId]);

  useEffect(() => {
    // console.log('kecamatanId', kecamatanId);
    if (kecamatanId !== 0) {
      API.get(`master/village?page=1&limit=1000&district_id=${kecamatanId}`)
        .then(res => {
          // console.log('res get village', res);
          const dt = res.data.villages;
          const options = [];
          for (let i = 0; i < dt.length; i++) {
            options.push({
              id: dt[i].id,
              value: dt[i].id,
              label: dt[i].name,
              kodePos: dt[i].postal_code,
            });
          }
          options.sort((a, b) =>
            a.label.toUpperCase() > b.label.toUpperCase() ? 1 : -1,
          );
          // console.log('kelurahan', options);

          setKelurahans(options);
        })
        .catch(err => console.log('err get kecamatan / village', err));
    }
  }, [kecamatanId]);

  useEffect(() => {
    console.log('kelurahanId', kelurahanId);

    //dapatkan kode pos,
    const found = kelurahans.find(a => a.id === kelurahanId);

    if (found) {
      setKodePos(found?.kodePos);
    }
  }, [kelurahanId]);
  // console.log('isDisabled', isDisabled);

  //check apakah ada perubahan di inputan

  useEffect(() => {
    console.log('kodePos', kodePos);
  }, [kodePos]);
  const handleSave = () => {
    const formData = {
      ...data,
      province_id: provinceId,
      city_id: cityId,
      district_id: kecamatanId,
      village_id: kelurahanId,
      postal_code: kodePos,
      address_map: pickedAddress?.name
        ? pickedAddress.name
        : userInfo?.farmer_profile?.address_map,
      lat: pickedAddress.latitude
        ? pickedAddress.latitude?.toString()
        : userInfo?.farmer_profile?.lat,
      long: pickedAddress.longitude
        ? pickedAddress.longitude?.toString()
        : userInfo?.farmer_profile.long,
    };
    dispatch(setLoading(true));
    console.log('pickedAddress', pickedAddress);
    console.log('formData', formData);
    editAddressPetani(token, formData)
      .then(res => {
        console.log('res edit address petani', res);
        dispatch(setLoading(false));
        if (res.status === 200) {
          dispatch(setMessage('Profil Berhasil Diperbarui'));
          dispatch(setMessageType('success'));
          dispatch({type: SET_EMPTY_ADDRESS, value: false});
          dispatch(setAlert(true));
          navigation.goBack();
        } else {
          const errMessage = getErrorResponse(res?.errors);
          dispatch(setMessage(errMessage ?? 'Alamat Gagal Diperbarui'));
          dispatch(setMessageType('error'));
          dispatch(setAlert(true));
          dispatch(setAlert(true));
        }
      })
      .catch(err => {
        console.log('err edit petani profile', err);
        dispatch(setLoading(false));
      });
  };

  // useBackHandler(() => handleBack());
  const handleBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <LoadingAnimated
        visible={loading}
        // handleBack={() => handleBack()}
      />

      <AppBar
        appBarColor={theme.backgroundColor}
        navigation={navigation}
        headerTextColor={theme.textColor}
        hideRightContent
        iconLeft={
          <IconLeftArrow width={20} height={20} fill={theme.textColor} />
        }
        title="Alamat"
        borderBottom
        borderBottomColor={theme.textColor}
      />

      <View
        style={[
          styles.wrapper,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            backgroundColor: theme.backgroundColor,
            marginBottom: 125,
          },
        ]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={{
            backgroundColor: theme.backgroundColor,
          }}>
          <Select
            value={provinceId}
            setValue={setProvinceId}
            data={provinces}
            placeholder="Pilih Provinsi"
            label="Provinsi"
            searchable
          />

          <Select
            value={cityId}
            setValue={setCityId}
            data={cities}
            placeholder="Pilih Kabupaten/Kota"
            label="Kabupaten/Kota"
            searchable
          />

          <Select
            value={kecamatanId}
            setValue={setKecamatanId}
            data={kecamatans}
            placeholder="Pilih Kecamatan"
            label="Kecamatan"
            searchable
          />

          <Select
            value={kelurahanId}
            setValue={setKelurahanId}
            data={kelurahans}
            placeholder="Pilih Kelurahan"
            label="Kelurahan"
            searchable
          />
          {/*
          <Select
            value={kodePosId}
            setValue={setKodePosId}
            data={kodePoss}
            placeholder="Pilih Kode Pos"
            label="Kode Pos"
            searchable
          /> */}
          <View style={gStyles.formInput}>
            <Text style={[gStyles.label('#797B8A', 14, '400')]}>Kode Pos</Text>
            <View style={styles.koordinatField}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[gStyles.text(16, '400', '#313447'), {width: '90%'}]}>
                {kodePos}
              </Text>

              {/* <Input
                name="koordinat"
                placeholderTextColor={'#687083'}
                autoCapitalize="none"
                disabled
                style={styles.koordinatField}
              /> */}
            </View>
          </View>
          <View style={[gStyles.formInput]}>
            <Text style={[gStyles.label('#797B8A', 14, '400')]}>Alamat</Text>
            <View style={styles.fieldContainer}>
              <Input
                name="address"
                placeholderTextColor={'#687083'}
                autoCorrect={false}
                autoCapitalize="none"
                defaultValue={data.address}
                onChangeText={value => handleChange('address', value)}
                style={gStyles.field}
              />
            </View>
          </View>
          <View style={gStyles.formInput}>
            <Text style={[gStyles.label('#797B8A', 14, '400')]}>
              Titik Koordinat
            </Text>
            <View style={styles.fieldContainer}>
              <TouchableOpacity
                onPress={handlePickLocation}
                style={styles.koordinatField}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[gStyles.text(16, '400', '#313447'), {width: '90%'}]}>
                  {pickedAddress?.name
                    ? pickedAddress.name
                    : userInfo?.farmer_profile?.address_map ?? ''}
                </Text>
                <View style={styles.aturKoordinatText}>
                  <Text style={gStyles.text(14, '700', '#2A378E')}>Atur</Text>
                </View>
              </TouchableOpacity>
              {/* <Input
                name="koordinat"
                placeholderTextColor={'#687083'}
                autoCapitalize="none"
                disabled
                style={styles.koordinatField}
              /> */}
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={gStyles.absoluteBottom}>
        <View style={[styles.borderTop, {boxShadow: theme.textColor}]} />
        <View
          style={[
            gStyles.paddingHorizontal(16),
            gStyles.paddingVertical(8),
            {
              backgroundColor: theme.backgroundColor,
            },
          ]}>
          <Button
            title="Simpan Perubahan"
            onPress={() => handleSave()}
            isDisabled={isDisabled}
            type="full"
            style={[
              styles.btnAgree,
              {
                backgroundColor: isDisabled ? colors.neutral : colors.primary,
              },
            ]}
            textStyle={[
              styles.btnAgreeText,
              {
                color: isDisabled ? colors.grey2 : colors.light,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

export default ChangeAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    padding: 16,
  },
  koordinatField: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 15,
    paddingHorizontal: 14,
    color: '#092540',
    borderColor: '#CBCCD1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  imageWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  previewImage: {
    display: 'flex',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
    marginRight: 16,
  },
  changeImageBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  borderTop: {
    height: 3.5,
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  btnAgree: {
    paddingVertical: 13,
    borderRadius: 4,
    width: '100%',
    backgroundColor: '#2A378E',
  },
  btnAgreeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
});
