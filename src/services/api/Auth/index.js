// import Delete from '../Delete';
import Get from '../Get';
import Post from '../Post';
// import Put from '../Put';

export const AuthKEY =
  'V5iq53tQOXhQg38PDiImsCX2ZvwyCLyQqoNdwB4qijjWFwL20OKFk38Xqzvx1kUq';

export const userLogin = data => Post('auth', 'auth/login-farmer', data);
export const userRegister = data => Post('auth', 'auth/register-farmer', data);
export const changePassword = (token, data) =>
  Post('auth', 'client-user/change-password', data, token);
export const userLogout = token => Get('auth', 'client-user/logout', token);

//get user profile, company profile
export const userInfo = token => Get('auth', 'client/my-info', token);
