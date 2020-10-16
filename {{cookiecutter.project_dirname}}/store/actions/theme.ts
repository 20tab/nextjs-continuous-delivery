import { createAction } from '@reduxjs/toolkit'

import { Theme } from '../../models/Theme'

export const changeTheme = createAction<Theme>('CHANGE_THEME')
export const setUserName = createAction<{ id: number, name: string }>('SET_USER_NAME')
