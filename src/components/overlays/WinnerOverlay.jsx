import { auctionState } from '@/redux/auctions/reducer.auctions';
import { userState } from '@/redux/user/reducer.user';
import {
  AUCTION_STATUS,
  PLAYER_STATUS,
} from '@/utils/constant/constant.helper';
import React from 'react';
import { useSelector } from 'react-redux';

const WinnerOverlay = ({ className }) => {
  const { currentAuction, getAuctionResultLoading } = useSelector(auctionState);
  const { userInfo } = useSelector(userState);

  if (getAuctionResultLoading) {
    return;
  }
  if (currentAuction?.state === AUCTION_STATUS.COMPLETED)
    return (
      <div className={`absolute bg-[rgba(0,0,0,0.7)] ${className}`}>
        <div className="w-full h-full flex justify-center items-center pb-10 flex-col gap-2">
          <h4 className="text-lg max-small-mobile:text-sm font-bold mb-4">
            AUCTION ENDED
          </h4>

          {currentAuction?.status === PLAYER_STATUS.WON ? (
            <>
              <h5 className="text-2xl max-small-mobile:text-lg font-bold">
                CONGRATULATIONS 🎉
              </h5>
              <h5 className="text-xl max-small-mobile:text-base font-bold">
                YOU’VE WON!
              </h5>
            </>
          ) : (
            userInfo?.id && (
              <h5 className="text-xl max-small-mobile:text-base font-bold">
                Winner:{' '}
                {[
                  currentAuction?.winnerInfo?.User?.first_name,
                  currentAuction?.winnerInfo?.User?.last_name,
                ]
                  ?.filter(Boolean)
                  ?.join(' ') || 'Anonymous'}
              </h5>
            )
          )}

          {userInfo?.id && (
            <p className="text-base max-small-mobile:text-xs font-bold mt-4">
              Winning Price: {currentAuction?.winnerInfo?.buy_now_price}
            </p>
          )}
        </div>
      </div>
    );
  return null;
};

export default WinnerOverlay;
