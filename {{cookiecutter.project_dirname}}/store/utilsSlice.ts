import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

import { Theme } from '@/models/Utils'

const utilsSlice = createSlice({
  name: 'utils',
  initialState: { envs: {}, theme: Theme.light },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      if (
        !Object.keys(state.envs).length &&
        Object.keys(action.payload.utils.envs).length
      ) {
        state.envs = action.payload.utils.envs
      }
      if (!state.theme && action.payload.utils.theme) {
        state.theme = action.payload.utils.theme
      }
    }
  },
  reducers: {
    getEnvs: (state, action) => {
      state.envs = action.payload
    },
    changeTheme: (state, action) => {
      state.theme = action.payload
    }
  }
})

export const { getEnvs, changeTheme } = utilsSlice.actions

export default utilsSlice.reducer
