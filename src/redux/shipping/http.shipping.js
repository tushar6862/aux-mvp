import axiosInstance from '@/config/axiosInstance';
import { API_ENDPOINT } from '@/utils/constant/api-endpoint.constant';

export const addShippingInfoHttp = async (data) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINT.USERS.SHIPPING_INFO,
      data,
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getShippingInfoHttp = async (params) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINT.USERS.SHIPPING_INFO, {
      params,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteShippingInfoHttp = async (params) => {
  try {
    const response = await axiosInstance.delete(
      API_ENDPOINT.USERS.SHIPPING_INFO,
      {
        params,
      },
    );
    return response;
  } catch (error) {
    return error;
  }
};
