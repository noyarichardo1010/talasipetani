import Post from '../Post';
import Put from '../Put';

export const editProfilePetani = (token, data) =>
  Put('petani', 'farmer/profile', data, token);

export const editAddressPetani = (token, data) =>
  Put('petani', 'farmer/profile-address', data, token);

export const setBiometricValue = (token, data) =>
  Post('petani', 'farmer/biometrict-flag', data, token);

export const loginBiometrics = data =>
  Post('petani', 'auth/biometrict-farmer', data);
