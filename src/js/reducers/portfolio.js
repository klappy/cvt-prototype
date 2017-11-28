import { UPDATE_PORTFOLIO } from '../constants/ActionTypes';

const initialState = {};

export default function update(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PORTFOLIO:
      return action.portfolio;

    default:
      return state;
  }
}
