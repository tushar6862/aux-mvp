import { userState } from '@/redux/user/reducer.user';
import React from 'react';
import { useSelector } from 'react-redux';
import CustomImage from './CustomImage';
import { DYNAMIC_IMAGE_UNOPTIMISED } from '@/utils/constant/constant.helper';

const HouseLogo = ({ className }) => {
  const { auctionHouseInfo } = useSelector(userState);

  return (
    <CustomImage
      width={500}
      height={500}
      className={`${className} h-auto aspect-[4/1]`}
      alt="logo"
      path={auctionHouseInfo?.currentAuctionHouse?.medias?.local_path}
      unoptimized={DYNAMIC_IMAGE_UNOPTIMISED}
    />
  );
};

export default HouseLogo;
