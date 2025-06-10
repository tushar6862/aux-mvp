'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import { ApiCallProvider } from './ApiCallProvider';
import WagmiProviders from './WagmiProviders';
import SocketProvider from './SocketProvider';
import BuyPlaysModal from '@/components/modal/BuyPlaysModal';
import LoginModal from '@/components/modal/LoginModal/LoginModal';
import NameModal from '@/components/modal/NameModal';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import FooterMenuBar from '@/components/FooterMenuBar';
import HamburgerSideMenu from '@/components/modal/hamburger-sidemenu/HamburgerSideMenu';
import { ToastContainer } from 'react-toastify';
import { ROUTES } from '@/utils/constant/constant.helper';
import { Toaster } from 'react-hot-toast';

const Providers = ({ children }) => {
  const pathName = usePathname();

  return (
    <WagmiProviders>
      <Provider store={store}>
        <ApiCallProvider>
          <SocketProvider>
            <>
              <div className="text-white relative font-inter">
                <div className="contArea">
                  {pathName === ROUTES.BASE ? (
                    children
                  ) : (
                    <>
                      <Header />
                      {children}
                      <FooterMenuBar />
                    </>
                  )}
                </div>
                <HamburgerSideMenu />
              </div>
              <ToastContainer />
              {/* //TODO if we not use react hot toast so remove package and remove this commented code */}
              <Toaster
                toastOptions={{
                  style: {
                    zIndex: '100000',
                  },
                }}
                containerStyle={{
                  top: 350,
                }}
              />
              <BuyPlaysModal />
              <LoginModal />
              <NameModal />
            </>
          </SocketProvider>
        </ApiCallProvider>
      </Provider>
    </WagmiProviders>
  );
};
export default Providers;
