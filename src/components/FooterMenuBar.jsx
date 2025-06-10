'use client';
import dynamic from 'next/dynamic';
import bidThunderIcon from '@/assets/images/bid-thunder.png';
import howToIcon from '@/assets/images/howto.png';
import myBidsIcon from '@/assets/images/my-bids.png';
import biddersIcon from '@/assets/images/bidder.png';
import { useParams, usePathname } from 'next/navigation';
import useQueryParam from '@/hooks/useQueryParam';
import {
  AUCTION_STATUS,
  FOOTER_MODAL_TYPES,
  PLAYER_STATUS,
  ROUTES,
  SORT_FIELDS_NAME,
  SORT_ORDER,
  sortInitialValue,
} from '@/utils/constant/constant.helper';
import { useCallback, useEffect, useState } from 'react';
import { MODAL_KEYS, setModal } from '@/redux/modal/action.modal';
import { useDispatch, useSelector } from 'react-redux';
import { userState } from '@/redux/user/reducer.user';
import CustomImage from './CustomImage';
import { auctionState } from '@/redux/auctions/reducer.auctions';
import { modalState } from '@/redux/modal/reducer.modal';

/**
 * @desc All modals should be imported dynamically because these components only work on the client side.
 * Enabling SSR (server-side rendering) for modals will cause errors, as they rely client-side execution that is unavailable during SSR.
 */

const BiddersListModal = dynamic(
  () => import('./modal/footer-modal/BidderListModal'),
  {
    ssr: false,
  },
);
const WinMessageModal = dynamic(
  () => import('./modal/footer-modal/WinMessageModal'),
  {
    ssr: false,
  },
);

const HowToModal = dynamic(() => import('./modal/footer-modal/HowToModal'), {
  ssr: false,
});
const RedeemModal = dynamic(() => import('./modal/footer-modal/RedeemModal'), {
  ssr: false,
});

const FooterMenuBar = () => {
  const pathName = usePathname();
  const params = useParams();
  const router = useQueryParam();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(userState);
  const { currentAuction, recentBidData, isWinning } =
    useSelector(auctionState);
  const [currentModal, setCurrentModal] = useState('');
  const [bidData, setBidData] = useState([]);
  const [sortField, setSortField] = useState(sortInitialValue);
  const { winnerModal } = useSelector(modalState);

  const closeModalHandler = () => {
    setCurrentModal('');
    dispatch(setModal({ key: MODAL_KEYS.WINNER, value: false }));
  };
  /**
   * @description this function returns to show winning tag or not
   *   if auction is completed and user is winner so winning tag will show
   *   if auction is live and user hit the winning bid so winning tag will show
   * */
  const showWinningTag = () => {
    if (currentAuction?.state === AUCTION_STATUS.COMPLETED)
      return currentAuction?.status === PLAYER_STATUS.WON;
    if (currentAuction?.state === AUCTION_STATUS.LIVE) {
      return isWinning;
    }
  };

  /**
   * @description this function sorts the data in client side this is only for live auction
   */
  const sortBidData = useCallback(() => {
    const sortedBidData = [...recentBidData];
    if (sortField.field && sortField.order) {
      sortedBidData?.sort((a, b) => {
        if (sortField.field === SORT_FIELDS_NAME.BID_PRICE)
          return sortField.order === SORT_ORDER.ASCENDING
            ? a?.[SORT_FIELDS_NAME.BID_PRICE] - b?.[SORT_FIELDS_NAME.BID_PRICE]
            : b?.[SORT_FIELDS_NAME.BID_PRICE] - a?.[SORT_FIELDS_NAME.BID_PRICE];
        else if (sortField.field === SORT_FIELDS_NAME.CREATED_AT)
          return sortField.order === SORT_ORDER.ASCENDING
            ? new Date(a?.[SORT_FIELDS_NAME.CREATED_AT]) -
                new Date(b?.[SORT_FIELDS_NAME.CREATED_AT])
            : new Date(b?.[SORT_FIELDS_NAME.CREATED_AT]) -
                new Date(a?.[SORT_FIELDS_NAME.CREATED_AT]);
      });
    }

    setBidData(sortedBidData);
  }, [sortField.field, sortField.order, recentBidData]);

  useEffect(() => {
    if (currentModal === FOOTER_MODAL_TYPES.MY_BIDS) sortBidData();
    else setBidData([]);
  }, [currentModal === FOOTER_MODAL_TYPES.MY_BIDS, recentBidData]);

  return (
    <>
      <div className="fixed left-0 z-20 w-full px-5 py-0 bottom-2">
        <div id="footer-id" className="relative" />
        <div className="flex items-center w-full max-w-lg mx-auto rounded-[35px] bg-[#DFDADA17] backdrop-blur-3xl">
          <FooterMenuButton
            name="Bid"
            image={bidThunderIcon}
            active={pathName === `/${params.auctionId}` && !currentModal}
            onClick={() => {
              dispatch(setModal({ key: MODAL_KEYS.WINNER, value: false }));
              router.push(ROUTES.BASE);
            }}
          />
          <FooterMenuButton
            name="My Bids"
            image={myBidsIcon}
            active={currentModal === FOOTER_MODAL_TYPES.MY_BIDS}
            onClick={() => {
              if (userInfo?.accessToken) {
                dispatch(setModal({ key: MODAL_KEYS.WINNER, value: false }));
                setCurrentModal(FOOTER_MODAL_TYPES.MY_BIDS);
              } else dispatch(setModal({ key: MODAL_KEYS.LOGIN, value: true }));
            }}
          >
            {showWinningTag() ? (
              <div className="relative">
                <div className="absolute winner-tag p-1 top-4 rotate-6 text-xs left-2">
                  WINNING
                </div>
              </div>
            ) : null}
          </FooterMenuButton>
          <FooterMenuButton
            name="Redeem"
            image={biddersIcon}
            active={currentModal === FOOTER_MODAL_TYPES.REDEEM}
            onClick={() => {
              dispatch(setModal({ key: MODAL_KEYS.WINNER, value: false }));
              setCurrentModal(FOOTER_MODAL_TYPES.REDEEM);
            }}
          />
          <FooterMenuButton
            name="How to"
            image={howToIcon}
            active={currentModal === FOOTER_MODAL_TYPES.HOW_TO}
            onClick={() => {
              dispatch(setModal({ key: MODAL_KEYS.WINNER, value: false }));
              setCurrentModal(FOOTER_MODAL_TYPES.HOW_TO);
            }}
          />
        </div>
      </div>
      <BiddersListModal
        auctionType={currentAuction?.auctionCategory?.code}
        currentAuctionState={currentAuction?.state}
        bidData={
          currentAuction?.state === AUCTION_STATUS.COMPLETED
            ? recentBidData
            : bidData
        }
        show={currentModal === FOOTER_MODAL_TYPES.MY_BIDS}
        closeModal={closeModalHandler}
        setSortField={setSortField}
        sortField={sortField}
        sortBidData={sortBidData}
      />

      {/* //TODO this modal we manage from redux */}
      <WinMessageModal show={winnerModal} closeModal={closeModalHandler} />

      <HowToModal
        show={currentModal === FOOTER_MODAL_TYPES.HOW_TO}
        closeModal={closeModalHandler}
      />

      <RedeemModal
        show={currentModal === FOOTER_MODAL_TYPES.REDEEM}
        closeModal={closeModalHandler}
      />
    </>
  );
};

export default FooterMenuBar;

export const FooterMenuButton = ({
  active,
  image,
  name,
  onClick,
  children,
}) => (
  <button
    type="button"
    className={`cursor-pointer relative flex items-center rounded-xl flex-col justify-center font-bold text-xs px-2.5 py-1.5 gap-1 select-none flex-1 text-white
  ${active && 'text-white'}`}
    onClick={(e) => onClick?.(e)}
  >
    {image && (
      <CustomImage
        src={image}
        alt={name}
        width={28}
        height={28}
        className={`w-7 h-7 object-contain
        ${active && 'filter-none'}`}
      />
    )}
    <span>{name}</span>
    <div
      className={`absolute hidden -bottom-1 left-1/2 -translate-x-1/2 bg-[#D9D9D9] rounded-sm shadow-[0px_0px_4px_0px_#B88CFF] h-1 w-4/5
      ${active && '!block'}`}
    />
    <div className="ribbon absolute -top-5">{children}</div>
  </button>
);
