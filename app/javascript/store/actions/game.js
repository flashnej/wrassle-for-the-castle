import * as actionTypes from './actionTypes';

const setGame = (gameData) => {
  return {
    type: actionTypes.SET_GAME,
    gameData
  }
}

export default {
  setGame
}
