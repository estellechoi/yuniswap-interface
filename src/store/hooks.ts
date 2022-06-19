import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from './../store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = useSelector as TypedUseSelectorHook<AppState>
