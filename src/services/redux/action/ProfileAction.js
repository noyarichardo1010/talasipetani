// import API, {userLogin, userLogout} from '../../api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {Alert, AsyncStorage} from 'react-native';
import API, {
  updateProfile,
  userLogin,
  userLogout,
  userProfile,
  userRegister,
  bankMaster,
  addBank,
  bankList,
} from '../../api';
import {
  SET_ISLOGIN,
  SET_LOADING,
  SET_MESSAGE,
  SET_MESSAGE_TYPE,
  SET_TOKEN,
  SET_USER,
  SET_BANK_LIST,
  SET_MASTER_BANK,
  SET_SHOW_ALERT,
} from './list';
import {setLoading} from './GlobalAction';

export const getBankMaster = () => async dispatch => {
  return await new Promise((resolve, reject) => {
    dispatch({type: SET_LOADING, value: true});
    API.get('bank')
      .then(res => {
        if (res.meta.http_status === 200) {
          const result = res.data.map(bank => ({
            value: bank.id,
            label: bank.name,
            code: bank.code,
          }));
          console.log('result master bank', result);
          dispatch({type: SET_MASTER_BANK, value: result});
          resolve({...result, success: true});
        } else {
          reject({...res, success: false});
        }
        dispatch({type: SET_LOADING, value: false});
      })
      .catch(err => {
        // console.log('err', err.response);
        const errorData = err?.response?.data?.errors[0];
        reject({...errorData, success: false});
        dispatch({type: SET_LOADING, value: false});
      });
  }).catch(err => err);
};

export const getBankList = () => async dispatch => {
  return await new Promise((resolve, reject) => {
    dispatch({type: SET_LOADING, value: true});
    API.get('farmer/account-bank', null, true)
      .then(res => {
        console.log('result bank list', res);

        if (res.meta.http_status === 200) {
          const data = [];
          if (res.data) {
            const result = res.data.map(bank => ({
              value: bank.id,
              label: bank.name,
              code: bank.code,
            }));
            dispatch({type: SET_BANK_LIST, value: result});
          }
          dispatch({type: SET_MESSAGE_TYPE, value: 'success'});
          resolve({...res, success: true});
        } else {
          dispatch({type: SET_MESSAGE_TYPE, value: 'failed'});
          reject({...res, success: false});
        }
        dispatch({type: SET_LOADING, value: false});
        dispatch({type: SET_MESSAGE, value: res.message});
        dispatch({type: SET_SHOW_ALERT, value: true});
      })
      .catch(err => {
        console.log('err', err);
        const errorData = err?.response?.data?.errors[0];
        console.log('XXXXX errorData', errorData);
        dispatch({type: SET_MESSAGE, value: errorData.message});
        dispatch({type: SET_MESSAGE_TYPE, value: 'failed'});
        dispatch({type: SET_SHOW_ALERT, value: true});

        reject({...errorData, success: false});
      });
  }).catch(err => err);
};

export const addBankAccount = () => async dispatch => {
  return await new Promise((resolve, reject) => {
    dispatch({type: SET_LOADING, value: true});
    addBank()
      .then(res => {
        if (res.meta.http_status === 200) {
          const result = res.data.map(bank => ({
            value: bank.id,
            label: bank.name,
            code: bank.code,
          }));
          console.log('result bank', result);
          dispatch({type: SET_BANK_LIST, value: result});
          // dispatch({type: SET_LOADING, value: false});
          resolve({...result, success: true});
        } else {
          // dispatch({type: SET_LOADING, value: false});
          reject({...res, success: false});
        }
      })
      .catch(err => {
        console.log('err', err?.response);
        const errorData = err?.response?.data?.errors[0];
        reject({...errorData, success: false});
      });
  }).catch(err => err);
};
