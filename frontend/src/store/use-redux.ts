import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from './root-redux';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';

export const useAppDispatch = (): Dispatch<AnyAction> =>
    useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
