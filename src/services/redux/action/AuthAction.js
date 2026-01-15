// import API, {userLogin, userLogout} from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {Alert} from 'react-native';
import {
  updateProfile,
  userLogin,
  userLogout,
  userProfile,
  userRegister,
} from '../../api';
import {
  SET_ISLOGIN,
  SET_LOADING,
  SET_MESSAGE,
  SET_MESSAGE_TYPE,
  SET_TOKEN,
  SET_USER,
} from './list';
import {setLoading} from './GlobalAction';

export const removeToken = async () => {
  try {
    return await AsyncStorage.removeItem('token');
  } catch (error) {
    console.log('errornya adalah: ', error);
    return false;
  }
};

export const loginUser = formData => async dispatch => {
  console.log('formData login', formData);
  return new Promise((resolve, reject) => {
    dispatch({type: SET_LOADING, value: true});

    userLogin(formData)
      .then(async res => {
        const result = res.data;
        console.log('result login', result);
        if (result.meta.http_status === 200) {
          // await AsyncStorage.setItem('user', JSON.stringify(user));
          // await AsyncStorage.setItem('token', result.data.token);
          // dispatch({type: SET_USER, value: user});

          dispatch({type: SET_MESSAGE_TYPE, value: 'success'});
          dispatch({type: SET_MESSAGE, value: result.message});
          dispatch({type: SET_TOKEN, value: result.data.token});
          dispatch({type: SET_ISLOGIN, value: true});

          resolve({...result, success: true});
        } else {
          dispatch({type: SET_MESSAGE_TYPE, value: 'error'});
          dispatch({type: SET_MESSAGE, value: result.message});
          dispatch({type: SET_ISLOGIN, value: false});

          reject({...result, success: false});
        }
        dispatch({type: SET_LOADING, value: false});
      })
      .catch(err => {
        console.log('err 1', err);
        const errorData = err?.response?.data?.errors[0] || err?.message;
        console.log('errorData', errorData);
        if (errorData) {
          dispatch({type: SET_MESSAGE, value: errorData?.message || errorData});
          dispatch({type: SET_MESSAGE_TYPE, value: 'error'});
          dispatch({type: SET_ISLOGIN, value: false});
          dispatch({type: SET_LOADING, value: false});
          reject({...errorData, success: false});
        }
      });
  }).catch(err => err);
};

export const registerUser = formData => async dispatch => {
  return new Promise((resolve, reject) => {
    dispatch(setLoading(true));
    userRegister(formData)
      .then(res => {
        const result = res.data;
        if (result.meta.http_status === 200) {
          dispatch({type: SET_ISLOGIN, value: true});
          resolve({...result, success: true});
        } else {
          dispatch({type: SET_ISLOGIN, value: false});
          reject({...result, success: false});
        }
        dispatch(setLoading(false));
      })
      .catch(err => {
        const errorData = err?.response?.data?.errors[0];
        reject({...errorData, success: false});
      });
  }).catch(err => err);
};

export const getUserToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.log('error', error);
    return false;
  }
};

export const getuser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
    return false;
  }
};
export const removeUserToken = () => dispatch => {
  removeToken().then(() => {
    console.log('sukses hapus token');
    dispatch({type: 'SET_USER', value: {}});
    dispatch({type: 'SET_ISLOGIN', value: false});
    Alert.alert(
      'Unauthenticated',
      'Sesi habis atau ada yang login menggunakan akun Anda.',
    );
  });
};

export const setToken = value => async dispatch => {
  try {
    await AsyncStorage.setItem('token', value);
    return dispatch({type: SET_TOKEN, value: value});
  } catch (e) {
    // saving error
    console.log(e);
  }
};
export const setUser = data => async dispatch => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem('user', jsonValue);
    dispatch({type: 'SET_USER', value: data});
  } catch (e) {
    // saving error
    console.log(e);
  }

  dispatch({type: 'SET_ISLOGIN', value: true});
};

export const logoutUser = token => async dispatch => {
  return new Promise(async (resolve, reject) => {
    dispatch({type: 'SET_LOADING', value: true});

    // console.log('token logout', token);
    let formData = new FormData();

    formData.append('token', token);

    userLogout(formData)
      .then(async result => {
        console.log(result);
        if (result.status === 200) {
          console.log(result);
          try {
            await AsyncStorage.removeItem('token').then(() => {
              dispatch({type: 'SET_MESSAGE', value: result.message});
              dispatch({type: SET_USER, value: {}});

              // console.log('sukses hapus token');
              dispatch({type: 'SET_ISLOGIN', value: false});
              dispatch({type: 'SET_TOKEN', value: ''});
              dispatch({type: 'SET_LOADING', value: false});
            });

            resolve(true);
          } catch (error) {
            console.log(error);
          }
        }
      })
      .catch(async err => {
        if (err.response) {
          // console.log(err);
          console.log(err?.response?.data);
          try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token').then(() => {
              dispatch({type: 'SET_MESSAGE', value: err.response.data.message});
              dispatch({type: SET_USER, value: {}});
              dispatch({type: 'SET_ISLOGIN', value: false});
              dispatch({type: 'SET_LOADING', value: false});
              dispatch({type: 'SET_TOKEN', value: ''});
            });

            // Alert.alert(err.response.data.message);
            reject(false);
          } catch (error) {
            console.log(error);
          }
        }
      });
  }).catch(err => err);
};

export const getUserProfile = token => dispatch => {
  return new Promise(async (resolve, reject) => {
    dispatch({type: SET_LOADING, value: true});

    userProfile(token)
      .then(async result => {
        console.log('result', result);
        try {
          // console.log(result.data);
          // await AsyncStorage.setItem('user', JSON.stringify(result.data));
          dispatch({type: SET_USER, value: result.data});
          // return result.data;
          dispatch({type: SET_MESSAGE, value: result.message});
          dispatch({type: SET_MESSAGE_TYPE, value: 'success'});

          dispatch({type: SET_LOADING, value: false});
        } catch (error) {
          console.log(error);
        }
        resolve(true);
      })
      .catch(err => {
        if (err.response) {
          // console.log(err);
          if (
            err?.response?.data?.message === 'Unauthenticated' ||
            err?.response?.data?.exception ===
              'Illuminate\\Auth\\AuthenticationException'
          ) {
            dispatch(removeUserToken());
            // dispatch(logoutUser(token));
          }
          console.log(err.response.data);
          dispatch({type: SET_MESSAGE, value: err.response.data.message});
          dispatch({type: SET_MESSAGE_TYPE, value: 'error'});

          dispatch({type: SET_LOADING, value: false});

          reject(false);
        }
      });
  }).catch(err => err);
};

export const saveUserProfile = (token, data) => dispatch => {
  return new Promise(async (resolve, reject) => {
    dispatch({type: SET_LOADING, value: true});

    updateProfile(token, data)
      .then(async result => {
        try {
          // console.log('profile berhasil diupdate', result.data);
          // await AsyncStorage.setItem('user', JSON.stringify(result.data));
          // dispatch({type: SET_CURRENT_INSPECTION, value: result.data});
          // // return result.data;
          dispatch({type: SET_USER, value: result.data.data});
          dispatch({type: SET_MESSAGE, value: result.data.message});
          dispatch({type: SET_MESSAGE_TYPE, value: 'success'});

          dispatch({type: SET_LOADING, value: false});
        } catch (error) {
          console.log(error);
        }
        resolve(true);
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.data);
          dispatch({
            type: SET_MESSAGE,
            value: err.response.data.message || 'Periksa value yang diinput.',
          });
          dispatch({type: SET_MESSAGE_TYPE, value: 'error'});
          dispatch({type: SET_LOADING, value: false});

          reject(false);
        }
      });
  }).catch(err => err);
};
