import dynamic from 'next/dynamic';
import {
  AUCTION_STATUS,
  AUCTION_TYPES,
  CURRENCY_SYMBOLS,
  PLAYER_STATUS,
} from '@/utils/constant/constant.helper';

import Highest from '@/assets/images/Highest.png';
import Lowest from '@/assets/images/Lowest.png';
import lost from '@/assets/images/LostIcon.png';
import Arrow from '@/assets/images/Vector.png';
import Cross from '@/assets/images/Cross.png';
import CustomImage from './CustomImage';
import { useDispatch, useSelector } from 'react-redux';
import { MODAL_KEYS, setModal } from '@/redux/modal/action.modal';
import { auctionState } from '@/redux/auctions/reducer.auctions';

const CircularProgressBar = dynamic(
  () => import('@/components/progress-bar/CircularProgressBar'),
  { ssr: false },
);

const getImageByStatus = (status, claimImageClick) => {
  switch (status) {
    case PLAYER_STATUS.WON:
      return (
        <CircularProgressBar
          percentage={100}
          isClaimShow
          claimImageClick={claimImageClick}
        />
      );
    case PLAYER_STATUS.LOST:
      return (
        <div className="w-[100px] h-[100px] absolute  top-[-20px] right-[12px] max-mobile:right-[28px] bottom-0 m-auto ">
          <CustomImage
            className={'h-full w-full'}
            src={lost}
            height={100}
            width={100}
            alt="lost wheel"
          />
        </div>
      );
  }
};

const BidBarSection = ({
  productPrice,
  percentage = 0,
  isUnique,
  isHighest,
  isStatus,
  state,
  isHighestAndUniqueShow,
  onNumpadClick,
  inputValue,
  onSubmitBid,
  onClearInput,
}) => {
  const dispatch = useDispatch();
  const { currentAuction, isWinning } = useSelector(auctionState);

  const claimImageClick = () => {
    dispatch(setModal({ key: MODAL_KEYS.WINNER, value: true }));
  };

  const handleNumpadClick = (value) => {
    if (value === '→') {
      // Submit form
      onSubmitBid && onSubmitBid();
    } else if (value === '✖️') {
      // Clear input
      onClearInput && onClearInput();
    } else {
      // Add number or decimal
      onNumpadClick && onNumpadClick(value);
    }
  };
  return (
    <>
      <div className="absolute right-[20px] flex items-center w-full justify-end">
        {AUCTION_STATUS.LIVE === state ? (
          <CircularProgressBar percentage={percentage} />
        ) : (
          getImageByStatus(isStatus, claimImageClick)
        )}
      </div>
      {AUCTION_STATUS.LIVE === state ? (
        <div className="absolute z-10 -bottom-[60px] flex items-center w-full justify-center text-sm font-bold">
          {productPrice ? CURRENCY_SYMBOLS.DEFAULT + productPrice : null}
        </div>
      ) : null}
      {AUCTION_STATUS.LIVE === state ? (
        <div
          id="BidBarSection"
          className="bidbar grid grid-cols-3 gap-3 pt-3 mb-3"
        >
          {/* Left - Number Pad */}
          <div className="bbnumPad col-span-2 flex gap-1.5">
            <div className="bbnpCard grid grid-cols-3 w-full">
              {[
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '.',
                '0',
                '✖️',
              ].map((val, idx) => (
                <>
                  <button
                    key={idx}
                    onClick={() => handleNumpadClick(val)}
                    className="bg-white/10 backdrop-blur-sm text-white text-lg h-10 rounded-[8px] flex items-center justify-center shadow-sm transition active:scale-95"
                  >
                    {val === '✖️' ? (
                      <CustomImage
                        src={Cross}
                        alt="Clear"
                        width={12}
                        height={12}
                      />
                    ) : (
                      <>{val}</>
                    )}
                  </button>
                </>
              ))}
            </div>
            <button
              onClick={() => handleNumpadClick('→')}
              className="bg-white/10 backdrop-blur-sm text-white rounded-md py-2 px-3 shadow-sm transition active:scale-95 flex items-center justify-center"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
              }}
            >
              <CustomImage src={Arrow} alt="Submit" width={18} height={18} />
            </button>
          </div>
          {/* Vertical → button */}

          {/* <div className="!w-5 aspect-square h-auto flex items-center flex-col">
            <CustomImage
              src={isHighest ? LikeImg : DislikeImg}
              className="w-full h-full "
              height={100}
              width={100}
              alt="thumb image"
            />
            <div className="text-sm font-bold mt-1">
              {currentAuction?.auctionCategory?.code === AUCTION_TYPES.MIN
                ? 'LowestUnique'
                : 'HighestUnique'}
            </div>
          </div> */}
          {/* Right - Unique Info */}
          <div className="bbValue col-span-1 self-center">
            <div className="text-center mb-4">
              <div className="w-[80px] h-[80px] max-small-mobile:w-[85px] max-small-mobile:h-[85px] m-auto">
                <CustomImage
                  src={isUnique ? Highest : Lowest}
                  className="w-full h-full object-contain"
                  height={70}
                  width={70}
                  alt="thumb image"
                />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-purple-300 leading-none text-center">
              04
            </div>
            <div className="text-sm text-purple-200 text-center">
              Unique Values
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default BidBarSection;
