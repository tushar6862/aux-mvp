import { createAction } from '@reduxjs/toolkit';
import {
  getAuctionListByHouseHttp,
  getBidLogsHttp,
  getMyAuctionHttp,
  getMyAuctionListHttp,
} from './http.auctions';
import { toastMessage } from '@/utils/helpers/toastMessage';
import {
  AUCTION_CATEGORY_KEYS,
  AUCTION_TYPES,
  TOAST_TYPE,
} from '@/utils/constant/constant.helper';

export const LOADING_KEYS = {
  GET_AUCTION_RESULT: 'getAuctionResultLoading',
  GET_AUCTION: 'getAuctionLoading',
  BID_LOGS: 'bidLogsLoading',
  MY_AUCTIONS: 'myAuctionsLoading',
};
export const setLoading = createAction('auction/setLoading');
export const setAuctionList = createAction('auction/setAuctionList');
export const setAuction = createAction('auction/setAuction');
export const clearAuction = createAction('auction/clearAuction');
export const setMyAuctionList = createAction('auction/setMyAuctionList');
export const setMyAuction = createAction('auction/setMyAuction');
export const setBidLog = createAction('auction/setBidLog');
export const setIsWinning = createAction('auction/setIsWinning');

export const getAuctionListByHouseAction = (params, cb) => {
  return async (dispatch) => {
    dispatch(setBidLog({ data: [], metadata: null }));
    dispatch(setIsWinning(false));
    dispatch(setLoading({ key: LOADING_KEYS.GET_AUCTION, value: true }));
    const res = await getAuctionListByHouseHttp(params);
    cb?.(res);
    if (res?.success)
      dispatch(setAuction({ data: res.data?.[0], metadata: res?.metadata }));
    else
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.ERROR,
      });

    dispatch(setLoading({ key: LOADING_KEYS.GET_AUCTION, value: false }));
  };
};

export const getMyAuctionListAction = (playerId, params, cb) => {
  return async (dispatch, getState) => {
    const { myAuctionList } = getState().auction;
    dispatch(setLoading({ key: LOADING_KEYS.MY_AUCTIONS, value: true }));
    const res = await getMyAuctionListHttp(playerId, params);
    cb?.(res);
    if (res?.success)
      dispatch(
        setMyAuctionList({
          data:
            res.metadata?.page === 0
              ? res?.data
              : myAuctionList.concat(res?.data),
          metadata: res?.metadata,
        }),
      );
    else
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.ERROR,
      });

    dispatch(setLoading({ key: LOADING_KEYS.MY_AUCTIONS, value: false }));
  };
};

export const getAuctionResultAction = (params, cb) => {
  return async (dispatch, getState) => {
    const { currentAuction } = getState().auction;
    dispatch(setIsWinning(false));
    dispatch(setLoading({ key: LOADING_KEYS.GET_AUCTION_RESULT, value: true }));
    const res = await getMyAuctionHttp(params);
    cb?.(res);
    if (res.success) {
      const data = {
        ...currentAuction,
        buy_now_expiration: res.data?.buy_now_expiration,
        buy_now_price: res.data?.buy_now_expiration,
        payment_status: res.data?.payment_status,
        status: res.data?.status,
        totalBid: res.data?.totalBid,
        winnerInfo: res.data?.winnerInfo,
        ...res.data?.Auctions,
      };
      dispatch(setAuction({ data, metadata: null }));
    } else
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.ERROR,
      });

    dispatch(
      setLoading({ key: LOADING_KEYS.GET_AUCTION_RESULT, value: false }),
    );
  };
};
export const getBidLogsAction = (auctionId, params, cb) => {
  return async (dispatch, getState) => {
    const { recentBidData } = getState().auction;

    dispatch(setLoading({ key: LOADING_KEYS.BID_LOGS, value: true }));
    const res = await getBidLogsHttp(auctionId, params);
    cb?.(res);
    if (res?.success)
      dispatch(
        setBidLog({
          data:
            res.metadata?.page === 0
              ? res?.data
              : recentBidData.concat(res?.data),
          metaData: res?.metadata,
        }),
      );
    else {
      dispatch(setBidLog({ data: [], metadata: null }));
      toastMessage({
        message: res?.message,
        toastId: res?.message,
        type: TOAST_TYPE.ERROR,
      });
    }
    dispatch(setLoading({ key: LOADING_KEYS.BID_LOGS, value: false }));
  };
};

export const checkPlayerIsWinner = (data) => {
  return (dispatch, getState) => {
    try {
      const { auction } = getState();
      const { currentAuction } = auction;

      if (!data?.length) {
        dispatch(setIsWinning(false));
        return;
      }
      if (
        [AUCTION_TYPES.MIN, AUCTION_TYPES.MAX]?.includes(
          currentAuction?.auctionCategory?.code,
        )
      ) {
        dispatch(
          // setIsWinning(
          //   !!data?.find((bid) => {
          //     if (bid?.[AUCTION_CATEGORY_KEYS?.IS_HIGHEST])
          //       return (
          //         bid?.is_unique && bid?.[AUCTION_CATEGORY_KEYS?.IS_HIGHEST]
          //       );
          //     if (bid?.[AUCTION_CATEGORY_KEYS?.IS_LOWEST])
          //       return (
          //         bid?.is_unique && bid?.[AUCTION_CATEGORY_KEYS?.IS_LOWEST]
          //       );
          //     return false;
          //   })?.player_id,
          // ),
          setIsWinning(false),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
};
