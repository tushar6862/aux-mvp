import {
  addShippingInfoHttp,
  deleteShippingInfoHttp,
  getShippingInfoHttp,
} from './http.shipping';
import { TOAST_TYPE } from '@/utils/constant/constant.helper';
import { toastMessage } from '@/utils/helpers/toastMessage';

const { createAction } = require('@reduxjs/toolkit');

export const LOADING_KEYS = {
  DELETE_SHIPPING_INFO_LOADER: 'deleteShippingLoader',
  SHIPPING_INFO_LOADER: 'getShippingLoader',
  ADD_SHIPPING_INFO_LOADER: 'addShippingLoader',
};

export const setLoading = createAction('shippingInfo/setLoading');
export const setShippingIno = createAction('shippingInfo/setShippingInfo');
export const setIsClaimed = createAction('shippingInfo/setIsClaimed');

export const addShippingInfoAction = (data, cb) => {
  return async (dispatch) => {
    dispatch(
      setLoading({ key: LOADING_KEYS.ADD_SHIPPING_INFO_LOADER, value: true }),
    );
    const res = await addShippingInfoHttp(data);
    cb?.(res);
    if (res?.success) {
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.SUCCESS,
      });
      dispatch(setIsClaimed(true));
    } else
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.ERROR,
      });
    dispatch(
      setLoading({ key: LOADING_KEYS.ADD_SHIPPING_INFO_LOADER, value: false }),
    );
  };
};

export const getShippingInfoAction = (params, cb) => {
  return async (dispatch) => {
    dispatch(
      setLoading({ key: LOADING_KEYS.SHIPPING_INFO_LOADER, value: true }),
    );

    const res = await getShippingInfoHttp(params);
    cb?.(res);
    if (res?.success) {
      if (res?.data?.id) {
        dispatch(setIsClaimed(true));
      } else dispatch(setIsClaimed(false));
      dispatch(setShippingIno(res?.data));
    } else
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.ERROR,
      });
    dispatch(
      setLoading({ key: LOADING_KEYS.SHIPPING_INFO_LOADER, value: false }),
    );
  };
};

export const deleteShippingInfoAction = (params, cb) => {
  return async (dispatch) => {
    dispatch(
      setLoading({
        key: LOADING_KEYS.DELETE_SHIPPING_INFO_LOADER,
        value: true,
      }),
    );
    const res = await deleteShippingInfoHttp(params);
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
      setLoading({
        key: LOADING_KEYS.DELETE_SHIPPING_INFO_LOADER,
        value: false,
      }),
    );
  };
};
