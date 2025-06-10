'use client';
import ButtonLoading from '@/components/form-component/ButtonLoading';
import {
  NoRecordMessage,
  Table,
  TableCell,
  TableRow,
} from '@/components/Table/CustomTable';
import useInfintieScroll from '@/hooks/useInfintieScroll';
import { getMyAuctionListAction } from '@/redux/auctions/action.auctions';
import { auctionState } from '@/redux/auctions/reducer.auctions';
import { userState } from '@/redux/user/reducer.user';
import {
  AUCTION_STATUS,
  AUX_STATUS,
  ROUTES,
} from '@/utils/constant/constant.helper';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const MyAuctionsPage = () => {
  const { userInfo, auctionHouseInfo } = useSelector(userState);
  const { myAuctionList, myAuctionsLoading, auctionMetadata } =
    useSelector(auctionState);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);

  const fetchMyAuctions = () => {
    dispatch(
      getMyAuctionListAction(
        userInfo?.id,
        {
          limit: 50,
          page: currentPage,
          auction_house_id: auctionHouseInfo?.currentAuctionHouse?.id,
          state: AUCTION_STATUS.COMPLETED,
        },
        (res) => res?.success && setCurrentPage(res?.metadata?.page + 1),
      ),
    );
  };

  const { cardRef, moveToTop } = useInfintieScroll(
    auctionMetadata?.totalPage,
    currentPage,
    fetchMyAuctions,
    userInfo?.accessToken && !myAuctionsLoading,
  );

  useEffect(() => {
    if (userInfo?.id) {
      fetchMyAuctions();
      moveToTop?.();
    }
  }, [userInfo?.id, auctionHouseInfo?.id]);
  return (
    <div className="w-full h-full">
      <h2 className="text-center font-semibold text-3xl mt-10 mb-5">
        My Auctions
      </h2>
      <div className="w-full h-96 rounded-3xl bg-[#DFDADA17] px-2 py-4 border border-[#8F8F8F]  mb-48">
        <div className="overflow-auto w-full h-full  relative" ref={cardRef}>
          <Table>
            <TableRow isHeader>
              <TableCell isHeader className="min-w-44">
                Auction
              </TableCell>
              <TableCell isHeader>My bids</TableCell>
              <TableCell isHeader className="min-w-32">
                Plays consumed
              </TableCell>
              <TableCell isHeader>Total bids</TableCell>
              <TableCell isHeader className="min-w-28">
                Total players
              </TableCell>
            </TableRow>

            {myAuctionList?.length
              ? myAuctionList?.map((auction, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Link
                        className="hover:text-[#B57FEC] hover:underline"
                        href={
                          auction?.status === AUCTION_STATUS.LIVE
                            ? ROUTES.BASE + auction?.auction_id
                            : ROUTES.BASE +
                              auction?.auction_id +
                              '?' +
                              AUX_STATUS +
                              '=' +
                              AUCTION_STATUS.COMPLETED
                        }
                      >
                        {auction?.title || '-'}
                      </Link>
                    </TableCell>
                    <TableCell className="text-green-400">
                      {auction?.total_bids || '-'}
                    </TableCell>
                    <TableCell className="text-red-500">
                      {auction?.total_bid_consumed || ''}
                    </TableCell>
                    <TableCell>{auction?.total_auction_bids || ''}</TableCell>
                    <TableCell>{auction?.total_player || ''}</TableCell>
                  </TableRow>
                ))
              : null}
          </Table>
          {myAuctionsLoading && myAuctionList?.length ? (
            <div className="w-full !flex justify-center items-center">
              <ButtonLoading />
            </div>
          ) : null}
          <NoRecordMessage
            show={!myAuctionsLoading && myAuctionList?.length <= 0}
          >
            {userInfo?.accessToken ? 'No Data Found' : <ButtonLoading />}
          </NoRecordMessage>
        </div>
      </div>
    </div>
  );
};

export default MyAuctionsPage;
