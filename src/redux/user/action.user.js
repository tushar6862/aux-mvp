import { createAction } from '@reduxjs/toolkit';
import {
  getAuctionHouseInfoHttp,
  getAvatarListHttp,
  getWalletBallanceHttp,
  updateUserInfoHttp,
  userLoginHttp,
  userLogoutHttp,
  userSendOtpHttp,
  uploadAvatarHttp,
} from './http.user';
import storage from '@/utils/helpers/storage.helper';
import { MODAL_KEYS, OVERLAY_KEYS, setModal } from '../modal/action.modal';
import { buildLoginRequestBody } from '@/utils/helpers/utils.helper';
import { disconnectSocket } from '@/lib/socket';
import { setIsSocketConnected } from '../socket/action.socket';
import { toastMessage } from '@/utils/helpers/toastMessage';
import {
  COOKIE_STORAGE,
  FIRST_TIME_LOAD_TIME,
  LOW_WALLET_BALANCE,
  TOAST_TYPE,
} from '@/utils/constant/constant.helper';
import Cookies from 'js-cookie';

export const LOADING_KEYS = {
  LOGIN_LOADER: 'loginLoader',
  SEND_OTP: 'sendOtpLoader',
  FORM_LOADER: 'formLoader',
};

export const setLoading = createAction('user/setLoading');
export const setAuctionHouseInfo = createAction('user/setAuctionHouseInfo');
export const setUserInfo = createAction('user/setUserInfo');
export const setAvatarList = createAction('user/setAvatarList');
export const setWalletBalance = createAction('user/setWalletBalance');
export const setFirstLoad = createAction('user/setFirstLoad');

// params -> subdomain:hostname
export const getAuctionHouseInfoAction = (params, cb) => {
  return async (dispatch) => {
    const res = await getAuctionHouseInfoHttp(params);

    if (res?.success) {
      dispatch(setAuctionHouseInfo(res?.data));
      const userCookie = Cookies.get(COOKIE_STORAGE.USER);
      const userData = userCookie ? JSON.parse(userCookie) : {};
      const firstLoadWillShow = storage.getFirstLoadWillShow();

      if (firstLoadWillShow) dispatch(setFirstLoad(false));
      if (!firstLoadWillShow)
        setTimeout(() => {
          dispatch(setFirstLoad(false));
          storage.setFirstLoadWillShow?.(true);
        }, FIRST_TIME_LOAD_TIME);

      cb?.({ ...res, userData });
      if (userData?.accessToken) {
        dispatch(setUserInfo(userData));
        dispatch(getWalletBalanceAction(userData?.id));
        if (!userData.is_verified) {
          dispatch(setModal({ key: MODAL_KEYS.USER_INFO, value: true }));
        }
      }
    } else
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.ERROR,
      });
  };
};

// Add this action to your user action file
export const uploadAvatarAction = (file, cb) => {
  return async (dispatch, getState) => {
    dispatch(setLoading({ key: LOADING_KEYS.FORM_LOADER, value: true }));
    const { userInfo } = getState().user;
    const res = await uploadAvatarHttp(userInfo?.id, file);
    cb?.(res);
    if (res.success) {
      // Update user info with the new avatar URL
      const updatedUserInfo = {
        ...userInfo,
        avatar: res.data.url || res.data.avatar,
      };
      dispatch(setUserInfo(updatedUserInfo));
      Cookies.set(COOKIE_STORAGE.USER, JSON.stringify(updatedUserInfo));
    } else {
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.ERROR,
      });
    }
    dispatch(setLoading({ key: LOADING_KEYS.FORM_LOADER, value: false }));
  };
};

// payload={type,data}
export const userLoginAction = (payload, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: LOADING_KEYS.LOGIN_LOADER, value: true }));

    const data = await buildLoginRequestBody(payload);
    const res = await userLoginHttp(data);
    cb?.(res);
    if (res?.success) {
      if (Object.keys(res?.data).length) {
        dispatch(getWalletBalanceAction(res.data?.id));
        dispatch(setUserInfo(res.data));
        Cookies.set(COOKIE_STORAGE.USER, JSON.stringify(res.data));

        if (!res.data?.is_verified)
          dispatch(setModal({ key: MODAL_KEYS.USER_INFO, value: true }));
      }
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.SUCCESS,
      });
    } else
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.ERROR,
      });

    dispatch(setLoading({ key: LOADING_KEYS.LOGIN_LOADER, value: false }));
  };
};

export const userSendOtpAction = (data, cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: LOADING_KEYS.SEND_OTP, value: true }));
    const res = await userSendOtpHttp(data);
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

    dispatch(setLoading({ key: LOADING_KEYS.SEND_OTP, value: false }));
  };
};

export const userLogoutAction = (cb) => {
  return async (dispatch) => {
    dispatch(setLoading({ key: LOADING_KEYS.LOGIN_LOADER, value: true }));

    const res = await userLogoutHttp();
    disconnectSocket();
    dispatch(setIsSocketConnected(false));
    cb(res);
    if (res?.success) {
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.SUCCESS,
      });
      dispatch(setUserInfo(null));
      dispatch(setWalletBalance(0));
      storage.clear();
      Cookies.remove(COOKIE_STORAGE.USER);
    } else
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.ERROR,
      });
    dispatch(setLoading({ key: LOADING_KEYS.LOGIN_LOADER, value: false }));
  };
};

export const getAvatarListAction = () => {
  return async (dispatch) => {
    dispatch(setLoading({ key: LOADING_KEYS.FORM_LOADER, value: true }));
    const res = await getAvatarListHttp();
    if (res?.success) dispatch(setAvatarList(res?.data));
    else
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.ERROR,
      });
    dispatch(setLoading({ key: LOADING_KEYS.FORM_LOADER, value: false }));
  };
};

export const updateUserInfoAction = (data, cb) => {
  return async (dispatch, getState) => {
    dispatch(setLoading({ key: LOADING_KEYS.FORM_LOADER, value: true }));
    const { userInfo } = getState().user;
    const res = await updateUserInfoHttp(userInfo?.id, data);
    cb?.(res);
    if (res.success) {
      dispatch(setUserInfo({ ...userInfo, ...data, is_verified: true }));
      Cookies.set(
        COOKIE_STORAGE.USER,
        JSON.stringify({ ...userInfo, ...data, is_verified: true }),
      );
    } else
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.ERROR,
      });
    dispatch(setLoading({ key: LOADING_KEYS.FORM_LOADER, value: false }));
  };
};

export const getWalletBalanceAction = (id) => {
  return async (dispatch) => {
    const res = await getWalletBallanceHttp(id);
    if (res.success) {
      dispatch(setWalletBalance(res?.data?.play_balance));
      dispatch(
        setModal({
          key: OVERLAY_KEYS.LOW_BALANCE,
          value: res?.data?.play_balance <= LOW_WALLET_BALANCE.RED.threshold,
        }),
      );
    } else
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.ERROR,
      });
  };
};
