import React from 'react';
import { FaXmark } from 'react-icons/fa6';

const ModalWrapper = ({
  children,
  show,
  closeHandler,
  className,
  hideCloseBtn,
}) => {
  // if (!show) return null;
  return (
    <>
      {show ? (
        <div className=" fixed inset-0 backdrop-blur-[2px] z-20" />
      ) : null}
      <div
        className={`fixed inset-0  transition-all duration-500 ease-in-out max-w-lg mx-auto flex justify-center items-center ${show ? 'scale-100' : 'scale-0'} z-50`}
      >
        <div
          className={`w-[90%] h-96 min-h-fit border-custom-gradient p-[2px] rounded-3xl bg-box-shadow ${className}`}
        >
          <div className="rounded-3xl w-full h-full bg-[#190C3D] text-white relative">
            {children}
            <button
              type="button"
              className="text-lg font-black  absolute top-3 right-3 rounded-full text-white bg-[#FFFFFF33] aspect-square w-8 flex justify-center items-center hover:bg-white hover:text-[#190C3D] transition-all disabled:hidden"
              onClick={() => closeHandler?.()}
              disabled={!closeHandler || hideCloseBtn}
            >
              <FaXmark />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalWrapper;
