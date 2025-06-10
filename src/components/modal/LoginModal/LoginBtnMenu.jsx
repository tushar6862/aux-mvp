import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import emailIcon from '@/assets/images/icons/email-icon.svg';
import phoneIcon from '@/assets/images/icons/phone-icon.svg';
import metamaskIcon from '@/assets/images/icons/Metamask-icon.svg';
import telegramIcon from '@/assets/images/icons/telegram-icon.svg';
import Button from '../../form-component/Button';
import { useCallback, useEffect, useState } from 'react';
import { openWalletModal, getAuthProvider } from '@/lib/web3Config';
import { useDispatch, useSelector } from 'react-redux';
import {
  LOGIN_BTN_KEYS,
  MODAL_KEYS,
  setLoginBtnLoading,
  setModal,
} from '@/redux/modal/action.modal';
import { LOGIN_METHOD_TYPES } from '@/utils/constant/constant.helper';
import { userLoginAction } from '@/redux/user/action.user';
import { modalState } from '@/redux/modal/reducer.modal';
import CustomImage from '@/components/CustomImage';
import { disconnectSocket } from '@/lib/socket';
import { userState } from '@/redux/user/reducer.user';
import { setIsSocketConnected } from '@/redux/socket/action.socket';

const origin_url = 'https://tg-game-auth.auctionx.dev';

const LoginBtnMenu = ({ setIsNoLoginShow, setOtpShow }) => {
  const dispatch = useDispatch();
  // TODO: resolve one issue and uncomment
  // const { emailLoginLoader, walletLoginLoader } = useSelector(
  //   (state) => state.modal,
  // );
  const [willRegisterFnCall, setWillRegisterFnCall] = useState(false);
  const { loginModal } = useSelector(modalState);
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { isConnected, address, status } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const connector = connectors[0];
  const { auctionHouseInfo } = useSelector(userState);
  const [telegramLoader, setTelegramLoader] = useState(false);

  const socketEmit = useCallback((res) => {
    if (res?.success) {
      dispatch(setIsSocketConnected(true));
    }
  }, []);

  const loginCallback = (res) => {
    if (res.success) {
      disconnectSocket();
      dispatch(setIsSocketConnected(false));
      dispatch(setModal({ key: MODAL_KEYS.LOGIN, value: false }));
    }

    if (!res.success) disconnect();

    setWillRegisterFnCall(false);
    dispatch(setLoginBtnLoading({ key: LOGIN_BTN_KEYS.EMAIL, value: false }));
    dispatch(setLoginBtnLoading({ key: LOGIN_BTN_KEYS.WALLET, value: false }));
    setTelegramLoader(false);
  };

  const handleConnectAndSign = async () => {
    await openWalletModal();
    setWillRegisterFnCall(true);
    dispatch(setLoginBtnLoading({ key: LOGIN_BTN_KEYS.WALLET, value: true }));
  };

  const handleArcanaRequest = async () => {
    try {
      setWillRegisterFnCall(true);
      dispatch(setLoginBtnLoading({ key: LOGIN_BTN_KEYS.EMAIL, value: true }));
      await connectAsync({ connector });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleConnect = async () => {
      const authProvider = await getAuthProvider();
      if (authProvider?.connected) {
        const { email } = authProvider?.getUser
          ? await authProvider.getUser()
          : null;

        dispatch(
          userLoginAction(
            {
              type: LOGIN_METHOD_TYPES.EMAIL,
              data: {
                signMessageAsync,
                disconnect,
                email,
                auctionHouseName: auctionHouseInfo?.currentAuctionHouse?.name,
              },
            },
            loginCallback,
          ),
        );
      } else if (address && isConnected) {
        dispatch(
          userLoginAction(
            {
              type: LOGIN_METHOD_TYPES.METAMASK,
              data: {
                signMessageAsync,
                disconnect,

                auctionHouseName: auctionHouseInfo?.currentAuctionHouse?.name,
              },
            },
            loginCallback,
          ),
        );
      }
    };
    willRegisterFnCall && handleConnect();
  }, [isConnected, address]);

  useEffect(() => {
    if (loginModal) {
      const btn = document.getElementById('email-button');
      btn?.focus?.();
    } else {
      setTelegramLoader(false);
    }
  }, [loginModal]);

  useEffect(() => {
    window?.addEventListener?.('message', (event) => {
      if (event.origin === origin_url) {
        dispatch(
          userLoginAction(
            {
              type: LOGIN_METHOD_TYPES.TELEGRAM,
              data: {
                telegramUser: event.data,
              },
            },
            loginCallback,
          ),
        );
      }
    });
    return () => {
      dispatch(setLoginBtnLoading({ key: LOGIN_BTN_KEYS.EMAIL, value: false }));
      dispatch(
        setLoginBtnLoading({ key: LOGIN_BTN_KEYS.WALLET, value: false }),
      );
      setTelegramLoader(false);
    };
  }, []);

  return (
    <div className="w-full  h-full flex flex-col justify-center items-center gap-3">
      <h2 className="text-center font-bold text-2xl ">Log In</h2>
      {/* <Button
        className="!text-xs py-2 w-3/4 mx-auto px-4 flex gap-2 justify-start items-center "
        onClick={() => {
          setTelegramLoader(true);
          const width = 450;
          const height = 600;
          const left = (screen.width - width) / 2;
          const top = (screen.height - height) / 2;

          const openmodal = window.open(
            origin_url,
            'openmodal',
            `width=${width},height=${height},top=${top},left=${left}`,
          );
          const checkIfClosed = setInterval(() => {
            if (openmodal.closed) {
              clearInterval(checkIfClosed);
              // Do something when the child window is closed
              setTimeout(() => {
                setTelegramLoader(false);
              }, 1500);
              // You can also call a function or refresh data, etc.
            }
          }, 500);
        }}
        disabled={telegramLoader}
      >
        <CustomImage
          src={telegramIcon}
          className="h-4 w-4"
          height={100}
          width={100}
          alt="btn-icon"
        />
        LOGIN WITH TELEGRAM{' '}
        {telegramLoader && (
          <div role="status" className="ml-3">
            <svg
              aria-hidden="true"
              className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </Button> */}

      <Button
        className="!text-xs py-2 w-3/4 mx-auto px-4 flex gap-2 justify-start items-center "
        onClick={() => {
          setIsNoLoginShow(true);
          setOtpShow(true);
        }}
        disabled={telegramLoader}
      >
        <CustomImage
          src={phoneIcon}
          className="h-4 w-4"
          height={100}
          width={100}
          alt="btn-icon"
        />
        LOGIN WITH OTP
      </Button>
      {/* Login with password */}
      <Button
        className="!text-xs py-2 w-3/4 mx-auto px-4 flex gap-2 justify-start items-center "
        onClick={() => {
          setOtpShow(false);
          setIsNoLoginShow(true);
        }}
      >
        <CustomImage
          src={phoneIcon}
          className="h-4 w-4"
          height={100}
          width={100}
          alt="btn-icon"
        />
        LOGIN WITH PASSWORD
      </Button>
      {/* <Button
        className=" py-2 w-3/4 mx-auto px-4 !text-xs flex gap-2 justify-start items-center "
        onClick={handleArcanaRequest}
        // TODO: resolve one issue and uncomment
        // loading={emailLoginLoader}
        id="email-button"
        disabled={telegramLoader}
      >
        <CustomImage
          src={emailIcon}
          className="h-4 w-4"
          alt="btn-icon"
          height={100}
          width={100}
        />
        LOGIN WITH EMAIL
      </Button> */}
      <Button
        className="py-2 w-3/4 mx-auto px-4 !text-xs flex gap-2 justify-start items-center"
        onClick={handleConnectAndSign}
        disabled={telegramLoader}
        // TODO: resolve one issue and uncomment
        // loading={walletLoginLoader}
      >
        <CustomImage
          src={metamaskIcon}
          className="h-4 w-4"
          alt="btn-icon"
          height={100}
          width={100}
        />
        LOGIN WITH WALLET
      </Button>
      {/* Commented temporary */}
      {/* <Button className="py-2 w-3/4 mx-auto px-4 !text-xs flex gap-2 justify-start items-center ">
        <CustomImage
          src={telegramIcon}
          className="h-4 w-4"
          alt="btn-icon"
          height={100}
          width={100}
        />
        LOGIN WITH TELEGRAM
      </Button> */}
    </div>
  );
};

export default LoginBtnMenu;
