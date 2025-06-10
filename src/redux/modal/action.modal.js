import { createAction } from '@reduxjs/toolkit';

export const MODAL_KEYS = {
  LOGIN: 'loginModal',
  BUY_PLAYS: 'buyPlaysModal',
  USER_INFO: 'userInfoModal',
  HAMBURGER_MENU: 'hamburgerMenuModal',
  WINNER: 'winnerModal',
};

export const OVERLAY_KEYS = {
  LOW_BALANCE: 'lowBalanceOverlay',
};

export const LOGIN_BTN_KEYS = {
  EMAIL: 'emailLoginLoader',
  WALLET: 'walletLoginLoader',
  TELEGRAM: 'telegramLoader',
};

export const setModal = createAction('modal/setModal');
export const setLoginBtnLoading = createAction('LoginBtn/setLoginBtnLoading');
