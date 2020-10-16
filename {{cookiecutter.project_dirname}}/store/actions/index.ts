import { createAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

import { State } from '../../models/State'

export const hydrateAction = createAction<State>(HYDRATE)
