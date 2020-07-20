import * as actionTypes from '../actions/actionTypes';

const defaultGameState = {
  id: null,
  passcode: null,
  current_castle: null,
  advance_to_results: null,
  advance_to_castle: null,
  guest_id: null
}

const reducer = (state = defaultGameState, action) => {
  switch(action.type) {
    case(actionTypes.SET_GAME):
      return {
        ...state,
        ...action.gameData
      }
    default:
      return state
  }
}

export default reducer
