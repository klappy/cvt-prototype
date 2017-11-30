import { UPDATE_TICKERS } from '../constants/ActionTypes';

const initialState = {};

export default function update(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TICKERS:
      return action.tickers;

    default:
      return state;
  }
}
