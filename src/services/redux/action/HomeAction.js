import API from '../../api';
import {setLoading} from './GlobalAction';
import {
  SET_INPUT,
  SET_LIST_DATA,
  SET_LIST_DATA_KOMODITI,
  SET_LASTEST_KOMODITI,
  SET_PAGE,
  SET_PAGE_SIZE,
  SET_SELECTED_LOCATION,
  SET_SELECTED_STATUS,
} from './list';

export const setPage = value => async dispatch => {
  return dispatch({type: SET_PAGE, value: value});
};

export const setPageSize = value => async dispatch => {
  return dispatch({type: SET_PAGE_SIZE, value: value});
};

export const setSelectedLocation = value => async dispatch => {
  return dispatch({type: SET_SELECTED_LOCATION, value: value});
};

export const setSelectedStatus = value => async dispatch => {
  return dispatch({type: SET_SELECTED_STATUS, value: value});
};

export const setInput = value => async dispatch => {
  return dispatch({type: SET_INPUT, value: value});
};
export const setListData = value => async dispatch => {
  return dispatch({type: SET_LIST_DATA, value: value});
};

export const getListKomoditi = (url, page, limit, filter) => async dispatch => {
  // dispatch(setLoading(true));
  console.log('filter', filter);
  let filterQuery =
    filter && filter?.id !== 0 ? `&warehouse_id=${filter?.id}` : '';
  return new Promise((resolve, reject) => {
    API.get(`${url}?page=${page}&limit=${limit}&sort=updated_at-${filterQuery}`)
      .then(res => {
        console.log('res getListKomoditi', res);
        if (res?.meta?.http_status === 200) {
          let result = res?.data ?? [];
          // console.log('dispatch', dispatch());
          dispatch({
            type: SET_LIST_DATA_KOMODITI,
            value: result,
          });
          dispatch({
            type: SET_LASTEST_KOMODITI,
            value: result.length > 0 ? result[0] : null,
          });
          console.log('result', result);
          console.log('lastest', result[0]);
          resolve({data: result, meta: res.meta, success: true});
        } else {
          reject({
            message: res?.message ? res?.message : 'Network Error',
            success: false,
          });
        }

        // dispatch(setLoading(false));
      })
      .catch(err => {
        console.log('err.response', err);
        const errorData = err?.response?.data?.errors[0];
        console.log('errorData', errorData);
        // dispatch(setLoading(false));
        reject({...errorData, success: false});
      });
  }).catch(err => err);
};

export const getListWarehouse = (page, limit) => async dispatch => {
  // dispatch(setLoading(true));
  let pageQuery = page ? `page=${page}&` : '';
  let limitQuery = limit ? `limit=${limit}&` : '';
  return new Promise((resolve, reject) => {
    console.log('redux getListWarehouse');
    API.get(`/farmer/warehouse?${pageQuery}${limitQuery}sort=updated_at-`)
      .then(res => {
        console.log('res getListWarehouse', res);
        if (res?.meta?.http_status === 200) {
          let result = res?.data ?? [];
          resolve({data: result, meta: res.meta, success: true});
        } else {
          reject({
            message: res?.message ? res?.message : 'Network Error',
            success: false,
          });
        }

        // dispatch(setLoading(false));
      })
      .catch(err => {
        console.log('err.response', err);
        const errorData = err?.response?.data?.errors[0];
        console.log('errorData', errorData);
        // dispatch(setLoading(false));
        reject({...errorData, success: false});
      });
  }).catch(err => err);
};

export const getDetailWarehouseKomoditi =
  (idk, page, limit, search) => async dispatch => {
    // dispatch(setLoading(true));
    return new Promise((resolve, reject) => {
      console.log('redux getListWarehouse');
      API.get(
        `/farmer/warehouse/detail-data/${idk}?page=${page}&limit=${limit}&search=${search}`,
      )
        .then(res => {
          console.log('res getListWarehouse', res);
          if (res?.meta?.http_status === 200) {
            let result = res?.data ?? [];
            resolve({data: result, meta: res.meta, success: true});
          } else {
            reject({
              message: res?.message ? res?.message : 'Network Error',
              success: false,
            });
          }

          // dispatch(setLoading(false));
        })
        .catch(err => {
          console.log('err.response', err);
          const errorData = err?.response?.data?.errors[0];
          console.log('errorData', errorData);
          // dispatch(setLoading(false));
          reject({...errorData, success: false});
        });
    }).catch(err => err);
  };

export const getVersion = () => async dispatch => {
  // console.log('red getVersion');
  // dispatch(setLoading(true));
  return new Promise((resolve, reject) => {
    API.get('/latest-app-version/farmer')
      .then(res => {
        console.log('res getVersion', res);
        if (res?.meta?.http_status === 200) {
          let result = res?.data;
          resolve({data: result, success: true});
        } else {
          reject({
            message: res?.message ? res?.message : 'Network Error',
            success: false,
          });
        }

        // dispatch(setLoading(false));
      })
      .catch(err => {
        console.log('err.response', err);
        const errorData = err?.response?.data?.errors[0];
        console.log('errorData', errorData);
        // dispatch(setLoading(false));
        reject({...errorData, success: false});
      });
  }).catch(err => err);
};
