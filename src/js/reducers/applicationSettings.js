import { UPDATE_APPLICATION_SETTINGS } from '../constants/ActionTypes';

const initialState = {
  minimumYield: 5
};

export default function update(state = initialState, action) {
  switch (action.type) {
    case UPDATE_APPLICATION_SETTINGS:
      return {
        minimumYield: action.minimumYield
      };

    default:
      return state;
  }
}
