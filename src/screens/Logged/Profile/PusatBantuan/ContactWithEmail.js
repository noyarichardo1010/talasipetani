import {ScrollView, Text, View, TextInput, ImageBackground} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {AppBar, Button, Input} from '../../../../components';
import {BGBlue, IconLeftArrow, IconMail} from '../../../../assets';
import {colors, gStyles} from '../../../../utils/styles';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import {setAlert, setMessage, setMessageType} from '../../../../services';
import {useBackHandler} from '@react-native-community/hooks';

const ContactWithEmail = ({navigation}) => {
  // useBackHandler(() => navigation.navigate('ProfileScreen'));

  const dispatch = useDispatch();
  const {theme} = useSelector(reducer => reducer.global);
  const [data, setData] = useState({
    email: '',
    message: '',
  });
  const [messageLength, setMessageLength] = useState(0);
  const maxMessageLength = 140;
  const handleChange = (forField, value) => {
    if (forField === 'message') {
      if (data.message.length >= maxMessageLength) {
        setData({
          ...data,
          [forField]: value.substring(0, maxMessageLength),
        });
      } else {
        setMessageLength(value.length);
        setData({
          ...data,
          [forField]: value,
        });
      }
    } else {
      setData({
        ...data,
        [forField]: value,
      });
    }
  };
  const isDisabled = data.email === '' || data.message === '';

  const handleSubmit = () => {
    dispatch(setMessage('Pesan Berhasil Dikirimkan'));
    dispatch(setMessageType('success'));
    dispatch(setAlert(true));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
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
        style={{
          backgroundColor: theme.backgroundColor,
        }}>
        <View
          style={[
            styles.wrapperBantuanLainnya(0),
            {
              backgroundColor: theme.activeIconColor,
            },
          ]}>
          <View style={styles.textBantuanLainnya}>
            <IconMail fill={'#fff'} width={30} height={30} />
            <Text
              style={[gStyles.text(14, '500', '#fff'), gStyles.marginLeft(15)]}>
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

        <View
          style={[
            styles.wrapper,
            {
              backgroundColor: theme.backgroundColor,
            },
          ]}>
          <View style={[gStyles.formInput, gStyles.marginBottom(16)]}>
            <Text
              style={[
                gStyles.label('#6B6D7A', 13, '400'),
                gStyles.weight('500'),
                gStyles.marginBottom(4),
              ]}>
              Email Anda
            </Text>
            <View style={styles.fieldContainer}>
              <Input
                name="email"
                placeholderTextColor={'#687083'}
                autoCorrect={false}
                placeholder="your@email.com"
                autoCapitalize="none"
                onChangeText={value => handleChange('email', value)}
                style={gStyles.field}
              />
            </View>
          </View>
          <View style={[gStyles.formInput]}>
            <Text
              style={[
                gStyles.label('#6B6D7A', 13, '400'),
                gStyles.weight('500'),
                gStyles.marginBottom(4),
              ]}>
              Pesan
            </Text>
            <View
              style={gStyles.textareaWrapper(
                156,
                messageLength >= maxMessageLength ? 'red' : '#D1D5DC',
              )}>
              <TextInput
                placeholder="Tulis pesan Anda"
                name="pesan"
                placeholderTextColor={'#687083'}
                autoCorrect={false}
                onChangeText={value => handleChange('message', value)}
                textAlignVertical="top"
                multiline={true}
                style={[gStyles.textarea(156), {color: 'gray'}]}
              />
            </View>
            <Text
              style={[
                gStyles.text(12, '400', '#93959E'),
                gStyles.marginTop(4),
              ]}>
              {messageLength} / {maxMessageLength}
            </Text>
          </View>
          <Button
            title="Kirim"
            onPress={() => handleSubmit()}
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
      </ScrollView>
    </View>
  );
};

export default ContactWithEmail;
