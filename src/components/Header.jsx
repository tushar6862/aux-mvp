import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AnimatedFlipCard from './cards/AnimatedFlipCard';
import {
  getPlayerName,
  getWalletBalanceColor,
} from '@/utils/helpers/utils.helper';
import { MODAL_KEYS, setModal } from '@/redux/modal/action.modal';
import HouseLogo from './HouseLogo';
import { userState } from '@/redux/user/reducer.user';

const Header = () => {
  const dispatch = useDispatch();
  const { userInfo, walletBalance } = useSelector(userState);
  return (
    <div className="container-fluid pt-[20px] pb-[10px]">
      <div className="flex justify-between">
        {userInfo?.accessToken ? (
          <AnimatedFlipCard
            playerName={getPlayerName(
              userInfo?.first_name,
              userInfo?.last_name,
            )}
            walletBalance={walletBalance}
            firstCardClassName={getWalletBalanceColor(walletBalance)}
          />
        ) : (
          <button
            className="bg-[#B57FEC80]  rounded-md w-[120px] h-[45px] transition-all hover:bg-white hover:text-[#9E63FF] cursor-pointer active:opacity-90 outline-none"
            onClick={() =>
              dispatch(setModal({ key: MODAL_KEYS.LOGIN, value: true }))
            }
          >
            <div className="text-sm font-bold">Login</div>
          </button>
        )}
        <HouseLogo className="w-40 font-bold" />

        <button
          className="group bg-[#B57FEC80] disabled:hidden  rounded-md w-auto aspect-square h-[45px] transition-all hover:bg-white cursor-pointer active:opacity-90 outline-none"
          onClick={() => {
            dispatch(setModal({ key: MODAL_KEYS.HAMBURGER_MENU, value: true }));
          }}
          disabled={!userInfo?.accessToken}
        >
          <span className="w-[22px] h-[2px] bg-white block mx-auto my-[5px] group-hover:bg-[#9E63FF]" />
          <span className="w-[20px] h-[2px] bg-white block mx-auto my-[5px] group-hover:bg-[#9E63FF]" />
          <span className="w-[22px] h-[2px] bg-white block mx-auto my-[5px] group-hover:bg-[#9E63FF]" />
        </button>
      </div>
    </div>
  );
};

export default Header;
