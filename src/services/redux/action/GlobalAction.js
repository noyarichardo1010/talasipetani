// import API from '../../api';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {getErrorResponse, setBiometricValue, userProfile} from '../../api';
import {
  SET_BIOMETRIK_LOADING,
  SET_BIOMETRIK_STATUS,
  SET_CHAT_HISTORY,
  SET_CHAT_MESSAGE,
  SET_EMAIL,
  SET_ISLOGIN,
  SET_LOADING,
  SET_MESSAGE,
  SET_MESSAGE_TYPE,
  SET_ON_UPDATE_IMAGE,
  SET_SHOW_ALERT,
  SET_TOKEN,
  SET_USER,
  SET_ALERT_TYPE,
  SET_LIST_NOTIFICATIONS,
  SET_IS_SOCKET_CONNECTED,
} from './list';

export const setIsSocketConnected = value => async dispatch => {
  return dispatch({type: SET_IS_SOCKET_CONNECTED, value: value});
};

//untuk merubah value dari inputan
export const setForm = (forField, value) => {
  return {type: 'SET_FORM', field: forField, value: value};
};

export const switchTheme = theme => async dispatch => {
  try {
    await AsyncStorage.setItem('theme', theme.mode).then(() => {
      return dispatch({type: 'SWITCH_THEME', value: theme});
    });
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getTheme = async () => {
  try {
    return await AsyncStorage.getItem('theme');
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const setAlert = value => async dispatch => {
  return dispatch({type: SET_SHOW_ALERT, value: value});
};
export const setAlertType = value => async dispatch => {
  return dispatch({type: SET_ALERT_TYPE, value: value});
};

export const setEmail = value => async dispatch => {
  return dispatch({type: SET_EMAIL, value: value});
};

export const setBiometrikStatus = value => async dispatch => {
  return dispatch({type: SET_BIOMETRIK_STATUS, value: value});
};

export const setMessage = value => async dispatch => {
  console.log('setMessage', value);
  return dispatch({type: SET_MESSAGE, value: value});
};

export const setChatMessage = value => {
  return {type: SET_CHAT_MESSAGE, value};
};

export const setChatHistory = value => {
  return {type: SET_CHAT_HISTORY, value};
};

export const setMessageType = value => async dispatch => {
  return dispatch({type: SET_MESSAGE_TYPE, value: value});
};

export const setLoading = value => async dispatch => {
  return dispatch({type: SET_LOADING, value: value});
};

export const setBiometricsLoading = value => async dispatch => {
  return dispatch({type: SET_BIOMETRIK_LOADING, value: value});
};

// Function that updates the image
export const setOnUpdateImage = () => async dispatch => {
  return dispatch({type: SET_ON_UPDATE_IMAGE, value: Math.random()});
};

export const _handleAlertMessage =
  ({res, type = 'error', msg = null}) =>
  async dispatch => {
    console.log('_handleAlertMessage', type, res);
    if (type === 'error') {
      const errMessage = msg
        ? msg
        : res?.response?.data?.errors
        ? res?.response?.data?.errors[0]?.message
          ? getErrorResponse(res?.response?.data?.errors[0]?.message)
          : getErrorResponse(res?.response?.data?.errors)
        : res?.message;
      dispatch(setMessage(errMessage));
    } else {
      dispatch(setMessage(msg ? msg : res?.message));
    }
    dispatch(setAlert(true));

    return dispatch(setMessageType(type));
  };

export const setNotification = value => async dispatch => {
  return dispatch({type: SET_LIST_NOTIFICATIONS, value: value});
};
