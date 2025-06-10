// utils/socketService.js
import { log } from '@/utils/helpers/logger.helper';
import { io } from 'socket.io-client';

let socket;

export const initiateSocketConnection = (token, callback) => {
  const BASE_URL = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${
    token ? `v1?accesstoken=${token}` : 'v2'
  }`;
  log('info', `Socket URL : ${BASE_URL}`);

  socket = io(BASE_URL, {
    multiplex: false,
    reconnectionDelay: 9000,
    transports: ['websocket'],
    reconnectionAttempts: 5,
  });
  log('info', 'Connection....');
  console.log('Connecting socket...');

  socket.on('connect', () => {
    log('info', 'Connected to server');
    console.log('Connected to server');
    callback?.({ success: true });
  });

  socket.on('connect_error', (error) => {
    log('warn', `Connection error : ${error}`);
    // if (retry > 3) socket = io(BASE_URL);
    // retry++;

    // the reason of the error, for example "xhr poll error"
    console.error(error, 'ERORR');
    callback?.({
      success: false,
      error,
    });
  });

  socket.on('disconnect', () => {
    log('info', 'Disconnected from server');
    console.log('Disconnected from server');
  });
};

export const disconnectSocket = () => {
  console.log('Disconnecting socket...');
  log('info', 'Disconnecting socket...');
  if (socket) socket.disconnect(true);
};

export const subscribeToEvent = (eventName, callback) => {
  if (!socket) return;
  log('info', `Subscribing : ${eventName}`);
  socket.on(eventName, callback);
};

/**
 * @desc Removes all listeners, or those of the specified eventName.
 *  for more information visit
  https://socket.io/docs/v4/listening-to-events/#:~:text=socket.removeAllListeners(%5BeventName%5D,those%20of%20the%20specified%20eventName.
 */

export const clearAllCallBackToEvent = (eventName) => {
  if (!socket) return;
  socket.removeAllListeners(eventName);
};

export const emitEvent = (eventName, data) => {
  log('info', `Emit event : ${eventName}`);
  if (socket) socket.emit(eventName, data);
};

export const isConnected = () => {
  if (socket) return socket?.connected;
  return false;
};
