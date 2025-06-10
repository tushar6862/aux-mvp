'use client';

import CustomImage from '@/components/CustomImage';
import Button from '@/components/form-component/Button';
import useQueryParam from '@/hooks/useQueryParam';
import { MODAL_KEYS, setModal } from '@/redux/modal/action.modal';
import { userState } from '@/redux/user/reducer.user';
import {
  DYNAMIC_IMAGE_UNOPTIMISED,
  NOT_APPLICABLE,
  ROUTES,
} from '@/utils/constant/constant.helper';
import { useDispatch, useSelector } from 'react-redux';
import { useDisconnect } from 'wagmi';
import TableData from './_components/TableData';
import { TbEdit } from 'react-icons/tb';
import { PiPowerBold } from 'react-icons/pi';
import { userLogoutAction } from '@/redux/user/action.user';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(setModal({ key: MODAL_KEYS.HAMBURGER_MENU, value: false }));
  };
  const { disconnect } = useDisconnect();
  const { userInfo, walletBalance } = useSelector(userState);
  const router = useQueryParam();

  const LogoutHandler = () => {
    dispatch(
      userLogoutAction((res) => {
        if (res?.success) {
          router.replace(ROUTES.BASE);
          disconnect?.();
          closeModal?.();
        }
      }),
    );
  };

  return (
    <div className="w-full h-full">
      <h2 className="text-center font-semibold text-3xl mt-10 mb-5">Profile</h2>
      <div className="relative w-full rounded-3xl bg-[#DFDADA17] p-6 border border-[#8F8F8F] flex flex-col items-center justify-center gap-6 mb-48">
        <div className="flex flex-row w-full px-2 gap-1">
          <div className="w-1/2">
            <div
              className="group w-24 aspect-square mx-auto rounded-full h-auto bg-black relative cursor-pointer"
              onClick={() =>
                dispatch(setModal({ key: MODAL_KEYS.USER_INFO, value: true }))
              }
            >
              <CustomImage
                path={userInfo?.avatar}
                alt="profile-image"
                height={500}
                width={500}
                className="w-full h-full rounded-full"
                unoptimized={DYNAMIC_IMAGE_UNOPTIMISED}
              />
              <div className="group transition-all bg-[#B57FEC80] p-1 duration-300 ease-in-out absolute bottom-0 hover:backdrop-blur-sm  rounded-full">
                <TbEdit className="aspect-square w-5 h-auto transition-all duration-300 ease-in-out group-hover:w-7" />
              </div>
            </div>
          </div>
          <div className="w-1/2 font-semibold  h-28 flex justify-center flex-col">
            <div
              onClick={() =>
                dispatch(setModal({ key: MODAL_KEYS.USER_INFO, value: true }))
              }
            >
              <h3 className="text-base relative group flex gap-2  items-center cursor-pointer">
                {!userInfo?.first_name && !userInfo?.last_name
                  ? NOT_APPLICABLE
                  : [userInfo?.first_name, userInfo?.last_name].join(' ')}
                <TbEdit className="transition-all duration-300 ease-in-out" />
              </h3>
            </div>
            <button
              type="button"
              className="text-[#9E63FF] absolute top-4 right-4 text-sm hover:underline w-fit flex gap-1 items-center"
              onClick={LogoutHandler}
            >
              <PiPowerBold className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </div>
        <TableData
          walletAddress={userInfo?.wallet_address}
          walletBallance={walletBalance}
          referralCode={userInfo?.referral_code}
          playerId={userInfo?.id}
        />

        <div className="w-3/5 min-w-36 mx-auto">
          <Button
            className="w-full bg-box-shadow"
            onClick={() => {
              dispatch(setModal({ key: MODAL_KEYS.BUY_PLAYS, value: true }));
            }}
          >
            BUY MORE PLAYS
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
