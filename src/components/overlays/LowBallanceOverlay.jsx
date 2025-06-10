import { auctionState } from '@/redux/auctions/reducer.auctions';
import { MODAL_KEYS, OVERLAY_KEYS, setModal } from '@/redux/modal/action.modal';
import { modalState } from '@/redux/modal/reducer.modal';
import { AUCTION_STATUS } from '@/utils/constant/constant.helper';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const LowBallanceOverlay = ({ className }) => {
  const { currentAuction } = useSelector(auctionState);
  const modal = useSelector(modalState);
  const dispatch = useDispatch();

  if (
    currentAuction?.state === AUCTION_STATUS.LIVE &&
    modal[OVERLAY_KEYS.LOW_BALANCE]
  )
    return (
      <div className={`absolute bg-[rgba(0,0,0,0.56)] ${className}`}>
        <div className="w-full h-full flex justify-start    items-center flex-col gap-2 pt-3 pb-10">
          <h3 className="text-sm font-bold">Low Wallet Ballance</h3>

          <div className="mt-2">
            <button
              className="bg-white  rounded-md text-xs w-20 transition-all hover:opacity-90 text-[#9E63FF] cursor-pointer active:opacity-50 outline-none py-2 font-bold mx-4"
              onClick={() => {
                dispatch(setModal({ key: MODAL_KEYS.BUY_PLAYS, value: true }));
              }}
            >
              Buy PLAYs
            </button>
            <button
              className="bg-[#9E63FF]  rounded-md text-xs w-20 transition-all hover:opacity-90 text-white cursor-pointer active:opacity-50 outline-none py-2 font-bold mx-4"
              onClick={() =>
                dispatch(
                  setModal({ value: false, key: OVERLAY_KEYS.LOW_BALANCE }),
                )
              }
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  return null;
};

export default LowBallanceOverlay;
