import { useDispatch } from 'react-redux'

import { AppStore } from '@/store/'

export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = () => useDispatch<AppDispatch>()
