import * as actionTypes from './actionTypes';

const setCurrentUser = (userData) => {
  return {
    type: actionTypes.SET_CURRENT_USER,
    userData
  }
}

const sendSoldiers = (soldierCount) => {
  return {
    type: actionTypes.SEND_SOLDIERS,
    soldierCount
  }
}

const makeReadyForBattle = () => {
  return {
    type: actionTypes.MAKE_READY_FOR_BATTLE
  }
}

// const makeReadyForNextTurn = () => {
//   return {
//     type: actionTypes.MAKE_READY_FOR_NEXT_TURN
//   }
// }

const resetReady = () => {
  return {
    type: actionTypes.RESET_READY
  }
}

export default {
  setCurrentUser,
  sendSoldiers,
  makeReadyForBattle,
  // makeReadyForNextTurn,
  resetReady
}
