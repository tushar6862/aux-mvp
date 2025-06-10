import FooterModal from './FooterModal';
import LikeImg from '@/assets/images/like-up.png';
import DislikeImg from '@/assets/images/like-down.png';
import { convertDateIST, groupByDate } from '@/utils/helpers/utils.helper';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import { useEffect, useMemo, useState } from 'react';
import ToggleButton from '@/components/form-component/ToggleButton';
import CustomImage from '@/components/CustomImage';
import useInfintieScroll from '@/hooks/useInfintieScroll';
import { useDispatch, useSelector } from 'react-redux';
import { auctionState } from '@/redux/auctions/reducer.auctions';
import { getBidLogsAction } from '@/redux/auctions/action.auctions';
import { useParams, useSearchParams } from 'next/navigation';
import {
  AUCTION_CATEGORY_KEYS,
  AUCTION_STATUS,
  AUCTION_TYPES,
  AUX_STATUS,
  CURRENCY_SYMBOLS,
  DYNAMIC_IMAGE_UNOPTIMISED,
  SORT_FIELDS_NAME,
  SORT_ORDER,
  sortInitialValue,
  TIME_FORMAT,
} from '@/utils/constant/constant.helper';
import { userState } from '@/redux/user/reducer.user';
import ButtonLoading from '@/components/form-component/ButtonLoading';
// import UpperArrow from '@/assets/images/icons/upperArrow.svg';
// import { TOOLTIP_MESSAGES } from '@/utils/constant/constant.helper';

const BiddersListModal = ({
  show,
  closeModal,
  auctionType,
  currentAuctionState,
  bidData,
  sortBidData,
  setSortField,
  sortField,
}) => {
  const [myBids, setMyBids] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const { recentBidMetaData, bidLogsLoading } = useSelector(auctionState);
  const { userInfo } = useSelector(userState);
  const { auctionId } = useParams();
  const dispatch = useDispatch();
  const searchParam = useSearchParams();

  const fetchRecentBid = () => {
    dispatch(
      getBidLogsAction(
        auctionId,
        {
          page: currentPage,
          limit: 30,
          player_id: myBids ? userInfo?.id : null,
          sort: sortField.field,
          order: sortField.order,
        },
        (res) => {
          res?.success && setCurrentPage(res?.metadata?.page + 1);
        },
      ),
    );
  };

  const { cardRef, moveToTop } = useInfintieScroll(
    recentBidMetaData?.totalPage,
    currentPage,
    fetchRecentBid,
    searchParam.get(AUX_STATUS) === AUCTION_STATUS.COMPLETED &&
      userInfo?.accessToken &&
      !bidLogsLoading,
  );

  const sortHandler = (fieldName) => {
    moveToTop?.();
    setCurrentPage(0);
    setSortField((prev) => {
      if (prev.field !== fieldName)
        return { field: fieldName, order: SORT_ORDER.ASCENDING };
      else if (prev.field === fieldName && prev.order === SORT_ORDER.ASCENDING)
        return { field: fieldName, order: SORT_ORDER.DESCENDING };
      return sortInitialValue;
    });
  };

  useEffect(() => {
    if (!show) {
      setSortField({
        field: SORT_FIELDS_NAME.CREATED_AT,
        order: SORT_ORDER.DESCENDING,
      });
      moveToTop?.();
      setCurrentPage(0);
    } else if (
      searchParam.get(AUX_STATUS) === AUCTION_STATUS.COMPLETED &&
      userInfo?.accessToken
    )
      fetchRecentBid();
    else sortBidData();
  }, [
    show,
    searchParam.get(AUX_STATUS),
    myBids,
    sortField.field,
    sortField.order,
  ]);

  const toggleMyBids = () => {
    moveToTop?.();
    setCurrentPage(0);
  };
  const groupDataObj = useMemo(
    () => groupByDate(bidData, 'created_at'),
    [bidData],
  );

  return (
    <FooterModal show={show} closeModal={closeModal}>
      {currentAuctionState === AUCTION_STATUS.COMPLETED ? (
        <div className="items-center w-full font-bold mt-2  flex justify-center gap-2 text-xs ">
          <button
            className="disabled:font-bold   disabled:text-white text-[#B57FEC] cursor-pointer disabled:cursor-default group"
            disabled={!myBids}
            onClick={() => {
              setMyBids(false);
              toggleMyBids();
            }}
          >
            All Bids
            <span className=" mx-auto w-5/6 bg-white h-[3px] block group-enabled:invisible" />
          </button>
          <ToggleButton
            id="toggle-btn"
            name="toggle-btn"
            value={myBids}
            onClick={() => {
              toggleMyBids();
              setMyBids((prev) => !prev);
            }}
          />

          <button
            className="disabled:font-bold   disabled:text-white text-[#B57FEC] cursor-pointer disabled:cursor-default group"
            onClick={() => {
              toggleMyBids();
              setMyBids(true);
            }}
            disabled={myBids}
          >
            My Bids
            <span className=" mx-auto w-5/6 bg-white h-[3px] block group-enabled:invisible" />
          </button>
        </div>
      ) : null}
      <div
        className={`w-full overflow-auto pb-2  ${currentAuctionState === AUCTION_STATUS.COMPLETED ? 'h-[calc(100%-30px)]' : 'h-full'}`}
        ref={cardRef}
      >
        <table className="w-full text-sm px-3">
          <thead>
            <tr className="sticky top-0  w-full bg-[#190C3D] h-10 z-10 text-[#9E63FF] select-none">
              <th
                className={`px-1 ${currentAuctionState === AUCTION_STATUS.COMPLETED ? '' : 'hidden'}`}
              >
                Player
              </th>
              <th className="px-1">
                {auctionType === AUCTION_TYPES.MIN
                  ? 'LowestUnique'
                  : 'HighestUnique'}
              </th>
              <th className="px-1">Unique</th>
              <th
                className="relative cursor-pointer min-w-10 px-1"
                onClick={() => sortHandler(SORT_FIELDS_NAME.BID_PRICE)}
              >
                Bid
                <SortFieldArrow
                  fieldName={SORT_FIELDS_NAME.BID_PRICE}
                  sortField={sortField}
                />
              </th>
              <th
                className="relative cursor-pointer max-w-36 px-1"
                onClick={() => sortHandler(SORT_FIELDS_NAME.CREATED_AT)}
              >
                Time({TIME_FORMAT.IST})
                <SortFieldArrow
                  fieldName={SORT_FIELDS_NAME.CREATED_AT}
                  sortField={sortField}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {bidData?.length
              ? Object.keys(groupDataObj).map((bid) => (
                  <>
                    <tr>
                      <td colSpan={5}>
                        <div className="flex justify-center items-center gap-4">
                          <span className="w-2/6 h-[1px] bg-[#B57FEC]" />
                          <h3 className="text-xs font-semibold text-[#B57FEC]">
                            {bid}
                          </h3>
                          <span className="w-2/6 bg-[#B57FEC] h-[1px]" />
                        </div>
                      </td>
                    </tr>

                    {groupDataObj?.[bid]?.map((bid, index) => {
                      return (
                        <tr
                          key={index}
                          className={
                            bid?.is_unique &&
                            bid?.[
                              auctionType === AUCTION_TYPES.MIN
                                ? AUCTION_CATEGORY_KEYS.IS_LOWEST
                                : AUCTION_CATEGORY_KEYS.IS_HIGHEST
                            ]
                              ? 'border border-green-500 blink-effect'
                              : ''
                          }
                        >
                          <td
                            className={`text-center text-xs py-1 ${currentAuctionState === AUCTION_STATUS.COMPLETED ? 'block' : 'hidden'}`}
                          >
                            <div className="w-full flex justify-start gap-1">
                              <CustomImage
                                src={bid.profile_image}
                                alt={bid?.player_name}
                                className="w-5 h-5"
                                width={500}
                                height={500}
                                unoptimized={DYNAMIC_IMAGE_UNOPTIMISED}
                              />
                              {bid?.player_name}
                            </div>
                          </td>
                          <td className="text-center py-1">
                            <div className="w-5 h-5  mx-auto">
                              {/* //TODO:uncomment this arrow condition when use arrow */}
                              {bid?.[
                                auctionType === AUCTION_TYPES.MIN
                                  ? AUCTION_CATEGORY_KEYS.IS_LOWEST
                                  : AUCTION_CATEGORY_KEYS.IS_HIGHEST
                              ] && bid?.is_unique ? (
                                <CustomImage
                                  src={LikeImg}
                                  alt="avatar"
                                  height={20}
                                  width={20}
                                  className="w-full h-full py-[2px]"
                                  // src={bid?.is_unique ? LikeImg : UpperArrow}
                                  // className={`m-auto py-[2px] ${
                                  //   !bid?.is_unique && auctionType === 'MIN'
                                  //     ? 'rotate-180'
                                  //     : ''
                                  // }${!bid?.is_unique ? 'cursor-pointer' : ''}`}
                                  // title={
                                  //   !bid?.is_unique
                                  //     ? auctionType === 'MIN'
                                  //       ? TOOLTIP_MESSAGES.MIN_ARROW
                                  //       : TOOLTIP_MESSAGES.MAX_ARROW
                                  //     : ''
                                  // }
                                />
                              ) : (
                                <CustomImage
                                  src={DislikeImg}
                                  alt="avatar"
                                  height={20}
                                  width={20}
                                  className="w-full h-full py-[2px]"
                                />
                              )}
                            </div>
                          </td>
                          <td className="text-center py-1">
                            <div className="w-5 h-5 mx-auto">
                              <CustomImage
                                src={bid?.is_unique ? LikeImg : DislikeImg}
                                className="w-full h-full "
                                height={100}
                                width={100}
                                alt="thumb"
                              />
                            </div>
                          </td>
                          <td className="text-center py-1">
                            {CURRENCY_SYMBOLS.DEFAULT} {bid?.bid_price || '-'}
                          </td>
                          <td className="text-center py-1 min-w-24">
                            {convertDateIST(bid?.created_at, true)}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ))
              : !bidLogsLoading && (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No Recent Bid Found.
                    </td>
                  </tr>
                )}
            {bidLogsLoading ? (
              <tr>
                <td colSpan={5} className="text-center">
                  <ButtonLoading />
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </FooterModal>
  );
};

export default BiddersListModal;

const SortFieldArrow = ({ fieldName, sortField }) => {
  return (
    <>
      <TiArrowSortedUp
        className={`absolute top-2 mt-[1px]  left-3/4 ${sortField.field === fieldName && sortField.order === SORT_ORDER.ASCENDING ? 'text-white' : ''}`}
      />
      <TiArrowSortedDown
        className={`absolute top-4 mt-[1px]  left-3/4 ${sortField.field === fieldName && sortField.order === SORT_ORDER.DESCENDING ? 'text-white' : ''}`}
      />
    </>
  );
};
