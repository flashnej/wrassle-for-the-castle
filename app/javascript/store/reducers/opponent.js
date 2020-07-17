import * as actionTypes from '../actions/actionTypes';

const defaultUserState = {
  id: null,
  castle_points: null,
  screen_id: null,
  soldiers_remaining: null,
  sent_soldiers: null,
  ready_for_battle: 0,
}

const reducer = (state = defaultUserState, action) => {
  switch(action.type) {
    case(actionTypes.SET_OPPONENT):
      return {
        ...state,
        ...action.userData
      }
    default:
      return state
  }
}

export default reducer
