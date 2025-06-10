'use client';
import useQueryParam from '@/hooks/useQueryParam';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BidHistoryTable from './BidHistoryTable';
import SpendHistoryTable from './SpendHistoryTable';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionHistoryAction } from '@/redux/playsTransfer/action.playsTransfer';
import { ROUTES } from '@/utils/constant/constant.helper';
import useInfintieScroll from '@/hooks/useInfintieScroll';
import { playsTransferState } from '@/redux/playsTransfer/reducer.playsTransfer';
import { userState } from '@/redux/user/reducer.user';

const TAB_NAME = {
  BID_HISTORY: 'credit',
  SPEND_HISTORY: 'debit',
};

const PLaysHistoryPage = () => {
  const searchParam = useSearchParams();
  const router = useQueryParam();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const { userInfo } = useSelector(userState);
  const { transactionHistoryLoader, metaData } =
    useSelector(playsTransferState);

  const setActiveTab = (tabName) => {
    router.push(ROUTES.PLAY_HISTORY, {
      query: { activeTab: tabName },
    });
  };

  const fetchTransactionHistory = () => {
    dispatch(
      getTransactionHistoryAction(
        userInfo?.id,
        {
          limit: 30,
          page: currentPage,
          entryType: searchParam.get('activeTab'),
        },
        (res) => {
          res?.success && setCurrentPage(res?.metadata?.page + 1);
        },
      ),
    );
  };

  const { cardRef, moveToTop } = useInfintieScroll(
    metaData?.totalPage,
    currentPage,
    fetchTransactionHistory,
    userInfo?.accessToken && !transactionHistoryLoader,
  );

  useEffect(() => {
    if (!Object.values(TAB_NAME).includes(searchParam.get('activeTab'))) {
      setActiveTab(TAB_NAME.BID_HISTORY);
    } else {
      userInfo?.id && fetchTransactionHistory();
    }
  }, [searchParam.get('activeTab'), userInfo?.id]);

  return (
    <div className="w-full h-full ">
      <h2 className="text-center font-semibold text-3xl mt-10 mb-5">
        PLAY History
      </h2>
      <div className="w-full h-96 rounded-3xl bg-[#DFDADA17] px-2 py-4 border border-[#8F8F8F]  mb-48">
        <div className="flex justify-around items-center border-b border-[#DCDBDD]">
          <button
            disabled={searchParam.get('activeTab') === TAB_NAME.BID_HISTORY}
            className="text-lg  disabled:font-bold   disabled:text-white text-[#B57FEC] cursor-pointer disabled:cursor-default group"
            onClick={() => {
              setCurrentPage(0);
              moveToTop?.();
              setActiveTab(TAB_NAME.BID_HISTORY);
            }}
          >
            {' '}
            Buy History
            <span className=" mx-auto w-5/6 bg-white h-[3px] block group-enabled:hidden" />
          </button>
          <button
            disabled={searchParam.get('activeTab') === TAB_NAME.SPEND_HISTORY}
            className="text-lg  disabled:font-bold  disabled:text-white text-[#B57FEC] group cursor-pointer disabled:cursor-default"
            onClick={() => {
              setCurrentPage(0);
              moveToTop?.();
              setActiveTab(TAB_NAME.SPEND_HISTORY);
            }}
          >
            {' '}
            Spend History
            <span className=" mx-auto w-5/6 bg-white h-[3px] block group-enabled:hidden" />
          </button>
        </div>

        <div
          className="overflow-auto w-full h-[calc(100%-40px)] max-small-mobile:h-[calc(100%-60px)] mt-2 relative"
          ref={cardRef}
        >
          {searchParam.get('activeTab') === TAB_NAME.BID_HISTORY ? (
            <BidHistoryTable />
          ) : null}
          {searchParam.get('activeTab') === TAB_NAME.SPEND_HISTORY ? (
            <SpendHistoryTable />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PLaysHistoryPage;
