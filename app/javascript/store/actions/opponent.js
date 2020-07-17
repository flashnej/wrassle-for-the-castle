import * as actionTypes from './actionTypes';

const setOpponent = (userData) => {
  return {
    type: actionTypes.SET_OPPONENT,
    userData
  }
}

export default {
  setOpponent
}
