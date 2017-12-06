import { UPDATE_ASSET_SETTINGS, SET_DEFAULT_ASSET_SETTINGS } from '../constants/ActionTypes';

const initialState = {
  default: {
    target: 0.005,
    spread: 4
  }
};

export default function update(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ASSET_SETTINGS:
      return {
        ...state,
        [action.assetCode]: {
          target: action.target,
          spread: action.spread
        }
      };

    case SET_DEFAULT_ASSET_SETTINGS:
      return {
        ...state,
        [action.assetCode]: {
          target: 0.01,
          spread: 1
        }
      };

    default:
      return state;
  }
}
