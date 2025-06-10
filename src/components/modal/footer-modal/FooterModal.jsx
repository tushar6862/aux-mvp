import { FaArrowDown } from 'react-icons/fa';
import { createPortal } from 'react-dom';

const FooterModal = ({ show, children, closeModal, isComingSoonShow }) => {
  const footerId = document.getElementById('footer-id');
  if (!footerId) return null;
  return (
    <section>
      {createPortal(
        <>
          {show ? (
            <div
              className="fixed w-full h-[100vh] bg-dim backdrop-blur-[2px] top-0 left-0 cursor-pointer z-0"
              onClick={() => closeModal?.()}
            />
          ) : null}
          <div
            className={`flex justify-center w-full ${
              show ? 'translate-y-0' : 'translate-y-[50rem]'
            } footer-modal-animation `}
          >
            <div className=" absolute bottom-1 min-h-[50vh] max-w-lg z-10 animated-border-custom-gradient px-[2px] pt-[2px] h-2/4 w-full rounded-t-xl ">
              <div className="bg-[#190C3D] bg-box-shadow before:!rounded-t-xl before:!rounded-none before:!inset-0 z-10 h-full w-full rounded-t-xl px-2 pt-1">
                {isComingSoonShow ? (
                  <div className="h-full w-full flex justify-center items-center text-4xl font-extrabold">
                    Coming Soon...
                  </div>
                ) : (
                  <div className="overflow-auto h-full w-full">{children}</div>
                )}
              </div>
              <button
                className={
                  'absolute -top-10 left-1/2 transform -translate-x-1/2 z-10 flex items-center justify-center cursor-pointer disabled:hidden'
                }
                onClick={() => closeModal?.()}
              >
                <div className="bg-[#B57FEC80] rounded-md aspect-square h-10 flex items-center hover:bg-white hover:text-[#9E63FF] text justify-center gap-1 active:opacity-90 outline-none">
                  <div className="font-bold text-2xl">
                    <FaArrowDown />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </>,
        footerId,
      )}
    </section>
  );
};

export default FooterModal;
