export * from './Auth';
export * from './Profile';
export * from './Petani';
import {Alert} from 'react-native';
import API from './axiosConfig';
import {getUserToken, removeToken, removeUserToken} from '../redux/action';
import {store} from '../redux/store';

async function buildResponse(response, auth) {
  // if (auth) {
  //   return response;
  // }
  if (
    response?.response?.status === 401 ||
    response?.response?.status === 403
  ) {
    removeToken().then(() => {
      // console.log('sukses hapus token');

      store.dispatch({type: 'SET_USER', value: {}});
      store.dispatch({type: 'SET_ISLOGIN', value: false});
      Alert.alert(
        'Unauthenticated',
        'Sesi habis atau ada yang login menggunakan akun Anda',
      );
    });
    console.log('buildResponse response', response);
    // console.log('logout');
    return response;
  } else {
    return response;
  }
}

export const getErrorResponse = response => {
  if (Array.isArray(response) && response.length > 0) {
    // Ambil pesan error dari setiap objek dalam array response
    const errorMessages = response.map(item => item.message); //item.message, tergantung dari key api
    // errorMessages.push('Test');
    // errorMessages.push('Test 2');
    // errorMessages.push('Test 3');
    return errorMessages;
  } else {
    // Reset pesan error jika tidak ada error
    return response;
  }
};

export default {
  post: async (url, body, auth = true) => {
    console.log('==== POST', url, body);
    let token = await getUserToken();
    // token = '418d206de84-c3ea-4736-b6f3-caba6115f832';
    return API(url, {
      method: 'POST',
      head: {
        'Content-Type': 'application/json',
        // "Access-Control-Allow-Origin": "*",
        Authorization: auth ? `Bearer ${token}` : null,
      },
      responseType: 'json',
      body,
    })
      .then(response => buildResponse(response))
      .catch(err => buildResponse(err));
  },
  put: async (url, body, auth = true) => {
    // console.log('==== url', url, body);
    let token = await getUserToken();
    // token = '418d206de84-c3ea-4736-b6f3-caba6115f832';
    return API(url, {
      method: 'PUT',
      head: {
        'Content-Type': 'application/json',
        // "Access-Control-Allow-Origin": "*",
        Authorization: auth ? `Bearer ${token}` : null,
      },
      responseType: 'json',
      body,
    })
      .then(response => buildResponse(response))
      .catch(err => buildResponse(err));
  },
  get: async (url = '', params, auth = true) => {
    let token = await getUserToken();
    // console.log('tokennnn', token);
    console.log('==== GET', url, token);
    return API(url, {
      method: 'GET',
      head: {
        'Content-Type': 'application/json',
        // "Access-Control-Allow-Origin": "*",
        Authorization: auth ? `Bearer ${token}` : null,
      },
      params: {...params},
    })
      .then(response => buildResponse(response))
      .catch(err => buildResponse(err));
  },
  delete: async (url, body = null, auth = true) => {
    let token = await getUserToken();
    // token = '418d206de84-c3ea-4736-b6f3-caba6115f832';
    return API(url, {
      method: 'DELETE',
      head: {
        'Content-Type': 'application/json',
        // "Access-Control-Allow-Origin": "*",
        Authorization: auth ? `Bearer ${token}` : null,
      },
      responseType: 'json',
      body,
    })
      .then(response => buildResponse(response))
      .catch(err => buildResponse(err));
  },
};
