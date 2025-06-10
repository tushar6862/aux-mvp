// TODO: add versions in these constant file

export const API_ENDPOINT = {
  USERS: {
    TRANSFER_PLAYS: '/user/transfer/plays',
    TRANSACTION_HISTORY: 'v1/user/player-transaction',
    GET_AVATAR_LIST: 'v1/user/avatar',
    LOGIN: 'v2/user/login',
    SEND_OTP: 'v2/user/send-otp',
    LOGOUT: 'v1/user/logout',
    UPDATE_USER: 'v1/user',
    SHIPPING_INFO: '/shipping-info',
    WALLET_BALLANCE: '/v1/user/wallet/balance',
    SAVE_CUSTOM_AVTAR: '/v1/user',
  },
  AUCTION_HOUSE: {
    GET_INFO: 'v1/auction-house/auction-house-id',
    GET_AUCTION_LIST: 'v1/auction-house/auction/list',
  },
  TRANSACTION: {
    GET_AMOUNT: 'v1/transaction/plays-amount',
    CREATE_TRANSACTION: 'v1/transaction/buy-plays',
  },
  AUCTION: {
    GET_MY_AUCTION_LIST: 'v1/auction/player-auction',
    GET_MY_AUCTION: 'v1/auction/player/auction/result',
    GET_BID_LOG: 'v1/auction/logs',
  },
};
