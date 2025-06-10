import axiosInstance from '@/config/axiosInstance';
import { API_ENDPOINT } from '@/utils/constant/api-endpoint.constant';

// Params ->  limit page
export const getTransactionHistoryHttp = async (playerId, params) => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINT.USERS.TRANSACTION_HISTORY}/${playerId}`,
      { params },
    );
    return response;
  } catch (error) {
    return error;
  }
};

//Transfer Plays HTTP Request
export const getTransferPlaysHttp = async (data) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINT.USERS.TRANSFER_PLAYS,
      data,
    );
    return response;
  } catch (error) {
    return error;
  }
};
