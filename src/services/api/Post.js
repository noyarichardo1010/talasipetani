import axios from 'axios';
import {BASE_URL, Auth} from './url';

/*
    ini adalah fungsi untuk menangani request POST API
    ketika request berhasil resolve dijalankan
    ketika request gagal reject dijalankan
*/
const Post = (url, path, data, token) => {
  // console.log('path', BASE_URL, '/', path, '=', data);
  if (token) {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const promise = new Promise(async (resolve, reject) => {
      await axios.post(`${BASE_URL}/${path}`, data, config).then(
        result => {
          // console.log('====== result', result);
          resolve(result);
        },
        err => {
          // console.log('err', err);
          reject(err);
        },
      );
    });
    return promise;
  } else {
    const promise = new Promise(async (resolve, reject) => {
      await axios
        .post(
          `${
            BASE_URL
          }/${path}`,
          data,
        )
        .then(
          result => {
            // console.log('====== result', result);
            resolve(result);
          },
          err => {
            // console.log('err', err);
            reject(err);
          },
        );
    });
    return promise;
  }
};

export default Post;
