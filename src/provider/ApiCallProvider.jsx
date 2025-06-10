'use client';

import { getAuctionHouseInfoAction } from '@/redux/user/action.user';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { setIsSocketConnected } from '@/redux/socket/action.socket';

// TODO move this method to utils methods
const getHostName = (host) => {
  if (host) return host;
  else if (typeof window !== 'undefined') return window.location.host;
};

export const hostname = getHostName(process.env.NEXT_PUBLIC_SUBDOMAIN);

/**
 * @description this provider is for api call
 *  -when app loads then required api calls are shoe call here
 * */
export const ApiCallProvider = ({ children }) => {
  const dispatch = useDispatch();

  const socketEmit = useCallback((res) => {
    if (res?.success) {
      dispatch(setIsSocketConnected(true));
    }
  }, []);

  useEffect(() => {
    dispatch(
      getAuctionHouseInfoAction({
        subdomain: hostname,
      }),
    );
  }, []);

  return children;
};
