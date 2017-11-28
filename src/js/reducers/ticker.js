import { UPDATE_TICKER } from '../constants/ActionTypes';

const initialState = {};

export default function update(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TICKER:
      return action.ticker;

    default:
      return state;
  }
}
