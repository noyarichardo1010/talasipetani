// import io from 'socket.io-client/dist/socket.io.js'; //<----import--
import { io } from 'socket.io-client';
import {SOCKET_URL} from '../../../services/api/url';

let socket;
// const idUser = checkIdUser();

export const availableToCall = token => {
  socket = io(SOCKET_URL, {jsonp: false});
  // console.log('room', room);
  // console.log('usernameSendUser', usernameSendUser);

  socket.on('connect_error', err => {
    console.log('error connect', err);
    console.log(`websocket connect_error due to ${err.message}`);
  });
  // console.log('socket', socket);
  socket.on('connect', () => {
    console.log('availbale', token);

    // Saat terkoneksi maka akan request join room
    socket.emit('joinMyVoiceCallRoom', {current_user_token: token});

    // socket.emit('doVoiceCall', {
    //   current_user_token: token,
    //   target_user_id: target_id,
    // });
  });
};

export const disconnectCall = (rtcToken, callFromID, callToID) => {
  socket.emit('incomingCallAction', {
    rtc_token: rtcToken,
    call_from: callFromID,
    call_to: callToID,
    action: 'ENDED', // constant status (all uppercase)
  });
};
