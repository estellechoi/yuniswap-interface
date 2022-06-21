// create typed versions of the useDispatch and useSelector hooks for usage in your application
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, AppState } from './../store'

export const useAppDispatch: () => AppDispatch = useDispatch // Adding a pre-typed useDispatch hook keeps you from forgetting to import AppDispatch where it's needed.
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector // it saves you the need to type (state: RootState) every time
