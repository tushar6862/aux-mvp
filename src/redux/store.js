import { configureStore } from '@reduxjs/toolkit';
import { shippingReducer } from './shipping/reducer.shipping';
import { playsTransferReducer } from './playsTransfer/reducer.playsTransfer';
import { userReducer } from './user/reducer.user';
import { modalReducer } from './modal/reducer.modal';
import { auctionReducer } from './auctions/reducer.auctions';
import { socketReducer } from './socket/reducer.socket';
import { transactionReducer } from './transcation/reducer.transaction';

const store = configureStore({
  reducer: {
    shipping: shippingReducer,
    playsTransfer: playsTransferReducer,
    user: userReducer,
    modal: modalReducer,
    auction: auctionReducer,
    socket: socketReducer,
    transaction: transactionReducer,
  },
});
export default store;
