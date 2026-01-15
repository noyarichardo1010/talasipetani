import axios from 'axios';
import {BASE_URL} from './url';

/* 
    ini adalah fungsi untuk menangani request GET API
    ketika request berhasil resolve dijalankan
    ketika request gagal reject dijalankan
*/
const Get = (url, path, token) => {
  console.log('path', `${BASE_URL}/${path}`);
  // token = token.replace(/ /g,"");
  if (token) {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const promise = new Promise((resolve, reject) => {
      axios.get(`${BASE_URL}/${path}`, config).then(
        result => {
          resolve(result.data);
        },
        err => {
          reject(err);
        },
      );
    });
    return promise;
  } else {
    const promise = new Promise((resolve, reject) => {
      axios.get(`${BASE_URL}/${path}`).then(
        result => {
          resolve(result.data);
        },
        err => {
          reject(err);
        },
      );
    });
    return promise;
  }
};

export default Get;
