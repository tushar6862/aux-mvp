import React, { useEffect, useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import LoginPhoneNo from './LoginPhoneNo';
import LoginBtnMenu from './LoginBtnMenu';
import { useDispatch, useSelector } from 'react-redux';
import { MODAL_KEYS, setModal } from '@/redux/modal/action.modal';
import { modalState } from '@/redux/modal/reducer.modal';

const LoginModal = () => {
  const [isNoLoginShow, setIsNoLoginShow] = useState(false);
  const [otpShow, setOtpShow] = useState(false);
  const dispatch = useDispatch();
  const { loginModal } = useSelector(modalState);

  useEffect(() => {
    if (!loginModal) setTimeout(() => setIsNoLoginShow(false), 300);
  }, [loginModal]);
  return (
    <ModalWrapper
      show={loginModal}
      closeHandler={() =>
        dispatch(setModal({ key: MODAL_KEYS.LOGIN, value: false }))
      }
    >
      {isNoLoginShow ? (
        <LoginPhoneNo setIsNoLoginShow={setIsNoLoginShow} isOtpShow={otpShow} />
      ) : (
        <LoginBtnMenu
          setIsNoLoginShow={setIsNoLoginShow}
          setOtpShow={setOtpShow}
        />
      )}
    </ModalWrapper>
  );
};

export default LoginModal;
