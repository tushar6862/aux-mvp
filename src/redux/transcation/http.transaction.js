import axiosInstance from '@/config/axiosInstance';
import { API_ENDPOINT } from '@/utils/constant/api-endpoint.constant';

export const getCurrentPlaysValuesHttp = async () => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINT.TRANSACTION.GET_AMOUNT,
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const buyPlaysHttp = async (data) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINT.TRANSACTION.CREATE_TRANSACTION,
      data,
    );
    return response;
  } catch (error) {
    return error;
  }
};
