import { createReducer } from '@reduxjs/toolkit';
import {
  LOADING_KEYS,
  setLoading,
  setPlaysTransactionHistory,
} from './action.playsTransfer';

const initialState = {
  [LOADING_KEYS.TRANSACTION_HISTORY_LOADER]: false,
  [LOADING_KEYS.TRANSFER_PLAYS_LOADER]: false,
  playsTransactionHistory: [],
  metaData: {},
};

export const playsTransferReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setLoading, (state, { payload }) => {
      const { key, value } = payload;
      state[key] = value;
    })
    .addCase(setPlaysTransactionHistory, (state, { payload }) => {
      const { data, metadata } = payload;
      state.playsTransactionHistory = data;
      state.metaData = metadata;
    });
});

export const playsTransferState = (state) => state?.playsTransfer;
