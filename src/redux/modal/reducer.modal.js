import { createReducer } from '@reduxjs/toolkit';
import {
  LOGIN_BTN_KEYS,
  MODAL_KEYS,
  OVERLAY_KEYS,
  setLoginBtnLoading,
  setModal,
} from './action.modal';

const initialValue = {
  [MODAL_KEYS.LOGIN]: false,
  [MODAL_KEYS.BUY_PLAYS]: false,
  [MODAL_KEYS.HAMBURGER_MENU]: false,
  [MODAL_KEYS.WINNER]: false,
  [LOGIN_BTN_KEYS.EMAIL]: false,
  [LOGIN_BTN_KEYS.WALLET]: false,
  [LOGIN_BTN_KEYS.TELEGRAM]: false,
  [OVERLAY_KEYS.LOW_BALANCE]: false,
};

export const modalReducer = createReducer(initialValue, (builder) =>
  builder
    .addCase(setModal, (state, { payload }) => {
      const { key, value } = payload;
      state[key] = value;
    })

    .addCase(setLoginBtnLoading, (state, { payload }) => {
      const { key, value } = payload;
      state[key] = value;
    }),
);

export const modalState = (state) => state?.modal;
