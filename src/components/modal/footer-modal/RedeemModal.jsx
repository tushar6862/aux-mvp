'use client';

import { FaXTwitter } from 'react-icons/fa6';
import FooterModal from './FooterModal';

const RedeemModal = ({ show, closeModal, footerRef, userInfo }) => {
  function followTwitter() {
    const width = 550;
    const height = 420;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    window.open(
      'https://twitter.com/intent/follow?screen_name=auctionx_live',
      'Follow @auctionx_live',
      `width=${width},height=${height},top=${top},left=${left}`,
    );
  }
  return (
    <FooterModal
      show={show}
      closeModal={closeModal}
      footerRef={footerRef}
      // To enable comming soon text uncomment this
      // isComingSoonShow
    >
      {/* Game  Point Redeem */}
      {/* <div className="mt-12 modalWrapper  flex justify-center items-center flex-col text-white">
        <h2 className="modal-info mx-auto my-2 text-2xl max-mobile:w-full text-center font-extrabold">
          Convert Your Game Points
        </h2>
        <div>
          <p className="text-sm text-center">
            Total Game Points Earned Till Date:{' '}
            <span className="text-lg font-bold">{total_gp}</span>
          </p>
          <div>
            <div className="border-custom-gradient p-[2px] w-full mx-auto rounded-sm  mt-5">
              <div className="!bg-[#190C3D] py-2 px-3 w-full rounded-sm text-md font-bold">
                <input
                  type="text"
                  name="input"
                  className="bg-transparent w-full rounded-sm text-sm font-bold"
                  value={`${total_gp - redeemed_gp} Game points will be converted`}
                  disabled
                />
              </div>
            </div>

            <div className="bg-[#49ffe9a6] p-[2px] w-4/5 mx-auto rounded-full mt-5 mb-2 ">
              <button className="bg-[#190C3D] py-2 w-full rounded-full text-md font-bold">
                CONVERT TO PLAYS
              </button>
            </div>
            {!userInfo?.telegram_id ? (
              <p className="text-red">This feature is not available.</p>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div> */}

      {/* Follow us on social media */}
      {/* <div className="mt-12 modalWrapper flex justify-center items-center flex-col text-white">
        <h3>Follow us on </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={followTwitter}
            className="flex items-center gap-3 p-2 mt-2"
          >
            <FaXTwitter />
          </button>
          <Button
            type="button"
            onClick={followTwitter}
            className="flex items-center gap-3 p-2 mt-2"
          >
            <FaXTwitter />
          </Button>
        </div>
      </div> */}

      <div className="mt-12 modalWrapper flex justify-center flex-col sm:flex-row items-center gap-4 text-white">
        <h3 className="font-bold">Earn Plays</h3>
        {/* <!-- Twitter Button --> */}
        <div
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-2xl shadow hover:bg-neutral-900 transition cursor-pointer"
          onClick={followTwitter}
        >
          <FaXTwitter />
          Follow on X
        </div>

        {/* <!-- Telegram Button --> */}
        {/* <div
          className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-2xl shadow hover:bg-blue-500 transition"
          onClick={followTwitter}
        >
          <FaTelegram />
          Join on Telegram
        </div> */}
      </div>
    </FooterModal>
  );
};

export default RedeemModal;
