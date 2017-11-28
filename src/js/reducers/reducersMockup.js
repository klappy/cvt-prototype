export let AssetsReducer = {

};

export let AuthenticationReducer = {
  authentications: {
    poloniex: {
      key: '',
      secret: ''
    }
  }
};

export let BalancesReducer = {
  balances: {
    BTC: 0.0,
    ETH: 0.0,
    XMR: 0.0,
    LTC: 0.0,
    XRP: 0.0,
    '...': 0.0
  }
};

export let SettingsReducer = {
  settings: {
    USDT_BTC:{},
    BTC_ETH:{},
    BTC_XMR:{},
    BTC_LTC:{},
    BTC_XRP:{},
    'BTC_...': {},
    'ETH_...': {},
    '..._...': {}
  }
};

export let TickerReducer = {
  ticker: {
    USDT_BTC: {},
    BTC_ETH: {},
    BTC_XMR: {},
    BTC_LTC: {},
    BTC_XRP: {},
    'BTC_...': {},
    'ETH_...': {},
    '..._...': {}
  }
};

export let OrdersReducer = {
  orders: {
    pending: {
      USDT_BTC: [],
      BTC_ETH: [],
      BTC_XMR: [],
      BTC_LTC: [],
      BTC_XRP: [],
      'BTC_...': [],
      'ETH_...': [],
      '..._...': []
    },
    history: {
      USDT_BTC: [],
      BTC_ETH: [],
      BTC_XMR: [],
      BTC_LTC: [],
      BTC_XRP: [],
      'BTC_...': [],
      'ETH_...': [],
      '..._...': []
    }
  }
};

export let PairsReducer = {
  ticker: {
    USDT_BTC: {},
    BTC_ETH: {},
    BTC_XMR: {},
    BTC_LTC: {},
    BTC_XRP: {},
    'BTC_...': {},
    'ETH_...': {},
    '..._...': {}
  }
};
