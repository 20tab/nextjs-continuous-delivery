import { Action } from 'redux'
import { configureStore, ThunkAction } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'

import reducers from '@/store/reducers'

export const store = configureStore({
  reducer: reducers
})

export type AppStore = typeof store
export type AppState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>

export const wrapper = createWrapper<AppStore>(() => store)
