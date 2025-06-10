'use client';
import useQueryParam from '@/hooks/useQueryParam';
import { clearAllCallBackToEvent, subscribeToEvent } from '@/lib/socket';
import {
  getAuctionListByHouseAction,
  setBidLog,
  setIsWinning,
} from '@/redux/auctions/action.auctions';
import { auctionState } from '@/redux/auctions/reducer.auctions';
import { userState } from '@/redux/user/reducer.user';
import {
  AUCTION_STATUS,
  ROUTES,
  SOCKET_EVENTS,
} from '@/utils/constant/constant.helper';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ComingSoonPage = () => {
  const router = useQueryParam();
  const dispatch = useDispatch();
  const { auctionHouseInfo } = useSelector(userState);
  const { currentAuction } = useSelector(auctionState);
  const fetchAuctionGridData = () => {
    try {
      dispatch(
        getAuctionListByHouseAction(
          {
            limit: 1,
            page: 0,
            state: AUCTION_STATUS.LIVE,
            auction_house_id: auctionHouseInfo?.currentAuctionHouse?.id,
          },
          (res) => {
            if (res?.data?.[0]?.id) {
              router.push(ROUTES.BASE + res?.data?.[0].id);
            }
          },
        ),
      );
    } catch (error) {
      console.error(error, 'fetchAuctionGridData');
    }
  };

  useEffect(() => {
    subscribeToEvent(SOCKET_EVENTS.ON.AUCTION_STATE, (data) => {
      if (!currentAuction?.id) router.push(ROUTES.BASE + data.auctionId);
    });
    return () => {
      clearAllCallBackToEvent(SOCKET_EVENTS.ON.AUCTION_STATE);
    };
  }, [currentAuction?.id]);

  useEffect(() => {
    dispatch(setBidLog({ data: [], metadata: null }));
    dispatch(setIsWinning(false));
    if (auctionHouseInfo?.currentAuctionHouse?.id) {
      fetchAuctionGridData();
    }
  }, [auctionHouseInfo?.currentAuctionHouse?.id]);
  return (
    <div className="h-full min-h-[100vh]  text-white max-w-lg mx-auto relative font-inter">
      <div className="max-w-lg w-full mx-auto ">
        <div className="bg-[#B57FEC80] mx-auto w-56 mt-40 text-center rounded-md px-3 py-3">
          <h3 className="text-3xl font-extrabold">Coming Soon</h3>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
