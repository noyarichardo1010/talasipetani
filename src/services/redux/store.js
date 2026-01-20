// import {createStore, applyMiddleware} from 'redux';
// import thunk from 'redux-thunk';
// import reducer from './reducer';
// //store ini adalah sebuah tempat/wadah untuk menyimpan state secara global
// const store = createStore(reducer, applyMiddleware(thunk));

// export default store;

import {createStore, applyMiddleware, combineReducers} from 'redux';
import {thunk} from 'redux-thunk';
//& OFFLINE SUPPORT
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GlobalReducer,
  HomeReducer,
  LocationReducer,
  ProfileReducer,
  PenawaranReducer,
  ChatReducer,
  CallReducer,
} from './reducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'requests',
    'userInfo',
    'token',
    'email',
    'bankList',
    'bankPrimary',
    'listChat',
  ],
};

const rootReducer = combineReducers({
  home: persistReducer(persistConfig, HomeReducer),
  location: persistReducer(persistConfig, LocationReducer),
  global: persistReducer(persistConfig, GlobalReducer),
  profile: persistReducer(persistConfig, ProfileReducer),
  penawaran: persistReducer(persistConfig, PenawaranReducer),
  chat: persistReducer(persistConfig, ChatReducer),
  call: persistReducer(persistConfig, CallReducer),
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
