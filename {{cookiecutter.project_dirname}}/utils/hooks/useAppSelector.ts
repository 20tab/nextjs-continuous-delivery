import { TypedUseSelectorHook, useSelector } from 'react-redux'

import { AppState } from '@/store/store'

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
