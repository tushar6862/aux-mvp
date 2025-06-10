import { createAction } from '@reduxjs/toolkit';

export const SOCKET_DATA_KEYS = {
  AVATARS: 'AVATARS',
  BID_PERCENTAGE: 'BID_PERCENTAGE',
};

export const setSocketData = createAction('socket/setSocketData');
export const setIsSocketConnected = createAction('socket/setIsSocketConnected');
