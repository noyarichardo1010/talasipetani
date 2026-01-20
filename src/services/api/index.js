import {Alert} from 'react-native';
import API from './axiosConfig';
import {getUserToken, removeToken} from '../redux/action';

export * from './Auth';
export * from './Profile';
export * from './Petani';

/**
 * Build API response safely (NO Redux here)
 */
async function buildResponse(response) {
  if (
    response?.response?.status === 401 ||
    response?.response?.status === 403
  ) {
    await removeToken();

    Alert.alert(
      'Unauthenticated',
      'Sesi habis atau ada yang login menggunakan akun Anda',
    );

    // ⬇️ RETURN FLAG, BIAR LAYER ATAS YANG HANDLE
    return {
      __unauthorized: true,
      response,
    };
  }

  return response;
}

export const getErrorResponse = response => {
  if (Array.isArray(response) && response.length > 0) {
    return response.map(item => item.message);
  }
  return response;
};

const ApiService = {
  post: async (url, body, auth = true) => {
    const token = await getUserToken();

    return API(url, {
      method: 'POST',
      head: {
        'Content-Type': 'application/json',
        Authorization: auth ? `Bearer ${token}` : null,
      },
      responseType: 'json',
      body,
    })
      .then(buildResponse)
      .catch(buildResponse);
  },

  put: async (url, body, auth = true) => {
    const token = await getUserToken();

    return API(url, {
      method: 'PUT',
      head: {
        'Content-Type': 'application/json',
        Authorization: auth ? `Bearer ${token}` : null,
      },
      responseType: 'json',
      body,
    })
      .then(buildResponse)
      .catch(buildResponse);
  },

  get: async (url = '', params, auth = true) => {
    const token = await getUserToken();

    return API(url, {
      method: 'GET',
      head: {
        'Content-Type': 'application/json',
        Authorization: auth ? `Bearer ${token}` : null,
      },
      params: {...params},
    })
      .then(buildResponse)
      .catch(buildResponse);
  },

  delete: async (url, body = null, auth = true) => {
    const token = await getUserToken();

    return API(url, {
      method: 'DELETE',
      head: {
        'Content-Type': 'application/json',
        Authorization: auth ? `Bearer ${token}` : null,
      },
      responseType: 'json',
      body,
    })
      .then(buildResponse)
      .catch(buildResponse);
  },
};

export default ApiService;
