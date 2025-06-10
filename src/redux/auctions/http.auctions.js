import axiosInstance from '@/config/axiosInstance';
import { API_ENDPOINT } from '@/utils/constant/api-endpoint.constant';

/**
 params={limit,player_id,page,auction_id,state,auction_house_id} 
 * */

export const getAuctionListByHouseHttp = async (params) => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINT.AUCTION_HOUSE.GET_AUCTION_LIST,
      {
        params,
      },
    );
    return response;
  } catch (error) {
    return error;
  }
};

// params limit,page

export const getMyAuctionListHttp = async (playerId, params) => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINT.AUCTION.GET_MY_AUCTION_LIST}/${playerId}`,
      {
        params,
      },
    );
    return response;
  } catch (error) {
    return error;
  }
};

// params player_id,auction_id
export const getMyAuctionHttp = async (params) => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINT.AUCTION.GET_MY_AUCTION,
      {
        params,
      },
    );
    return response;
  } catch (error) {
    return error;
  }
};

let recentBidAbortController = null;
// params page,limit
export const getBidLogsHttp = async (auctionId, params) => {
  try {
    if (recentBidAbortController) {
      recentBidAbortController.abort();
    }
    recentBidAbortController = new AbortController();
    const { signal } = recentBidAbortController;

    const response = await axiosInstance.get(
      `${API_ENDPOINT.AUCTION.GET_BID_LOG}/${auctionId}`,
      {
        params,
        signal,
      },
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const auctionGridHttp = async (
  page,
  limit,
  search,
  auction_house_id,
) => {
  try {
    const response = await axiosInstance.get(
      `/auction-house/auction/grid/list/?${
        auction_house_id ? `auction_house_id=${auction_house_id}&` : ''
      }limit=${limit}&page=${page}${search ? `&search=${search}` : ''}`,
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const upcomingAuctionByIdHttp = async (
  auction_id,
  player_id,
  auctionStatus,
  auction_house_id,
) => {
  try {
    const response = await axiosInstance.get(
      `auction-house/auction/list?${
        player_id ? `&player_id=${player_id}` : ''
      }&${
        auction_house_id ? `auction_house_id=${auction_house_id}&` : ''
      }&auction_id=${auction_id}&state=${auctionStatus}`,
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const bidLogsHttp = async (auctionId, page, limit) => {
  try {
    const response = await axiosInstance.get(
      `auction/logs/${auctionId}?page=${page}&limit=${limit}`,
    );
    return response;
  } catch (error) {
    return error;
  }
};
