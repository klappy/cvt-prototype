import { UPDATE_AUTHENTICATION } from '../constants/ActionTypes';

const initialState = {
  key: '',
  secret: ''
};

export default function update(state = initialState, action) {
  switch (action.type) {
    case UPDATE_AUTHENTICATION:
      return {
        key: action.key,
        secret: action.secret
      };

    default:
      return state;
  }
}
