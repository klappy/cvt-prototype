import { UPDATE_ASSET_SETTINGS, SET_DEFAULT_ASSET_SETTINGS } from '../constants/ActionTypes';

const initialState = {
  default: {
    target: 0.005,
    minimumYield: 2.1
  }
};

export default function update(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ASSET_SETTINGS:
      return {
        ...state,
        [action.assetCode]: {
          target: action.target,
          minimumYield: action.minimumYield
        }
      };

    case SET_DEFAULT_ASSET_SETTINGS:
      return {
        ...state,
        [action.assetCode]: initialState.default
      };

    default:
      if (!state.default.minimumYield) {
        return initialState;
      } else {
        return state;
      }
  }
}
