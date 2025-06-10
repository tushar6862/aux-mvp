import { createReducer } from '@reduxjs/toolkit';
import {
  LOADING_KEYS,
  setAmountPerPlays,
  setLoading,
} from './action.transaction';

const initialState = {
  [LOADING_KEYS.BUY_PLAYS]: false,
  amountPerPlays: null,
};

export const transactionReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setLoading, (state, { payload }) => {
      const { key, value } = payload;
      state[key] = value;
    })
    .addCase(setAmountPerPlays, (state, { payload }) => {
      state.amountPerPlays = payload;
    });
});

export const transactionState = (state) => state?.transaction;
