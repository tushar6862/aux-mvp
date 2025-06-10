import { createReducer } from '@reduxjs/toolkit';
import {
  LOADING_KEYS,
  setIsClaimed,
  setLoading,
  setShippingIno,
} from './action.shipping';

const initialState = {
  [LOADING_KEYS.ADD_SHIPPING_INFO_LOADER]: false,
  [LOADING_KEYS.SHIPPING_INFO_LOADER]: false,
  [LOADING_KEYS.DELETE_SHIPPING_INFO_LOADER]: false,
  shippingInfo: {},
  isClaimed: false,
};

export const shippingReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setLoading, (state, { payload }) => {
      const { key, value } = payload;
      state[key] = value;
    })
    .addCase(setShippingIno, (state, { payload }) => {
      state.shippingInfo = payload;
    })
    .addCase(setIsClaimed, (state, { payload }) => {
      state.isClaimed = payload;
    });
});
