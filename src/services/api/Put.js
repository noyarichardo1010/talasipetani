import axios from 'axios';
import {BASE_URL} from './url';

/*
    ini adalah fungsi untuk menangani request PUT API
    ketika request berhasil resolve dijalankan
    ketika request gagal reject dijalankan
*/
const Put = (url, path, data, token) => {
  if (token) {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const promise = new Promise((resolve, reject) => {
      axios
        .put(
          `${
            BASE_URL
          }/${path}`,
          data,
          config,
        )
        .then(
          result => {
            resolve(result);
          },
          err => {
            reject(err);
          },
        );
    });
    return promise;
  } else {
    const promise = new Promise((resolve, reject) => {
      axios
        .put(
          `${
            BASE_URL
          }/${path}`,
          data,
        )
        .then(
          result => {
            resolve(result);
          },
          err => {
            reject(err);
          },
        );
    });

    return promise;
  }
};

export default Put;
