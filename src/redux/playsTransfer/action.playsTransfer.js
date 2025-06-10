import { createAction } from '@reduxjs/toolkit';
import {
  getTransactionHistoryHttp,
  getTransferPlaysHttp,
} from './http.playsTransfer';
import { toastMessage } from '@/utils/helpers/toastMessage';
import { TOAST_TYPE } from '@/utils/constant/constant.helper';

export const LOADING_KEYS = {
  TRANSACTION_HISTORY_LOADER: 'transactionHistoryLoader',
  TRANSFER_PLAYS_LOADER: 'transferPlaysLoader',
};

export const setLoading = createAction('playsTransfer/setLoading');
export const setPlaysTransactionHistory = createAction(
  'playsTransfer/setPlaysTransactionHistory',
);

export const getTransferPlaysAction = (data, cb) => {
  return async (dispatch) => {
    dispatch(
      setLoading({ key: LOADING_KEYS.TRANSFER_PLAYS_LOADER, value: true }),
    );
    const res = await getTransferPlaysHttp(data);
    cb?.(res);
    if (res?.success)
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.SUCCESS,
      });
    else
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.ERROR,
      });

    dispatch(
      setLoading({ key: LOADING_KEYS.TRANSFER_PLAYS_LOADER, value: false }),
    );
  };
};

export const getTransactionHistoryAction = (playerId, params, cb) => {
  return async (dispatch, getState) => {
    const { playsTransactionHistory } = getState().playsTransfer;
    dispatch(
      setLoading({ key: LOADING_KEYS.TRANSACTION_HISTORY_LOADER, value: true }),
    );
    const res = await getTransactionHistoryHttp(playerId, params);
    cb?.(res);
    if (res?.success)
      dispatch(
        setPlaysTransactionHistory({
          data:
            res.metadata?.page === 0
              ? res?.data
              : playsTransactionHistory.concat(res?.data),
          metadata: res.metadata,
        }),
      );
    else
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.ERROR,
      });
    dispatch(
      setLoading({
        key: LOADING_KEYS.TRANSACTION_HISTORY_LOADER,
        value: false,
      }),
    );
  };
};
