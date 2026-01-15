import axios from 'axios'
import { Auth, HR, Asset, PPKB } from './url';


/* 
    ini adalah fungsi untuk menangani request GET API
    ketika request berhasil resolve dijalankan
    ketika request gagal reject dijalankan
*/
const Delete = (url, path, token) => {
    if(token){
        const config = {
            headers: { 'Authorization': `Bearer ${token}` }
        };
        const promise = new Promise((resolve, reject) => {
            axios.delete(`${ url === 'auth' ? Auth : url === 'hr' ? HR : url === 'asset' ? Asset : url === 'ppkb' ? PPKB : null }/${path}`, config).then((result) => {
                resolve(result.data);
            }, (err) => {
                reject(err);
            })
        })
        return promise;

    }else {
        return false;
    }
}

export default Delete;
