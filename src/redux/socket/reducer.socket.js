import { createReducer } from '@reduxjs/toolkit';
import {
  setIsSocketConnected,
  setSocketData,
  SOCKET_DATA_KEYS,
} from './action.socket';

const initialState = {
  [SOCKET_DATA_KEYS.AVATARS]: null,
  [SOCKET_DATA_KEYS.BID_PERCENTAGE]: null,
  isSocketConnected: false,
};

export const socketReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setSocketData, (state, { payload }) => {
      const { key, value } = payload;
      state[key] = value;
    })
    .addCase(setIsSocketConnected, (state, { payload }) => {
      state.isSocketConnected = payload;
    });
});

export const socketState = (state) => state.socket;
