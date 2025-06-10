'use client';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AUCTION_CATEGORY_KEYS,
  AUCTION_STATUS,
  AUCTION_TYPES,
  AUX_STATUS,
  CURRENCY_SYMBOLS,
  DYNAMIC_IMAGE_UNOPTIMISED,
  NOT_APPLICABLE,
  ROUTES,
} from '@/utils/constant/constant.helper';
import BidBarSection from '@/components/BidBarSection';
import PlayerIconSection from '@/components/PlayerIconSection';
import CustomCard from '@/components/cards/CustomCard';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa6';
import { auctionState } from '@/redux/auctions/reducer.auctions';
import CustomImage from '@/components/CustomImage';
import {
  clearAuction,
  getAuctionListByHouseAction,
  getAuctionResultAction,
} from '@/redux/auctions/action.auctions';
import { userState } from '@/redux/user/reducer.user';
import useQueryParam from '@/hooks/useQueryParam';
import BIdForm from '@/components/BIdForm';
import dynamic from 'next/dynamic';

import { socketState } from '@/redux/socket/reducer.socket';
import { SOCKET_DATA_KEYS } from '@/redux/socket/action.socket';
import WinnerOverlay from '@/components/overlays/WinnerOverlay';
import LowBallanceOverlay from '@/components/overlays/LowBallanceOverlay';
// we import dynamic here to avoid hydration error
const PageSuspense = dynamic(() => import('@/components/PageSuspense'));

const AuctionPage = () => {
  const params = useParams();
  const router = useQueryParam();
  const dispatch = useDispatch();
  const { currentAuction, recentBidData, isWinning } =
    useSelector(auctionState);
  const { auctionHouseInfo, userInfo } = useSelector(userState);
  const [selectedTab, setSelectedTab] = useState('myBids');
  const searchParam = useSearchParams();
  const socketData = useSelector(socketState);
  const [inputValue, setInputValue] = useState('');
  const bidFormRef = useRef();

  const decryptData = (encryptedData, key = 'bidSecretKey2024') => {
    try {
      const decrypted = decodeURIComponent(escape(atob(encryptedData)));
      const jsonString = decrypted.replace(key, '');
      return JSON.parse(jsonString);
    } catch (error) {
      return null;
    }
  };

  const getBidsFromStorage = (userId) => {
    try {
      const encryptedBids = localStorage.getItem('bids');
      if (!encryptedBids) return {};
      const allUserBids = decryptData(encryptedBids);
      return allUserBids || {};
    } catch (error) {
      return {};
    }
  };

  const getAllRecentBids = (
    userId = userInfo?.id,
    auctionId = currentAuction?.id,
  ) => {
    try {
      if (!userId || !auctionId) {
        return [];
      }

      const allBidsData = getBidsFromStorage();

      // Check if auction exists in storage
      if (!allBidsData[auctionId]) {
        return [];
      }

      // Check if user has bids for this auction
      const userBidsForAuction = allBidsData[auctionId][userId];
      if (!userBidsForAuction || !Array.isArray(userBidsForAuction)) {
        return [];
      }

      return userBidsForAuction
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10)
        .map((bid) => bid.bid_price);
    } catch (error) {
      console.error('Error in getAllRecentBids:', error);
      return [];
    }
  };

  const handleInputChange = (value) => {
    let processedValue = value;

    if (value.startsWith('0.')) {
      processedValue = value;
    } else if (value === '0.') {
      processedValue = '0.';
    }
    setInputValue(processedValue);
  };

  const handleNumpadClick = (value) => {
    let newValue;

    if (value === '.') {
      if (!inputValue || inputValue === '0') {
        newValue = '0.';
      } else if (inputValue.includes('.')) {
        return;
      } else {
        newValue = inputValue + value;
      }
    } else if (inputValue === '0') {
      newValue = value;
    } else {
      newValue = inputValue + value;
    }

    setInputValue(newValue);
  };

  const handleSubmitFromNumpad = () => {
    if (bidFormRef.current && bidFormRef.current.submitForm) {
      bidFormRef.current.submitForm();
    }
  };

  const handleClearInput = () => {
    setInputValue('');
  };

  useEffect(() => {
    return () => dispatch(clearAuction());
  }, []);

  useEffect(() => {
    if (auctionHouseInfo?.currentAuctionHouse?.id) {
      if (
        searchParam.get(AUX_STATUS) === AUCTION_STATUS.COMPLETED &&
        userInfo?.accessToken
      )
        dispatch(
          getAuctionResultAction(
            { player_id: userInfo?.id, auction_id: params.auctionId },
            (res) => {
              if (!res.success) router.push(ROUTES.COMING_SOON);
            },
          ),
        );
      else if (params.auctionId !== currentAuction?.id)
        dispatch(
          getAuctionListByHouseAction(
            {
              auction_house_id: auctionHouseInfo?.currentAuctionHouse?.id,
              auction_id: params.auctionId,
              // if user is not authenticated then playerId will not pass
              player_id: userInfo?.id || null,
            },
            (res) => {
              if (res?.success && res?.data?.[0]?.id) {
                router.push(ROUTES.BASE + res?.data?.[0]?.id, {
                  query: {
                    [AUX_STATUS]:
                      res?.data?.[0]?.state === AUCTION_STATUS.COMPLETED
                        ? AUCTION_STATUS.COMPLETED
                        : '',
                  },
                });
              } else router.push(ROUTES.COMING_SOON);
            },
          ),
        );
    }
  }, [
    params.auctionId,
    currentAuction?.id,
    auctionHouseInfo?.currentAuctionHouse?.id,
    searchParam.get(AUX_STATUS),
  ]);

  return (
    <PageSuspense>
      <div className="text-base flex w-full">
        <div className="w-1/2 text-sm">
          {currentAuction?.title || NOT_APPLICABLE}
        </div>
        |
        <div className="w-1/2 text-sm text-end">
          {CURRENCY_SYMBOLS.DEFAULT}
          {currentAuction?.products?.price || NOT_APPLICABLE}
        </div>
      </div>
      <div className="remove-card-padding">
        <div className="w-full flex flex-row items-start justify-center max-w-6xl mx-auto shadow-lg">
          {/* LEFT SIDE: Product Card */}
          <div className="relative mt-[12px] aspect-square flex items-center justify-center">
            <CustomCard className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
              {currentAuction?.auctionCategory?.title || ''} |{' '}
              {currentAuction?.plays_consumed_on_bid} X
            </CustomCard>

            {/* Arrows */}
            <button
              className="absolute -right-5 flex items-center h-full justify-center cursor-pointer disabled:hidden"
              disabled
            >
              <div className="bg-[#B57FEC80] rounded-md aspect-square h-10 flex items-center hover:bg-white hover:text-[#9E63FF] text justify-center gap-1 active:opacity-90 outline-none">
                <div className="font-bold text-2xl">
                  <FaArrowRight />
                </div>
              </div>
            </button>
            <button
              className="absolute -left-5 flex items-center h-full justify-center disabled:hidden"
              disabled
            >
              <div className="bg-[#B57FEC80] rounded-md aspect-square h-10 flex items-center hover:bg-white hover:text-[#9E63FF] text justify-center gap-1 active:opacity-90 outline-none">
                <div className="font-bold text-2xl">
                  <FaArrowLeft />
                </div>
              </div>
            </button>

            {/* Product Image */}
            <CustomImage
              path={
                currentAuction?.products?.productMedias?.[0]?.medias?.local_path
              }
              width={200}
              height={200}
              className="my-element !bg-[#190C3D]"
              alt="product image"
              unoptimized={DYNAMIC_IMAGE_UNOPTIMISED}
            />

            {/* Overlays */}
            <WinnerOverlay className="w-[calc(100%-4px)] h-[calc(100%-4px)] my-element top-[2px] left-[2px]" />
            {userInfo?.accessToken && (
              <LowBallanceOverlay className="w-[calc(100%-4px)] h-2/5 max-small-mobile:h-[55%] my-element bottom-[0px] left-[2px]" />
            )}
          </div>

          {/* RIGHT SIDE: My Bids Panel */}
          <div className="p-1 sm:p-6 flex flex-col text-white h-full ml-[57px]">
            {/* Header aligned with top of image */}
            <div className="flex justify-between items-center max-sm:gap-2">
              <h2
                className={`text-xs p-[2px] rounded-md cursor-pointer ${
                  selectedTab === 'myBids' ? 'bg-purple-overlay shadow-md' : ''
                }`}
                onClick={() => setSelectedTab('myBids')}
              >
                My Bids
              </h2>
              <div
                className={`w-8 h-8 rounded-md text-xs flex items-center justify-center ml-[25px] text-white cursor-pointer mr-3 ${
                  selectedTab === 'U' ? 'bg-purple-overlay shadow-md' : ''
                }`}
                onClick={() => setSelectedTab('U')}
              >
                U
              </div>
            </div>

            {/* Bids list */}
            <div className="flex gap-4 text-xs text-center">
              {(() => {
                const staticUBids = [
                  4.0, 1.0, 2.0, 1.1, 3.5, 2.8, 1.9, 4.2, 3.1, 2.6,
                ]; // Extended to 10 items
                const bids =
                  selectedTab === 'myBids' ? getAllRecentBids() : staticUBids;

                if (bids.length === 0) {
                  return (
                    <div className="text-gray-400 w-full">No bids yet</div>
                  );
                }

                // Split bids into two groups of 5
                const firstFive = bids.slice(0, 5);
                const secondFive = bids.slice(5, 10);

                return (
                  <>
                    {/* First 5 bids */}
                    <div className="flex-1 space-y-1">
                      {firstFive.map((bid, i) => (
                        <div
                          key={i}
                          className={i === 0 ? 'text-[#52FF00]' : 'text-white'}
                        >
                          {typeof bid === 'number'
                            ? bid.toFixed(2)
                            : parseFloat(bid).toFixed(2)}
                        </div>
                      ))}
                      {/* Fill empty slots if less than 5 bids */}
                      {Array.from({ length: 5 - firstFive.length }).map(
                        (_, i) => (
                          <div
                            key={`empty-first-${i}`}
                            className="text-transparent"
                          >
                            0.00
                          </div>
                        ),
                      )}
                    </div>

                    {/* Separator */}
                    <div className="text-white font-bold">|</div>

                    {/* Second 5 bids */}
                    <div className="flex-1 space-y-1">
                      {secondFive.map((bid, i) => (
                        <div key={i + 5} className="text-white">
                          {typeof bid === 'number'
                            ? bid.toFixed(2)
                            : parseFloat(bid).toFixed(2)}
                        </div>
                      ))}
                      {/* Fill empty slots if less than 5 bids in second group */}
                      {Array.from({ length: 5 - secondFive.length }).map(
                        (_, i) => (
                          <div
                            key={`empty-second-${i}`}
                            className="text-transparent"
                          >
                            0.00
                          </div>
                        ),
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        <div className="add-card-padding">
          <BIdForm
            onInputChange={handleInputChange}
            inputValue={inputValue}
            onSubmitFromNumpad={bidFormRef}
            onClearInput={handleClearInput}
          />
          {/* This section contains circular progress bar and thumb images */}
          <BidBarSection
            productPrice={recentBidData?.[0]?.bid_price}
            percentage={
              socketData?.[SOCKET_DATA_KEYS.BID_PERCENTAGE]?.bid_percentage
            }
            isUnique={recentBidData?.[0]?.is_unique}
            isHighest={
              recentBidData?.[0]?.[
                currentAuction?.auctionCategory?.code === AUCTION_TYPES.MIN
                  ? AUCTION_CATEGORY_KEYS.IS_LOWEST
                  : AUCTION_CATEGORY_KEYS.IS_HIGHEST
              ] && recentBidData?.[0]?.is_unique
            }
            isStatus={currentAuction?.status || ''}
            state={currentAuction?.state}
            isHighestAndUniqueShow={recentBidData.length > 0}
            onNumpadClick={handleNumpadClick}
            inputValue={inputValue}
            onSubmitBid={handleSubmitFromNumpad}
            onClearInput={handleClearInput}
          />
        </div>

        {currentAuction?.state === AUCTION_STATUS.LIVE ? (
          <PlayerIconSection
            profiles={socketData?.[SOCKET_DATA_KEYS.AVATARS] || []}
          />
        ) : null}
      </div>
    </PageSuspense>
  );
};

export default AuctionPage;
