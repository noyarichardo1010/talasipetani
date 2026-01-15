import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SET_AGORA_CHANNEL_PARAMS,
  SET_AGORA_OPTIONS,
  SET_CALL_STATUS,
  SET_RTC_TOKEN,
  SET_LABEL_STATUS,
  SET_THERE_IS_INCOMING_CALL,
  SET_CALL_TO_ID,
  SET_CALL_FROM_ID,
  SET_SHOW_END_CALL_BTN,
  SET_CHANNEL_NAME,
  SET_CALL_FROM_NAME,
  SET_FROM_USER_PHOTO,
} from './list';

export const setChannelName = value => async dispatch => {
  return dispatch({type: SET_CHANNEL_NAME, value: value});
};

export const setFromUserPhoto = value => async dispatch => {
  return dispatch({type: SET_FROM_USER_PHOTO, value: value});
};

export const setRtcToken = value => async dispatch => {
  return dispatch({type: SET_RTC_TOKEN, value: value});
};

export const setLabelStatus = value => async dispatch => {
  return dispatch({type: SET_LABEL_STATUS, value: value});
};
export const setCallStatus = value => async dispatch => {
  return dispatch({type: SET_CALL_STATUS, value: value});
};

export const setAgoraChannelParams = value => async dispatch => {
  return dispatch({type: SET_AGORA_CHANNEL_PARAMS, value: value});
};

export const setAgoraOptions = value => async dispatch => {
  return dispatch({type: SET_AGORA_OPTIONS, value: value});
};

export const setIsThereIsIncomingCall = value => async dispatch => {
  return dispatch({type: SET_THERE_IS_INCOMING_CALL, value: value});
};

export const setCallFromID = value => async dispatch => {
  return dispatch({type: SET_CALL_FROM_ID, value: value});
};

export const setCallFromName = value => async dispatch => {
  return dispatch({type: SET_CALL_FROM_NAME, value: value});
};

export const setCallToID = value => async dispatch => {
  return dispatch({type: SET_CALL_TO_ID, value: value});
};

export const setShowEndCallBtn = value => async dispatch => {
  return dispatch({type: SET_SHOW_END_CALL_BTN, value: value});
};

export const getCallData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('callData');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
    return false;
  }
};
