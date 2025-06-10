'use client';
import LoadingModal from '@/components/modal/LoadingModal';
import useQueryParam from '@/hooks/useQueryParam';
import {
  clearAllCallBackToEvent,
  emitEvent,
  initiateSocketConnection,
  isConnected,
  subscribeToEvent,
} from '@/lib/socket';
import {
  checkPlayerIsWinner,
  getAuctionListByHouseAction,
  setAuction,
  setBidLog,
} from '@/redux/auctions/action.auctions';
import { auctionState } from '@/redux/auctions/reducer.auctions';
import { MODAL_KEYS, OVERLAY_KEYS, setModal } from '@/redux/modal/action.modal';
import {
  setIsSocketConnected,
  setSocketData,
  SOCKET_DATA_KEYS,
} from '@/redux/socket/action.socket';
import { socketState } from '@/redux/socket/reducer.socket';
import {
  setAuctionHouseInfo,
  setWalletBalance,
} from '@/redux/user/action.user';
import { userState } from '@/redux/user/reducer.user';
import {
  AUCTION_STATUS,
  AUX_STATUS,
  LOW_WALLET_BALANCE,
  ROUTES,
  SOCKET_EVENTS,
  TOAST_TYPE,
} from '@/utils/constant/constant.helper';
import { toastMessage } from '@/utils/helpers/toastMessage';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import bidError from '../assets/sound/error.mp3';
import bidSuccess from '../assets/sound/newbid.mp3';
import { log } from '@/utils/helpers/logger.helper';

const SocketProvider = ({ children }) => {
  const [showWinnerModal, setShowWinnerModal] = useState({
    loading: false,
    error: false,
  });
  const dispatch = useDispatch();

  const { currentAuction, auctionMetadata, isWinning } =
    useSelector(auctionState);
  const { auctionHouseInfo, userInfo } = useSelector(userState);
  const router = useQueryParam();
  const { isSocketConnected } = useSelector(socketState);

  // TODO: IN FUTURE WE CREATE COMMON HOOK FOR THIS FUNCTION
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
            } else router.push(ROUTES.COMING_SOON);
          },
        ),
      );
    } catch (error) {
      console.error(error, 'fetchAuctionGridData');
    }
  };

  useEffect(() => {
    let isPLayerWon = false;
    if (isSocketConnected) {
      if (currentAuction?.id && currentAuction?.state === AUCTION_STATUS.LIVE) {
        emitEvent(SOCKET_EVENTS.EMIT.PERCENTAGE_MIN_MAX, {
          player_id: userInfo?.id,
          auction_id: currentAuction?.id,
        });
      }

      if (
        currentAuction?.id &&
        userInfo?.id &&
        currentAuction?.state === AUCTION_STATUS.LIVE
      ) {
        emitEvent(SOCKET_EVENTS.EMIT.MIN_MAX_PLAYER_LOG, {
          player_id: userInfo?.id,
          auction_id: currentAuction?.id,
        });
      }

      currentAuction?.id &&
        subscribeToEvent(SOCKET_EVENTS.ON.PLAYER_IN_WINNING, (res) => {
          if (res?.auction_id === currentAuction?.id) {
            toastMessage({
              message: res?.message,
              toastId: res?.message,
              type: TOAST_TYPE.SUCCESS,
            });
          }
        });

      subscribeToEvent(SOCKET_EVENTS.ON.AUCTION_ERROR, (res) => {
        log('warn', `${SOCKET_EVENTS.ON.AUCTION_ERROR} : ${res}`);
        if (res?.auction_id === currentAuction?.id) {
          // const bidErrorAudio = new Audio(bidError);
          // bidErrorAudio.volume = 1.0; // Maximum volume
          // bidErrorAudio.muted = false;
          // bidErrorAudio.play();
          navigator?.vibrate?.(200);
          // toastMessage({
          //   message: res?.message,
          //   toastId: res?.message,
          //   type: TOAST_TYPE.ERROR,
          //   position: TOAST_CONFIG.POSITION.BOTTOM_CENTER,
          // });

          toast.error(res?.message);
        }
      });

      subscribeToEvent(SOCKET_EVENTS.ON.AUCTION_RESULT_READY, (res) => {
        if (
          res?.data?.auction_id &&
          currentAuction?.id === res?.data?.auction_id
        ) {
          if (res.data?.status)
            setTimeout(() => {
              dispatch(
                setModal({ key: MODAL_KEYS.WINNER, value: isPLayerWon }),
              );
              setShowWinnerModal((prev) => ({ ...prev, loading: false }));
            }, 2000);
          else {
            setShowWinnerModal((prev) => ({
              ...prev,
              loading: false,
              error: true,
            }));
          }
        }
      });

      subscribeToEvent(SOCKET_EVENTS.ON.AUCTION_WINNER, (res) => {
        if (
          res?.winnerInfo?.auction_id &&
          res?.winnerInfo?.auction_id === currentAuction?.id
        ) {
          if (userInfo?.accessToken) {
            setShowWinnerModal((prev) => ({ ...prev, loading: true }));
            isPLayerWon = res?.winnerInfo?.player_id === userInfo?.id;
            router.push(ROUTES.BASE + currentAuction?.id, {
              query: { [AUX_STATUS]: AUCTION_STATUS.COMPLETED },
            });
            dispatch(
              setAuction({
                data: { ...currentAuction, state: AUCTION_STATUS.COMPLETED },
                metadata: auctionMetadata,
              }),
            );
          } else fetchAuctionGridData();
        }
      });
      subscribeToEvent(SOCKET_EVENTS.ON.AUCTION_CURRENT_PLAY, (res) => {
        dispatch(setWalletBalance(res?.play_balance));
        dispatch(
          setModal({
            key: OVERLAY_KEYS.LOW_BALANCE,
            value: res?.play_balance <= LOW_WALLET_BALANCE.RED.threshold,
          }),
        );
      });

      subscribeToEvent(SOCKET_EVENTS.ON.PLAYER_PLAY_CREDIT, (res) => {
        if (res?.data?.player_id && res?.data?.player_id === userInfo?.id) {
          dispatch(setWalletBalance(res?.data?.play_balance));
          dispatch(
            setModal({
              key: OVERLAY_KEYS.LOW_BALANCE,
              value:
                res?.data?.play_balance <= LOW_WALLET_BALANCE.RED.threshold,
            }),
          );
        }
      });

      subscribeToEvent(SOCKET_EVENTS.ON.AUCTION_MIN_MAX_PERCENTAGE, (res) => {
        if (
          res?.data?.auction_id &&
          res?.data?.auction_id === currentAuction?.id
        ) {
          dispatch(
            setSocketData({
              key: SOCKET_DATA_KEYS.BID_PERCENTAGE,
              value: res?.data,
            }),
          );
          // TODO: Removed emit events to resolve Auction not live error
          // res?.data?.bid_percentage < 100 &&
          //   userInfo?.id &&
          //   emitEvent(SOCKET_EVENTS.EMIT.MIN_MAX_PLAYER_LOG, {
          //     player_id: userInfo?.id,
          //     auction_id: res?.data?.auction_id,
          //   });
        }
      });
      subscribeToEvent(SOCKET_EVENTS.ON.PLAYER_INFO_MIN_MAX, (res) => {
        if (res?.auction_id && res?.auction_id === currentAuction?.id) {
          dispatch(setBidLog({ data: res?.data, metaData: null }));
          dispatch(checkPlayerIsWinner(res?.data));
        }
      });
      subscribeToEvent(SOCKET_EVENTS.ON.AUCTION_AVATARS, (res) => {
        if (res?.auction_id && res?.auction_id === currentAuction?.id) {
          dispatch(
            setSocketData({
              key: SOCKET_DATA_KEYS.AVATARS,
              value: res?.data,
            }),
          );
        }
      });
    }
    subscribeToEvent(SOCKET_EVENTS.ON.MIN_MAX_BID_PERCENTAGE, (res) => {
      if (
        res?.data?.auction_id &&
        res?.data?.auction_id === currentAuction?.id
      ) {
        dispatch(
          setSocketData({
            key: SOCKET_DATA_KEYS.BID_PERCENTAGE,
            value: res?.data,
          }),
        );
        // TODO: Removed emit events to resolve Auction not live error
        // res.data.bid_percentage < 100 &&
        //   userInfo?.id &&
        //   emitEvent(SOCKET_EVENTS.EMIT.MIN_MAX_PLAYER_LOG, {
        //     player_id: userInfo?.id,
        //     auction_id: res?.data?.auction_id,
        //   });
      }
    });
    subscribeToEvent(SOCKET_EVENTS.ON.AUCTION_HOUSE_LOGO_UPDATE, (res) => {
      if (
        res?.data?.id &&
        res?.data?.id === auctionHouseInfo?.currentAuctionHouse?.id
      ) {
        const updatedAuctionHouse = {
          ...auctionHouseInfo,
          currentAuctionHouse: {
            ...auctionHouseInfo.currentAuctionHouse,
            medias: res?.data?.medias,
          },
        };
        dispatch(setAuctionHouseInfo(updatedAuctionHouse));
      }
    });
    subscribeToEvent(SOCKET_EVENTS.ON.PRODUCT_MEDIA_UPDATE, (res) => {
      if (res?.data?.auctionIds?.includes?.(currentAuction?.id)) {
        const updatedAuction = {
          ...currentAuction,
          products: res?.data?.product,
        };
        dispatch(
          setAuction({ data: updatedAuction, metadata: auctionMetadata }),
        );
      }
    });
    return () => {
      clearAllCallBackToEvent(SOCKET_EVENTS.ON.PLAYER_INFO_MIN_MAX);
      clearAllCallBackToEvent(SOCKET_EVENTS.ON.AUCTION_MIN_MAX_PERCENTAGE);
      clearAllCallBackToEvent(SOCKET_EVENTS.ON.PLAYER_IN_WINNING);
      clearAllCallBackToEvent(SOCKET_EVENTS.ON.AUCTION_ERROR);
      clearAllCallBackToEvent(SOCKET_EVENTS.ON.AUCTION_RESULT_READY);
      clearAllCallBackToEvent(SOCKET_EVENTS.ON.AUCTION_CURRENT_PLAY);
      clearAllCallBackToEvent(SOCKET_EVENTS.ON.AUCTION_WINNER);
      clearAllCallBackToEvent(SOCKET_EVENTS.ON.PLAYER_PLAY_CREDIT);
      clearAllCallBackToEvent(SOCKET_EVENTS.ON.AUCTION_AVATARS);
      clearAllCallBackToEvent(SOCKET_EVENTS.ON.MIN_MAX_BID_PERCENTAGE);
      clearAllCallBackToEvent(SOCKET_EVENTS.ON.AUCTION_HOUSE_LOGO_UPDATE);
      clearAllCallBackToEvent(SOCKET_EVENTS.ON.PRODUCT_MEDIA_UPDATE);
    };
  }, [currentAuction?.id, userInfo?.id, isSocketConnected]);

  useEffect(() => {
    const bidSuccessAudio = new Audio(bidSuccess);
    bidSuccessAudio.volume = 1.0; // Maximum volume
    bidSuccessAudio.muted = false;
    if (isWinning) {
      bidSuccessAudio.play();
      // TODO:remove if not worked i phone or not needed
      // Vibrate for 200 milliseconds
      navigator?.vibrate?.(200);
    }
  }, [isWinning]);

  const socketEmit = useCallback((res) => {
    if (res?.success) {
      dispatch(setIsSocketConnected(true));
    }
  }, []);

  useEffect(() => {
    const connected = isConnected() || false;

    dispatch(setIsSocketConnected(connected));

    const timeout = setTimeout(() => {
      initiateSocketConnection(userInfo?.accessToken, socketEmit);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [userInfo?.accessToken]);

  return (
    <>
      {children}
      <LoadingModal
        show={showWinnerModal}
        setShowWinnerModal={setShowWinnerModal}
      />
    </>
  );
};

export default SocketProvider;
