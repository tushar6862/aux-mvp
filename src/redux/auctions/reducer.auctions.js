import { createReducer } from '@reduxjs/toolkit';
import {
  clearAuction,
  LOADING_KEYS,
  setAuction,
  setAuctionList,
  setBidLog,
  setIsWinning,
  setLoading,
  setMyAuction,
  setMyAuctionList,
} from './action.auctions';

const initialState = {
  [LOADING_KEYS.GET_AUCTION]: false,
  [LOADING_KEYS.MY_AUCTIONS]: false,
  auctionList: [],
  currentAuction: {},
  auctionMetadata: {},
  myAuctionList: [],
  myAuction: {},
  recentBidData: [],
  recentBidMetaData: {},
  isWinning: false,
};

export const auctionReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setLoading, (state, { payload }) => {
      const { key, value } = payload;
      state[key] = value;
    })
    .addCase(setAuctionList, (state, { payload }) => {
      state.auctionList = payload;
    })
    .addCase(setMyAuctionList, (state, { payload }) => {
      const { data, metadata } = payload;
      state.myAuctionList = data || initialState.myAuctionList;
      state.auctionMetadata = metadata;
    })
    .addCase(setMyAuction, (state, { payload }) => {
      state.myAuction = payload;
    })
    .addCase(setBidLog, (state, { payload }) => {
      const { data, metaData } = payload;
      state.recentBidData = data;
      state.recentBidMetaData = metaData;
    })
    .addCase(setIsWinning, (state, { payload }) => {
      state.isWinning = payload;
    })
    .addCase(setAuction, (state, { payload }) => {
      const { data, metadata } = payload;
      state.currentAuction = data || initialState.currentAuction;
      state.auctionMetadata = metadata;
    })
    .addCase(clearAuction, (state) => {
      state.currentAuction = initialState.currentAuction;
      state.auctionMetadata = initialState.auctionMetadata;
    });
});

export const auctionState = (state) => state?.auction;
