import { combineReducers } from 'redux'

import game from './game'
import currentUser from './currentUser'
import opponent from './opponent'
import turnCycle from './turnCycle'

const rootReducer = combineReducers({
  game,
  currentUser,
  opponent,
  turnCycle
})

export default rootReducer
