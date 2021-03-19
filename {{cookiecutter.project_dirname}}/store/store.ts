import { configureStore } from '@reduxjs/toolkit'
import { MakeStore, createWrapper } from 'next-redux-wrapper'

import { State } from '@/models/State'
import reducer from '@/store/reducers'

const makeStore: MakeStore<State> = () => {
  return configureStore<State>({ reducer })
}

export const wrapper = createWrapper<State>(makeStore, {
  debug: false
})
