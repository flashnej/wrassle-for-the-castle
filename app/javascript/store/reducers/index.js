import { combineReducers } from 'redux'

import game from './game'
import currentUser from './currentUser'
import opponent from './opponent'

const rootReducer = combineReducers({
  game,
  currentUser,
  opponent
})

export default rootReducer
