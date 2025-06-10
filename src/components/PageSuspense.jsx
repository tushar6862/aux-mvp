import { auctionState } from '@/redux/auctions/reducer.auctions';
import { userState } from '@/redux/user/reducer.user';
import React from 'react';
import { useSelector } from 'react-redux';
import ButtonLoading from './form-component/ButtonLoading';
import CustomCard from './cards/CustomCard';

/**
 * @description this component we create show loading
 */

const PageSuspense = ({ children }) => {
  const { getAuctionLoading } = useSelector(auctionState);
  const { auctionHouseInfo } = useSelector(userState);

  if (getAuctionLoading || !auctionHouseInfo?.currentAuctionHouse?.id)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CustomCard>
          <ButtonLoading />
        </CustomCard>
      </div>
    );
  return children;
};

export default PageSuspense;
