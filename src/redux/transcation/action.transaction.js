import { createAction } from '@reduxjs/toolkit';
import { buyPlaysHttp, getCurrentPlaysValuesHttp } from './http.transaction';

export const LOADING_KEYS = {
  BUY_PLAYS: 'buyPlaysLoading',
};
export const setLoading = createAction('transaction/setLoading');
export const setAmountPerPlays = createAction('transaction/setAmountPerPlays');

export const getCurrentPlaysValues = () => {
  return async (dispatch) => {
    dispatch(setLoading({ key: LOADING_KEYS.BUY_PLAYS, value: true }));
    try {
      const res = await getCurrentPlaysValuesHttp();
      if (res.success) {
        dispatch(setAmountPerPlays(res?.data?.amountPerPlays || null));
      }
    } catch (error) {
      console.error(error);
    }
    dispatch(setLoading({ key: LOADING_KEYS.BUY_PLAYS, value: false }));
  };
};

export const generateBuyPlaysLink = (data, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: LOADING_KEYS.BUY_PLAYS, value: true }));
    try {
      const res = await buyPlaysHttp(data);
      if (res.success) {
        cb(res);
      }
    } catch (error) {
      console.error(error);
    }
    dispatch(setLoading({ key: LOADING_KEYS.BUY_PLAYS, value: false }));
  };
};
