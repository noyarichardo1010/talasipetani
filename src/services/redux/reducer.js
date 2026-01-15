// import {combineReducers} from 'redux';
import {lightTheme} from '../../utils/styles';

import {
  SET_ISLOGIN,
  SET_LOADING,
  SET_MESSAGE,
  SET_MESSAGE_TYPE,
  SET_SHOW_ALERT,
  SET_TOKEN,
  SET_USER,
  ADD_QUEUE,
  DELETE_QUEUE,
  SET_PAGE,
  SET_PAGE_SIZE,
  SET_SELECTED_LOCATION,
  SET_SELECTED_STATUS,
  SET_INPUT,
  SET_LIST_DATA,
  SET_LIST_DATA_KOMODITI,
  SWITCH_THEME,
  SET_PICKED_ADDRESS,
  SET_NO_PENAWARAN,
  SET_WAREHOUSE_LIST,
  SET_BIOMETRIK_STATUS,
  SET_CHAT_MESSAGE,
  SET_CHAT_MESSAGES,
  SET_CHAT_HISTORY,
  SET_LIST_NOTIFICATIONS,
  SET_LIST_TRANSACTION_ACTIVE,
  SET_LIST_TRANSACTION_FINISH,
  SET_ON_UPDATE_IMAGE,
  SET_BIOMETRIK_LOADING,
  SET_BANK_LIST,
  SET_MASTER_BANK,
  SET_PHONE_LIST,
  SET_EMPTY_BANK,
  SET_EMPTY_ADDRESS,
  SET_VERIFIED,
  SET_EMAIL,
  SET_BANK_PRIMARY,
  SET_LASTEST_TRANSACTION,
  SET_ALL_LIST_TRANSACTION,
  SET_LASTEST_KOMODITI,
  SET_ALERT_TYPE,
  SET_LIST_CHAT,
  SET_RTC_TOKEN,
  SET_CALL_STATUS,
  SET_AGORA_OPTIONS,
  SET_AGORA_CHANNEL_PARAMS,
  SET_LABEL_STATUS,
  SET_CALL_TO_ID,
  SET_THERE_IS_INCOMING_CALL,
  SET_CALL_FROM_ID,
  SET_SHOW_END_CALL_BTN,
  SET_IS_SOCKET_CONNECTED,
  SET_CHANNEL_NAME,
  SET_SELECTED_KUPON,
  SET_CALL_FROM_NAME,
  SET_FROM_USER_PHOTO,
} from './action/list';

const initialState = {
  isSocketConnected: false,
  theme: lightTheme,
  loading: false,
  isBiometricsLoading: false,
  isLogin: false,
  isVerified: false,
  email: '',
  alert: false,
  message: '',
  messageType: '',
  token: '',
  queue: null,
  biometrikStatus: false,
  chatMessage: '',
  onUpdateImage: Math.random(),
  userInfo:
    // {
    //   id: 1,
    //   name: 'Fatahillah Ibrahim',
    //   email: 'idnfata@mail.com',
    //   phone: '085248864226',
    //   is_active: true,
    //   email_verified_at: null,
    //   created_at: '2023-01-31T03:27:16.000000Z',
    //   updated_at: '2023-01-31T03:27:16.000000Z',
    //   deleted_at: null,
    //   image_filepath: null,
    //   image_filename: null,
    //   image_url: '',
    // }
    null,
  chatHistory: [],
  listNotifications: [
    // {
    //   status: 'unread',
    //   type: 'balance',
    //   title: 'Penarikan Saldo Dalam Proses',
    //   desc: 'Penarikan saldo Anda dengan No. Penawaran 162738405918 sedang dalam proses maksimal 2x24 jam, mohon menunggu informasi selanjutnya.',
    //   date: '5 Feb 2023',
    // },
    // {
    //   status: 'read',
    //   type: 'transaction',
    //   title: 'Pembayaran Telah Diterima',
    //   desc: 'Pembayaran untuk No. Penawaran 162738405918 telah diterima.',
    //   date: '5 Feb 2023',
    // },
    // {
    //   status: 'read',
    //   type: 'transaction',
    //   title: 'Penawaran Baru Telah Dibuat',
    //   desc: 'Penarikan saldo Anda dengan No. Penawaran 162738405918 sedang dalam proses maksimal 2x24 jam, mohon menunggu informasi selanjutnya.',
    //   date: '5 Feb 2023',
    // },
  ],
};

const homeState = {
  selectedLocation: '0',
  selectedStatus: '',
  input: '',
  page: 1,
  pageSize: 5,
  listData: [],
  listKomoditi: [],
  lastestKomoditi: [],
};

const locationState = {
  pickedAddress: {
    latitude: null,
    longitude: null,
    name: '',
  },
  input: '',
};

const penawaranState = {
  penawaranBaru: null,
  warehouseList: [],
  transactionActive: null,
  transactionFinish: null,
  transactionListAll: [],
  transactionLastest: null,
  SelectedKupon: null,
};

const profileState = {
  bankMaster: [],
  bankList: [],
  bankPrimary: null,
  phoneList: [],
  emptyBank: false,
  emptyAddress: false,
};

const chatState = {
  listChat: [],
};

const callState = {
  channelName: 'CALL-USER-',
  rtcToken: '',
  callStatus: '',
  labelStatus: '',
  isThereIsIncomingCall: false,
  callToID: 0,
  callFromID: 0,
  callFromName: '',
  fromUserPhoto: '',
  agoraOptions: {appId: '3cce61a68f6b46a1af18245a0a9c0993'},
  agoraChannelParams: {},
  showEndCallBtn: false,
};

export const ChatReducer = (state = chatState, action) => {
  switch (action.type) {
    case SET_LIST_CHAT:
      return {
        ...state,
        listChat: action.value,
      };
    default:
      break;
  }
  return state;
};

export const CallReducer = (state = callState, action) => {
  switch (action.type) {
    case SET_FROM_USER_PHOTO:
      return {
        ...state,
        fromUserPhoto: action.value,
      };
    case SET_CHANNEL_NAME:
      return {
        ...state,
        channelName: action.value,
      };
    case SET_RTC_TOKEN:
      return {
        ...state,
        rtcToken: action.value,
      };
    case SET_THERE_IS_INCOMING_CALL:
      return {
        ...state,
        isThereIsIncomingCall: action.value,
      };
    case SET_CALL_TO_ID:
      return {
        ...state,
        callToID: action.value,
      };
    case SET_CALL_FROM_ID:
      return {
        ...state,
        callFromID: action.value,
      };
    case SET_CALL_FROM_NAME:
      return {
        ...state,
        callFromName: action.value,
      };
    case SET_LABEL_STATUS:
      return {
        ...state,
        labelStatus: action.value,
      };
    case SET_CALL_STATUS:
      return {
        ...state,
        callStatus: action.value,
      };
    case SET_AGORA_OPTIONS:
      return {
        ...state,
        agoraOptions: action.value,
      };
    case SET_AGORA_CHANNEL_PARAMS:
      return {
        ...state,
        agoraChannelParams: action.value,
      };
    case SET_SHOW_END_CALL_BTN:
      return {
        ...state,
        showEndCallBtn: action.value,
      };
    default:
      break;
  }
  return state;
};

export const HomeReducer = (state = homeState, action) => {
  // console.log('HomeReducer', action);

  switch (action.type) {
    case SET_PAGE:
      return {
        ...state,
        page: action.value,
      };
    case SET_PAGE_SIZE:
      return {
        ...state,
        pageSize: action.value,
      };
    case SET_SELECTED_STATUS:
      return {
        ...state,
        selectedStatus: action.value,
      };
    case SET_SELECTED_LOCATION:
      return {
        ...state,
        selectedLocation: action.value,
      };
    case SET_INPUT:
      return {
        ...state,
        input: action.value,
      };
    case SET_LIST_DATA:
      return {
        ...state,
        listData: action.value,
      };
    case SET_LIST_DATA_KOMODITI:
      return {
        ...state,
        listKomoditi: action.value,
      };
    case SET_LASTEST_KOMODITI:
      console.log('SET_LASTEST_KOMODITI', action.value);
      return {
        ...state,
        lastestKomoditi: action.value,
      };
    default:
      break;
  }
  return state;
};

export const GlobalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_SOCKET_CONNECTED:
      return {
        ...state,
        isSocketConnected: action.value,
      };
    case SET_USER:
      return {
        ...state,
        userInfo: action.value,
      };
    case SET_EMAIL:
      return {
        ...state,
        email: action.value,
      };
    case SET_ISLOGIN:
      return {
        ...state,
        isLogin: action.value,
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.value,
      };
    case SET_VERIFIED:
      return {
        ...state,
        isVerified: action.value,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.value,
      };
    case SET_BIOMETRIK_LOADING:
      return {
        ...state,
        isBiometricsLoading: action.value,
      };
    case SET_ON_UPDATE_IMAGE:
      return {
        ...state,
        onUpdateImage: action.value,
      };
    case SET_SHOW_ALERT:
      return {
        ...state,
        alert: action.value,
      };
    case SET_ALERT_TYPE:
      return {
        ...state,
        alertType: action.value,
      };
    case SET_MESSAGE:
      return {
        ...state,
        message: action.value,
      };
    case SET_MESSAGE_TYPE:
      return {
        ...state,
        messageType: action.value,
      };
    case SWITCH_THEME:
      return {
        ...state,
        theme: action.value,
      };
    case ADD_QUEUE:
      return {
        ...state,
        queue: action.value,
      };
    case DELETE_QUEUE:
      return {
        ...state,
        queue: action.value,
      };
    case SET_BIOMETRIK_STATUS:
      return {
        ...state,
        biometrikStatus: action.value,
      };
    case SET_CHAT_MESSAGE:
      return {
        ...state,
        chatMessage: action.value,
      };
    case SET_CHAT_MESSAGES:
      return {
        ...state,
        chatMessages: action.value,
      };
    case SET_CHAT_HISTORY:
      return {
        ...state,
        chatHistory: action.value,
      };
    case SET_LIST_NOTIFICATIONS:
      return {
        ...state,
        listNotifications: action.value,
      };
    default:
      break;
  }
  return state;
};

export const LocationReducer = (state = locationState, action) => {
  switch (action.type) {
    case SET_PICKED_ADDRESS:
      return {
        ...state,
        pickedAddress: action.value,
      };

    default:
      break;
  }
  return state;
};

export const PenawaranReducer = (state = penawaranState, action) => {
  switch (action.type) {
    case SET_SELECTED_KUPON:
      return {
        ...state,
        SelectedKupon: action.value,
      };
    case SET_NO_PENAWARAN:
      return {
        ...state,
        penawaranBaru: action.value,
      };
    case SET_WAREHOUSE_LIST:
      return {
        ...state,
        warehouseList: action.value,
      };
    case SET_ALL_LIST_TRANSACTION:
      return {
        ...state,
        transactionListAll: action.value,
      };
    case SET_LASTEST_TRANSACTION:
      return {
        ...state,
        transactionLastest: action.value,
      };
    case SET_LIST_TRANSACTION_ACTIVE:
      return {
        ...state,
        transactionActive: action.value,
      };
    case SET_LIST_TRANSACTION_FINISH:
      return {
        ...state,
        transactionFinish: action.value,
      };

    default:
      break;
  }
  return state;
};

export const ProfileReducer = (state = profileState, action) => {
  // console.log('==================== action profile', action);

  switch (action.type) {
    case SET_MASTER_BANK:
      return {
        ...state,
        bankMaster: action.value,
      };
    case SET_BANK_LIST:
      return {
        ...state,
        bankList: action.value,
      };
    case SET_BANK_PRIMARY:
      return {
        ...state,
        bankPrimary: action.value,
      };
    case SET_PHONE_LIST:
      return {
        ...state,
        phoneList: action.value,
      };

    case SET_EMPTY_BANK:
      return {
        ...state,
        emptyBank: action.value,
      };
    case SET_EMPTY_ADDRESS:
      return {
        ...state,
        emptyAddress: action.value,
      };
    default:
      break;
  }
  return state;
};

// const reducer = combineReducers({
//   InspectionReducer,
//   GlobalReducer,
//   TestReducer,
// });

// export default reducer;
