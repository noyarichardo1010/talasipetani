// import io from 'socket.io-client/dist/socket.io.js'; //<----import--
import { io } from 'socket.io-client';
import {SOCKET_URL} from '../../../services/api/url';
const URL = SOCKET_URL;
// Konfigurasi Socket.IO
export const socket = io(URL, {
  transports: ['websocket'],
  json: false,
});
