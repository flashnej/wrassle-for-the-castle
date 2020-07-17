import * as actionTypes from '../actions/actionTypes';

const defaultTurnState = {
  currentPage: "titleScreen",
  gameScreenPage: "troopDeployForm",
  updateMessage: "",
  nextStep: ""
}

const reducer = (state = defaultTurnState, action) => {
  switch(action.type) {
    case(actionTypes.SET_CURRENT_PAGE):
      return {
        ...state,
        currentPage: action.page
      }
    case(actionTypes.SET_GAME_SCREEN_PAGE):
      return {
        ...state,
        gameScreenPage: action.page
      }
    case(actionTypes.SET_UPDATE_MESSAGE):
      return {
        ...state,
        updateMessage: action.message
      }
    case(actionTypes.SET_NEXT_STEP):
      return {
        ...state,
        nextStep: action.step
      }
    default:
      return state
  }
}

export default reducer
