import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

import { Theme } from '@/models/Theme'
import { State } from '@/models/State'

const themeSlice = createSlice({
  name: 'theme',
  initialState: { theme: Theme.light },
  extraReducers: {
    [HYDRATE]: (state, action: PayloadAction<State>) => {
      state.theme = action.payload.ui.theme
    }
  },
  reducers: {
    changeTheme: (state, action) => {
      state.theme = action.payload
    }
  }
})

export const { changeTheme } = themeSlice.actions

export default themeSlice.reducer
