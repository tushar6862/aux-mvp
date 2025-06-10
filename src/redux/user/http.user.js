import axiosInstance from '@/config/axiosInstance';
import { API_ENDPOINT } from '@/utils/constant/api-endpoint.constant';

export const getAuctionHouseInfoHttp = async (params) => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINT.AUCTION_HOUSE.GET_INFO,
      {
        params,
      },
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const userLoginHttp = async (data) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT.USERS.LOGIN, data);
    return response;
  } catch (error) {
    return error;
  }
};

export const userSendOtpHttp = async (data) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINT.USERS.SEND_OTP,
      data,
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getAvatarListHttp = async () => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINT.USERS.GET_AVATAR_LIST,
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const userLogoutHttp = async () => {
  try {
    const response = await axiosInstance.put(API_ENDPOINT.USERS.LOGOUT);
    return response;
  } catch (error) {
    return error;
  }
};

export const updateUserInfoHttp = async (userId, data) => {
  try {
    const response = await axiosInstance.put(
      `${API_ENDPOINT.USERS.UPDATE_USER}/${userId}`,
      data,
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const uploadAvatarHttp = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append('media', file, 'file');

    const response = await axiosInstance.put(
      `${API_ENDPOINT.USERS.SAVE_CUSTOM_AVTAR}/${userId}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getWalletBallanceHttp = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINT.USERS.WALLET_BALLANCE}/${userId}`,
    );
    return response;
  } catch (error) {
    return error;
  }
};

// TODO: these endpoints are not using

export const userVerifyHttp = async (data) => {
  try {
    const response = await axiosInstance.patch('user/verify', data);
    return response;
  } catch (error) {
    return error;
  }
};

export const userRegisterHttp = async (data) => {
  try {
    const response = await axiosInstance.post('user/register/v2', data);
    return response;
  } catch (error) {
    return error;
  }
};

export const getCountryListHttp = async (queryName) => {
  try {
    const response = await axiosInstance.get(
      `location/countries/list${queryName ? '?name=' + queryName : ''}`,
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const getCountryListByCodeHttp = async (queryCode) => {
  const response = await axiosInstance.get(
    `location/countries/list?code=${queryCode} `,
  );
  return response;
};

export const getCurrentLocationHttp = async () => {
  try {
    const response = await axiosInstance.get('location/current/address');
    return response;
  } catch (error) {
    return error;
  }
};
