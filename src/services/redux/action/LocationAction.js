import {SET_PICKED_ADDRESS} from './list';

export const setPickedAddress = value => async dispatch => {
  return dispatch({type: SET_PICKED_ADDRESS, value: value});
};
