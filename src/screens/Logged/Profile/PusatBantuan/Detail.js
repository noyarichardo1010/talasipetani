import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {AppBar, LoadingAnimated} from '../../../../components';
import {
  IconDot,
  IconLeftArrow,
  IconThumbsDown,
  IconThumbsUp,
} from '../../../../assets';
import {gStyles} from '../../../../utils/styles';
import styles from './styles';
import API, {getErrorResponse} from '../../../../services/api';
import {setAlert, setMessage, setMessageType} from '../../../../services';
import HTMLView from 'react-native-htmlview';
import {useBackHandler} from '@react-native-community/hooks';

const DetailPusatBantuan = ({navigation, route}) => {
  // useBackHandler(() => navigation.navigate('ProfileScreen'));
  const dispatch = useDispatch();
  const {theme} = useSelector(reducer => reducer.global);
  const initData = route.params?.data;
  const [data, setData] = useState(initData);
  const [ThumbsUp, setThumbsUp] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const getDetail = () => {
    setIsLoading(true);
    API.get(`master/faq/${data.id}`)
      .then(res => {
        // console.log('res detail pusat bantuan', res);
        if (res?.meta?.http_status === 200) {
          setData(res.data);
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
    getDetail();
  }, []);

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
          <Text
            style={[
              gStyles.text(16, '700', '#313447'),
              gStyles.marginBottom(12),
            ]}>
            {data?.question ?? 'Judul Pertanyaan'}
          </Text>
          <View
            style={[
              gStyles.text(14, '400', '#313447'),
              gStyles.marginBottom(12),
              gStyles.flex(0.8),
              {},
            ]}>
            {data?.answer && (
              <HTMLView value={data?.answer} stylesheet={styles} />
            )}
          </View>
          {/* <View style={styles.listItem}>
            <IconDot
              fill="#313447"
              width={7}
              height={7}
              style={[gStyles.marginRight(7), gStyles.marginTop(7)]}
            />
            <Text style={[gStyles.text(14, '400', '#313447'), gStyles.flex(1)]}>
              Last too quick search must up reality so.
            </Text>
          </View>
          <View style={styles.listItem}>
            <IconDot
              fill="#313447"
              width={7}
              height={7}
              style={[gStyles.marginRight(7), gStyles.marginTop(7)]}
            />
            <Text style={[gStyles.text(14, '400', '#313447'), gStyles.flex(1)]}>
              Alarming idea die pole decisions proceduralize dunder see the.
            </Text>
          </View>
          <View style={styles.listItem}>
            <IconDot
              fill="#313447"
              width={7}
              height={7}
              style={[gStyles.marginRight(7), gStyles.marginTop(7)]}
            />
            <Text style={[gStyles.text(14, '400', '#313447'), gStyles.flex(1)]}>
              Innovation us commitment it's no-brainer win 2 algorithm up
              circle.
            </Text>
          </View>

          <View style={styles.listItem}>
            <IconDot
              fill="#313447"
              width={7}
              height={7}
              style={[gStyles.marginRight(7), gStyles.marginTop(7)]}
            />
            <Text style={[gStyles.text(14, '400', '#313447'), gStyles.flex(1)]}>
              Leverage synergy your time scope eod strategic vec quarter.
            </Text>
          </View> */}

          <View style={styles.wrapperFeedback}>
            <Text style={[gStyles.text(14, '400', '#313447'), gStyles.flex(1)]}>
              Apakah solusi ini membantu?
            </Text>
            <View style={gStyles.flexCenter('row')}>
              <TouchableOpacity
                style={gStyles.marginRight(8)}
                onPress={() => setThumbsUp(true)}>
                <IconThumbsUp
                  fill={
                    ThumbsUp === ''
                      ? '#CBCCD1'
                      : ThumbsUp
                      ? '#2E3192'
                      : '#CBCCD1'
                  }
                  width={20}
                  height={20}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setThumbsUp(false)}>
                <IconThumbsDown
                  fill={
                    ThumbsUp === ''
                      ? '#CBCCD1'
                      : ThumbsUp
                      ? '#CBCCD1'
                      : '#2E3192'
                  }
                  width={20}
                  height={20}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DetailPusatBantuan;
