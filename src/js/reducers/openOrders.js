import { UPDATE_OPEN_ORDERS } from '../constants/ActionTypes';

const initialState = {};

export default function update(state = initialState, action) {
  switch (action.type) {
    case UPDATE_OPEN_ORDERS:
      return action.openOrders;

    default:
      return state;
  }
}
