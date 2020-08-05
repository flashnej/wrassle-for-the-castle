import * as actionTypes from './actionTypes';

const setCurrentPage = (page) => {
  return {
    type: actionTypes.SET_CURRENT_PAGE,
    page
  }
}

const setGameScreenPage = (page) => {
  return {
    type: actionTypes.SET_GAME_SCREEN_PAGE,
    page
  }
}

const setUpdateMessage = (message) => {
  return {
    type: actionTypes.SET_UPDATE_MESSAGE,
    message
  }
}

const setNextStep = (step) => {
  return {
    type: actionTypes.SET_NEXT_STEP,
    step
  }
}

export default {
  setCurrentPage,
  setGameScreenPage,
  setUpdateMessage,
  setNextStep
}
