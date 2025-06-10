'use client';

import { useDispatch, useSelector } from 'react-redux';
import auctionXLogo from '@/assets/images/aucx-logo.png';
import useQueryParam from '@/hooks/useQueryParam';
import { useEffect } from 'react';
import {
  AUCTION_STATUS,
  FIRST_TIME_LOAD_TIME,
  ROUTES,
} from '@/utils/constant/constant.helper';
import { getAuctionListByHouseAction } from '@/redux/auctions/action.auctions';
import { userState } from '@/redux/user/reducer.user';
import CustomImage from '@/components/CustomImage';
import HouseLogo from '@/components/HouseLogo';

const MiniAppComponent = () => {
  const router = useQueryParam();
  const dispatch = useDispatch();
  const { auctionHouseInfo, firstLoad } = useSelector(userState);

  const fetchAuctionGridData = () => {
    try {
      dispatch(
        getAuctionListByHouseAction(
          {
            limit: 1,
            page: 0,
            state: AUCTION_STATUS.LIVE,
            auction_house_id: auctionHouseInfo?.currentAuctionHouse?.id,
          },
          (res) => {
            setTimeout(
              () => {
                if (res?.data?.[0]?.id) {
                  router.push(ROUTES.BASE + res?.data?.[0].id);
                } else router.push(ROUTES.COMING_SOON);
              },
              firstLoad ? FIRST_TIME_LOAD_TIME : 0,
            );
          },
        ),
      );
    } catch (error) {
      console.error(error, 'fetchAuctionGridData');
    }
  };

  useEffect(() => {
    if (auctionHouseInfo?.currentAuctionHouse?.id) fetchAuctionGridData();
  }, [auctionHouseInfo?.currentAuctionHouse?.id]);

  return (
    <div className="w-full flex h-full min-h-[90vh]  items-center justify-center ">
      <HouseLogo className="w-72" />

      <div className="absolute bottom-20">
        <div className="spinner">
          <div className="spinner1"></div>
        </div>
      </div>
      <div className="absolute bottom-6">
        <CustomImage
          src={auctionXLogo}
          alt="auctionX Logo"
          className="w-[110px] h-8"
          height={500}
          width={500}
        />
      </div>
    </div>
  );
};

export default MiniAppComponent;
