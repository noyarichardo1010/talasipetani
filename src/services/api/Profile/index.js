import Delete from '../Delete';
import Get from '../Get';
import Post from '../Post';
import Put from '../Put';

export const bankMaster = () => Get('profile', 'bank');

export const bankList = token => Get('profile', 'farmer/account-bank', token);
export const addBank = (token, data) =>
  Post('profile', 'farmer/account-bank', token);
