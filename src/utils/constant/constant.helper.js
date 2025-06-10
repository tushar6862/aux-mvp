export const AUCTION_STATUS = {
  LIVE: 'live',
  UPCOMING: 'upcoming',
  COMPLETED: 'completed',
};

export const AUCTION_TYPES = {
  MIN: 'MIN',
  MAX: 'MAX',
  TLP: 'TLP',
};

export const PLAYER_STATUS = {
  WON: 'won',
  LOST: 'lost',
};

export const AUCTION_GROUP = Object.freeze({
  HIGHEST: 'highest',
  LOWEST: 'lowest',
});

export const WAGMI_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
};

export const YOUTUBE_EMBEDDED = {
  HOW_TO: {
    TITLE:
      'How to Participate and Win in a Highest Unique Bid Auction | AuctionX Tutorial',
    SRC: 'https://www.youtube.com/embed/uG8eWGQFwTI',
  },
};

export const TOOLTIP_MESSAGES = {
  MIN_ARROW: 'Your bid is lowest but not unique',
  MAX_ARROW: 'Your bid is highest but not unique',
};

export const LOGIN_METHOD_TYPES = {
  PHONE_NUMBER: 'PHONE_NUMBER',
  EMAIL: 'EMAIL',
  METAMASK: 'METAMASK',
  TELEGRAM: 'TELEGRAM',
};

export const FOOTER_MODAL_TYPES = {
  MY_BIDS: 'my-bids',
  REDEEM: 'redeem',
  HOW_TO: 'howTo',
};

export const METADATA = {
  APP_NAME: 'AuctionX',
  APP_DESCRIPTION:
    'AuctionX - is a decentralized blockchain-based platform that churns out amazing deals (AuctionX) to its community members via auctioning and other engagement models. Each engagement has elements of luck, skill, gamification and is amazing fun. BiG Deal has a unique ZERO LOSS model ensuring the best returns for its community.',
};

export const ROUTES = {
  BASE: '/',
  PROFILE: '/profile',
  MY_AUCTIONS: '/my-auctions',
  PLAY_HISTORY: '/plays-history',
  COMING_SOON: '/coming-soon',
};

export const NOT_APPLICABLE = 'N/A';

export const CURRENCY_SYMBOLS = {
  RUPEES_SYMBOL: '₹',
  DOLLAR_SIGN: '$',
  DEFAULT: '',
};

export const AUX_STATUS = 'auxstatus';

export const SORT_FIELDS_NAME = {
  CREATED_AT: 'created_at',
  BID_PRICE: 'bid_price',
};
export const SORT_ORDER = {
  ASCENDING: 'asc',
  DESCENDING: 'desc',
};

export const sortInitialValue = { field: null, order: null };

export const SOCKET_EVENTS = {
  ON: {
    MIN_MAX_BID_PERCENTAGE: 'min:max:bid:percentage',
    AUCTION_MIN_MAX_PERCENTAGE: 'auction:min:max:percentage',
    PLAYER_INFO_MIN_MAX: 'player:info:min:max',
    AUCTION_RESULT_READY: 'auction:result:ready',
    AUCTION_WINNER: 'auction:winner',
    AUCTION_CURRENT_PLAY: 'auction:current:play',
    AUCTION_AVATARS: 'auction:avatars',
    PLAYER_PLAY_CREDIT: 'player:plays:credit',
    AUCTION_STATE: 'auction:state',
    PLAYER_IN_WINNING: 'player:in:winning',
    AUCTION_ERROR: 'auction:error',
    AUCTION_HOUSE_LOGO_UPDATE: 'auction:house:logo:updated',
    PRODUCT_MEDIA_UPDATE: 'product:media:updated',
  },
  EMIT: {
    PERCENTAGE_MIN_MAX: 'percentage:min:max',
    MIN_MAX_PLAYER_LOG: 'min:max:player:logs',
    MIN_MAX_AUCTION: 'min:max:auction',
  },
};

export const AUCTION_CATEGORY_KEYS = {
  IS_LOWEST: 'is_lowest',
  IS_HIGHEST: 'is_highest',
};

export const TOAST_TYPE = Object.freeze({
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warn',
});

export const TOAST_CONFIG = Object.freeze({
  POSITION: {
    TOP_CENTER: 'top-center',
    TOP_LEFT: 'top-left',
    TOP_RIGHT: 'top-right',
    BOTTOM_CENTER: 'bottom-center',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_LEFT: 'bottom-left',
  },
});

export const TIME_FORMAT = {
  IST: 'IST',
};

export const FIRST_TIME_LOAD_TIME = 5000;
export const LOW_WALLET_BALANCE = {
  RED: {
    threshold: 10, // Balance below this value
    color: 'wallet-red', // Red color
  },
  YELLOW: {
    threshold: 50, // Balance below this but above RED
    color: 'wallet-yellow', // Yellow color
  },
  GREEN: {
    threshold: 500, // Balance above this value
    color: '', // Green color
  },
};

export const COOKIE_STORAGE = { USER: 'user' };

export const DYNAMIC_IMAGE_UNOPTIMISED = false;
