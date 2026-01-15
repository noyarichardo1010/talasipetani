// import {ENV_SCOPE, BASE_URL_STAGGING, BASE_URL_PRODUCTION} from '@env';
const ENV_SCOPE = 'STAGGING';
// # STAGGING
// # PRODUCTION
const GMAPS_KEY = 'AIzaSyDoejUQ6JR84D8Od0W-tBLlYURoi7mU27A';
const BASE_URL_PRODUCTION = 'https://api.talasi.com';
const BASE_URL_STAGGING = 'https://api.talasi.codr-staging.id';
const SOCKET_URL_PRODUCTION = 'wss://ws.talasi.com';
const SOCKET_URL_STAGGING = 'wss://websocket.talasi.codr-staging.id';
const AGORA_APP_ID = '3cce61a68f6b46a1af18245a0a9c0993';

// url API
export const BASE_URL =
  ENV_SCOPE === 'STAGGING' ? BASE_URL_STAGGING : BASE_URL_PRODUCTION;
export const SOCKET_URL =
  ENV_SCOPE === 'STAGGING' ? SOCKET_URL_STAGGING : SOCKET_URL_PRODUCTION;

export {GMAPS_KEY, AGORA_APP_ID};
