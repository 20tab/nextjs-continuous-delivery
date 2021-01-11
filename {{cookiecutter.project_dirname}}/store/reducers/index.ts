import { combineReducers } from 'redux'

import { iState } from '../../models/State'
import theme from './theme'

const reducers = combineReducers<iState>({
  theme
})

export default reducers
