// import API, {userLogin, userLogout} from '../../api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ReactNativeForegroundService from '@supersami/rn-foreground-service';
// import {Alert, AsyncStorage} from 'react-native';
import API from '../../api';
import {
  // SET_LOADING,
  // SET_MESSAGE,
  // SET_MESSAGE_TYPE,
  // SET_SHOW_ALERT,
  SET_EMPTY_ADDRESS,
  SET_EMPTY_BANK,
  SET_VERIFIED,
  SET_LIST_TRANSACTION_ACTIVE,
  SET_LIST_TRANSACTION_FINISH,
  SET_ALL_LIST_TRANSACTION,
  SET_LASTEST_TRANSACTION,
  SET_SELECTED_KUPON,
} from './list';
import {setLoading} from './GlobalAction';
import {CheckingStatus} from '../../../components';

export const setSelectedKupon = value => async dispatch => {
  console.log();
  return dispatch({type: SET_SELECTED_KUPON, value: value});
};

export const getOfferNumber = () => async dispatch => {
  return new Promise((resolve, reject) => {
    dispatch(setLoading(true));
    API.get('farmer/offer/validate-data')
      .then(res => {
        console.log('res', res);
        if (res?.meta?.http_status === 200) {
          const result = res?.data;
          const data_empty = result.data_not_complited;
          console.log('data_empty', data_empty);
          if (data_empty) {
            //  Jika ada data yg kosong, redirect ke profile tampilkan yg kosong
            let address = false;
            let verif = false;
            let bank = false;
            data_empty.map(data => {
              if (parseInt(data.code) === 1) {
                address = true;
              }
              if (parseInt(data.code) === 2) {
                verif = true;
              }
              if (parseInt(data.code) === 3) {
                bank = true;
              }
            });
            dispatch({type: SET_EMPTY_ADDRESS, value: address});
            dispatch({type: SET_EMPTY_BANK, value: bank});
            dispatch({type: SET_VERIFIED, value: verif});
            //  go to profile
            reject({success: false});
          } else {
            resolve({data: result, success: true});
          }
        } else {
          reject({
            message: res.message ? res.message : 'Network Error',
            success: false,
          });
        }

        dispatch(setLoading(false));
      })
      .catch(err => {
        console.log('err.response', err?.response);
        const errorData = err?.response?.data?.errors[0];
        console.log('errorData', errorData);
        dispatch(setLoading(false));
        reject({...errorData, success: false});
      });
  }).catch(err => err);
};

export const getListTransaksi = (url, type) => async dispatch => {
  dispatch(setLoading(true));
  return new Promise((resolve, reject) => {
    API.get(url)
      .then(res => {
        // console.log('res', type, res);
        if (res?.meta?.http_status === 200) {
          let result = res?.data?.offers ?? [];
          // console.log('res?.data', res?.data.offers);
          // console.log('result', result);
          // result = result.sort(
          //   (a, b) => new Date(b.offer_date) - new Date(a.offer_date),
          // );
          dispatch({
            type: SET_ALL_LIST_TRANSACTION,
            value: result,
          });
          // console.log('result all list trx', result);

          let active = [];
          let finish = [];
          result.map(data => {
            let check = CheckingStatus(data.status);
            if (check.kategori === 'active') {
              active.push(data);
            } else {
              finish.push(data);
            }
          });

          dispatch({
            type: SET_LIST_TRANSACTION_ACTIVE,
            value: active,
          });
          dispatch({
            type: SET_LIST_TRANSACTION_FINISH,
            value: finish,
          });

          dispatch({
            type: SET_LASTEST_TRANSACTION,
            value: result.length > 0 ? result[0] : [],
          });
          // console.log('lastest', result[0]);
          resolve({data: {active, finish}, success: true});
        } else {
          reject({
            message: res?.message ? res?.message : 'Network Error',
            success: false,
          });
        }

        dispatch(setLoading(false));
      })
      .catch(err => {
        console.log('err.response', err);
        const errorData = err?.response?.data?.errors[0];
        console.log('errorData', errorData);
        dispatch(setLoading(false));
        reject({...errorData, success: false});
      });
  }).catch(err => err);
};
