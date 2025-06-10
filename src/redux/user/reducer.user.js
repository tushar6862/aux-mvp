import { createReducer } from '@reduxjs/toolkit';
import {
  LOADING_KEYS,
  setAuctionHouseInfo,
  setAvatarList,
  setFirstLoad,
  setLoading,
  setUserInfo,
  setWalletBalance,
} from './action.user';

const initialState = {
  [LOADING_KEYS.LOGIN_LOADER]: false,
  [LOADING_KEYS.SEND_OTP]: false,
  [LOADING_KEYS.FORM_LOADER]: false,
  auctionHouseInfo: {},
  userInfo: {},
  avatarList: [],
  walletBalance: 0,
  firstLoad: true,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setLoading, (state, { payload }) => {
      const { key, value } = payload;
      state[key] = value;
    })
    .addCase(setAuctionHouseInfo, (state, { payload }) => {
      state.auctionHouseInfo = payload;
    })
    .addCase(setUserInfo, (state, { payload }) => {
      state.userInfo = payload;
    })
    .addCase(setAvatarList, (state, { payload }) => {
      state.avatarList = payload;
    })
    .addCase(setWalletBalance, (state, { payload }) => {
      state.walletBalance = payload;
    })
    .addCase(setFirstLoad, (state, { payload }) => {
      state.firstLoad = payload;
    });
});

export const userState = (state) => state?.user;
