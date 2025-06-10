'use client';
import Button from '@/components/form-component/Button';
import HouseLogo from '@/components/HouseLogo';
import { MODAL_KEYS, setModal } from '@/redux/modal/action.modal';
import { modalState } from '@/redux/modal/reducer.modal';
import { userLogoutAction } from '@/redux/user/action.user';
import { ROUTES } from '@/utils/constant/constant.helper';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import { FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { useDisconnect } from 'wagmi';

const HamburgerSideMenu = () => {
  const { hamburgerMenuModal } = useSelector(modalState);
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(setModal({ key: MODAL_KEYS.HAMBURGER_MENU, value: false }));
  };

  const { disconnect } = useDisconnect();
  const router = useRouter();

  const LogoutHandler = () => {
    dispatch(
      userLogoutAction((res) => {
        if (res?.success) {
          localStorage.removeItem('bids');
          router.replace('/');
          disconnect?.();
          closeModal?.();
        }
      }),
    );
  };

  return (
    <section>
      {hamburgerMenuModal ? (
        <div
          className=" fixed w-full h-[100vh] bg-dim backdrop-blur-[2px] top-0 left-0 cursor-pointer z-30  group"
          onClick={closeModal}
        />
      ) : null}
      <aside
        className={`fixed z-50 transition-all duration-500 ease-in-out max-w-lg  top-0 p-4 h-full bg-[#190C3D] w-full  ${hamburgerMenuModal ? 'translate-x-0' : 'translate-x-[200vw]'}  `}
      >
        <div className="relative h-[calc(100%-72px)] w-full">
          <div className="flex justify-between">
            <Link href={ROUTES.BASE} onClick={closeModal}>
              <HouseLogo className="w-48" />
            </Link>

            <button
              className="font-bold group bg-[#B57FEC80] text-white hover:text-[#190C3D] rounded-md w-auto  aspect-square h-8 transition-all hover:bg-white cursor-pointer active:opacity-90 outline-none flex items-center justify-center"
              onClick={closeModal}
            >
              <FaXmark />
            </button>
          </div>

          <div className="mt-8 ml-8 text-white text-xl font-bold flex flex-col gap-2">
            <Link
              href={ROUTES.PROFILE}
              className="hover:text-[#9E63FF] py-1"
              onClick={closeModal}
            >
              My Profile
            </Link>
            <Link
              href={ROUTES.MY_AUCTIONS}
              className="hover:text-[#9E63FF] py-1"
              onClick={closeModal}
            >
              My Auctions
            </Link>
            <button
              className="text-start hover:text-[#9E63FF] py-1"
              onClick={() => {
                closeModal();
                dispatch(setModal({ key: MODAL_KEYS.BUY_PLAYS, value: true }));
              }}
            >
              Buy PLAYs
            </button>
            <Link
              href={ROUTES.PLAY_HISTORY}
              className="hover:text-[#9E63FF] py-1"
              onClick={closeModal}
            >
              PLAY History
            </Link>
          </div>
        </div>
        <div className="mx-auto w-2/3 max-w-48">
          <Button className="w-full" showAnimatedBorder onClick={LogoutHandler}>
            Log Out
          </Button>
        </div>
      </aside>
    </section>
  );
};

export default HamburgerSideMenu;
