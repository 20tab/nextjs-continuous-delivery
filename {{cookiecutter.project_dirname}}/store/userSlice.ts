import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      if (!state.user && action.payload.session.user) {
        state.user = action.payload.session.user
      }
    }
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload
    },
    logout: state => {
      state.user = null
    }
  }
})

export const { login, logout } = userSlice.actions

export default userSlice.reducer
