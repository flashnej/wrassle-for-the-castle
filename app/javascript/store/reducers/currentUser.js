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
    case(actionTypes.SET_CURRENT_USER):
      return {
        ...state,
        ...action.userData
      }
    case(actionTypes.SEND_SOLDIERS):
      return {
        ...state,
        sent_soldiers: action.soldierCount,
        soldiers_remaining: state.soldiers_remaining - action.soldierCount
      }
    case(actionTypes.MAKE_READY_FOR_BATTLE):
      return {
        ...state,
        ready_for_battle: true
      }
    case(actionTypes.RESET_READY):
      return {
        ...state,
        ready_for_battle: false
      }
    default:
      return state
  }
}

export default reducer
