import {Text, View, TouchableOpacity, ImageBackground} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Container, Select} from '../../../components';
import styles from './styles';

import {BGLogin} from '../../../assets';
import {useDispatch, useSelector} from 'react-redux';
import {gStyles} from '../../../utils/styles';
import FieldInput from '../../../components/molecules/FieldInput';
import API from '../../../services/api';
import {setLoading} from '../../../services';

const FormRegister = ({
  handleSubmit,
  data,
  setData,
  pickedAddress,
  navigation,
  AlertField,
}) => {
  const {theme} = useSelector(reducer => reducer.global);
  const dispatch = useDispatch();
  const [provinces, setProvinces] = useState([]);
  const [provinceId, setProvinceId] = useState(null);

  const [cities, setCity] = useState([]);
  const [cityId, setCityId] = useState(null);

  const handleChange = (forField, value) => {
    setData({
      ...data,
      [forField]: value,
    });
  };

  const checkIsEmpty = field => {
    if (AlertField.length > 0) {
      let check = AlertField.find(alt => alt.field === field);
      // console.log('check', check);
      return check ? check.empty : false;
    } else {
      return false;
    }
  };

  useEffect(() => {
    dispatch(setLoading(true));
    API.get('master/province?page=1&limit=1000')
      .then(res => {
        console.log('res provinces', res);
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
    handleChange('province_id', provinceId);

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
    handleChange('city_id', cityId);
  }, [cityId]);

  return (
    <Container
      style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <ImageBackground
        source={BGLogin}
        resizeMode="cover"
        style={styles.backgroundImage}>
        <Text style={styles.screenTitle}>Buat Akun Baru</Text>

        <FieldInput
          field={'first_name'}
          label={'Nama Depan'}
          data={data}
          checkIsEmpty={checkIsEmpty}
          handleChange={handleChange}
        />
        <FieldInput
          field={'last_name'}
          label={'Nama Belakang'}
          data={data}
          checkIsEmpty={checkIsEmpty}
          handleChange={handleChange}
        />

        <FieldInput
          field={'phone'}
          label={'Nomor Handphone'}
          data={data}
          numeric
          checkIsEmpty={checkIsEmpty}
          handleChange={handleChange}
        />

        <FieldInput
          field={'email'}
          label={'Email'}
          data={data}
          checkIsEmpty={checkIsEmpty}
          handleChange={handleChange}
        />
        <View style={{width: '100%'}}>
          <Select
            value={provinceId}
            setValue={setProvinceId}
            data={provinces}
            placeholder="Pilih Provinsi"
            label="Provinsi"
            emptyField={checkIsEmpty('province_id')}
            searchable
          />
        </View>
        <View style={{width: '100%'}}>
          <Select
            value={cityId}
            setValue={setCityId}
            data={cities}
            placeholder="Pilih Kabupaten/Kota"
            label="Kabupaten/Kota"
            emptyField={checkIsEmpty('city_id')}
            searchable
          />
        </View>

        <FieldInput
          field={'lokasi'}
          label={'Lokasi'}
          checkIsEmpty={checkIsEmpty}
          style={{width: '100%'}}
          content={
            pickedAddress.name !== '' ? (
              <View style={[gStyles.col, gStyles.inputField]}>
                <Text
                  style={[
                    {marginVertical: 4, paddingRight: 5},
                    gStyles.text(14, '400', '#313447'),
                  ]}>
                  {pickedAddress.name}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('PickLocation')}>
                  <Text style={gStyles.text(14, '500', '#2A378E')}>
                    Atur lokasi
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Button
                title="Pilih lokasi"
                onPress={() => navigation.navigate('PickLocation')}
                type="full"
                style={[
                  gStyles.inputField,
                  {
                    borderColor: checkIsEmpty('lokasi') ? '#F36767' : '#CBCCD1',
                  },
                ]}
                textStyle={gStyles.text(14, '500', '#2A378E')}
              />
            )
          }
        />

        <FieldInput
          field={'password'}
          label={'Kata Sandi'}
          data={data}
          placeholder={'Minimal 6 karakter'}
          checkIsEmpty={checkIsEmpty}
          handleChange={handleChange}
          passwordContent
        />

        <FieldInput
          field={'confirm_password'}
          label={'Konfirmasi Kata Sandi'}
          data={data}
          placeholder={' '}
          checkIsEmpty={checkIsEmpty}
          handleChange={handleChange}
          passwordContent
        />

        <View style={gStyles.space(24)} />
        <Button
          title="Selanjutnya"
          onPress={() => handleSubmit()}
          type="full"
          style={styles.btnNext}
          textStyle={styles.btnNextText}
        />

        <View style={styles.haveAccountWrapper}>
          <Text style={styles.haveAccountText}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.haveAccountTextBtn}>Masuk di sini</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Container>
  );
};

export default FormRegister;
