import { UPDATE_TRADE_HISTORIES } from '../constants/ActionTypes';

const initialState = {};

export default function update(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TRADE_HISTORIES:
      return action.tradeHistories;

    default:
      return state;
  }
}
