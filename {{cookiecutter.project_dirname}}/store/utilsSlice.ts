import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

import { Theme } from '@/models/Utils'

interface UtilsState {
  envs: { [key: string]: string }
  theme: Theme
}

const initialState: UtilsState = { envs: {}, theme: Theme.light }

const utilsSlice = createSlice({
  name: 'utils',
  initialState,
  extraReducers: {
    [HYDRATE]: (state, action) => {
      if (
        !Object.keys(state.envs).length &&
        Object.keys(action.payload.utils.envs).length
      ) {
        state.envs = action.payload.utils.envs
      }
      if (action.payload.utils.theme) {
        state.theme = action.payload.utils.theme
      }
    }
  },
  reducers: {
    changeTheme: (state, action) => {
      state.theme = action.payload
    },
    setEnvs: (state, action) => {
      state.envs = action.payload
    }
  }
})

export const { changeTheme, setEnvs } = utilsSlice.actions

export default utilsSlice.reducer
