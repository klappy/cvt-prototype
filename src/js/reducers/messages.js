import { ADD_MESSAGE, REMOVE_MESSAGE, CLEAR_MESSAGES } from '../constants/ActionTypes';

const initialState = [];

export default function update(state = initialState, action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return [
        ...state,
        action.message
      ];

    case REMOVE_MESSAGE:
      state.splice(action.index, 1);
      return state;

    case CLEAR_MESSAGES:
      return initialState;

    default:
      return state;
  }
}
