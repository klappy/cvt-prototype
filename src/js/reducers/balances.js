import { UPDATE_BALANCES } from '../constants/ActionTypes';

const initialState = {};

export default function update(state = initialState, action) {
  switch (action.type) {
    case UPDATE_BALANCES:
      return action.balances;

    default:
      return state;
  }
}
