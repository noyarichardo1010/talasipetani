// import io from 'socket.io-client/dist/socket.io.js'; //<----import--
import { io } from 'socket.io-client';
import {SOCKET_URL} from '../../../services/api/url';

let socket;
// const idUser = checkIdUser();

export const initiateChat = (room, usernameSendUser, idUser) => {
  socket = io(SOCKET_URL, {jsonp: false});
  // console.log('room', room);
  console.log('usernameSendUser', usernameSendUser);
  console.log('idUser', usernameSendUser);

  socket.on('connect_error', err => {
    console.log('error connect', err);
    console.log(`websocket connect_error due to ${err.message}`);
  });
  // console.log('socket', socket);
  socket.on('connect', () => {
    console.log('connecttttt');

    // Saat terkoneksi maka akan request join room
    socket.emit('joinRoomFarmer', {
      user_id: parseInt(idUser),
      chat_room_id: parseInt(room),
      name: usernameSendUser,
    });

    // Setelah join room, wajib mengirimkan request empty message
    socket.emit('ChatInit', {
      user_id: parseInt(idUser),
      chat_room_id: parseInt(room),
      name: usernameSendUser,
      message: '',
      offer_id: 0,
      coupon_id: 0,
    });
  });
};

export const disconnectChat = () => {
  console.log('Disconnecting socket...');
  if (socket) {
    socket.disconnect();
  }
};

export const subscribeToChat = async cb => {
  if (!socket) {
    return true;
  }
  socket.on('reply-join', msg => {
    console.log('msg reply join', msg);
    return cb(msg);
    // return msg;
  });
};

export const subscribeToNewChat = async cb => {
  if (!socket) {
    return true;
  }
  socket.on('reply-chat', msg => {
    console.log('SOCKET_URL', SOCKET_URL);
    console.log('msg reply chat', msg);
    if (msg) {
      return cb(msg);
    }
    return null;
  });
};

export const sendMessage = (room, usernameSendUser, message, idUser) => {
  if (socket) {
    socket.emit('Chat', {
      user_id: parseInt(idUser),
      chat_room_id: parseInt(room),
      name: usernameSendUser,
      message: message.contentMessage,
      offer_id: message.offerId,
      coupon_id: message.couponId,
    });
  }
};

export const sendAttachmentMessage = (
  room,
  usernameSendUser,
  text,
  files,
  idUser,
) => {
  console.log('room', room);
  console.log('text', text);
  console.log('files', files);
  if (socket) {
    socket.emit('Chat', {
      user_id: parseInt(idUser),
      chat_room_id: parseInt(room),
      name: usernameSendUser,
      message: text,
      files: files,
    });
  }
};

export const sendOfferMessage = (room, usernameSendUser, offer_id, idUser) => {
  console.log('offer_id', offer_id);
  if (socket) {
    socket.emit('Chat', {
      user_id: parseInt(idUser),
      chat_room_id: parseInt(room),
      name: usernameSendUser,
      message: '',
      offer_id: offer_id,
      coupon_id: 0,
    });
  }
};
