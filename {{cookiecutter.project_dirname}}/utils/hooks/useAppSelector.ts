import { RootStateOrAny, TypedUseSelectorHook, useSelector } from 'react-redux'

export const useAppSelector: TypedUseSelectorHook<RootStateOrAny> = useSelector
