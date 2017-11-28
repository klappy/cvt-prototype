import * as types from '../constants/ActionTypes';

export const updateAuthentication = (key, secret) => ({ type: types.UPDATE_AUTHENTICATION, key, secret });
