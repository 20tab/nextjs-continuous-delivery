import { createSlice } from '@reduxjs/toolkit'

import { Theme } from '@/models/Utils'

interface UtilsState {
  theme: Theme
}

const initialState: UtilsState = { theme: Theme.light }

const utilsSlice = createSlice({
  name: 'utils',
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      state.theme = action.payload
    }
  }
})

export const { changeTheme } = utilsSlice.actions

export default utilsSlice.reducer
