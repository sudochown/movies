import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MovieType } from '../../types';
import { SortDirection, MovieCRUDActions } from '../../types/types';
import { GridRowModesModel } from '@mui/x-data-grid';

export const EmptyMovie = {
  urlKey: '',
  cast: '',
  description: '',
  genres: [],
  logo: '',
  rating: 0,
  title: '',
  year: '',
  _id: '',
};

export const SLICE_CRUD_NAME = 'crud';

export interface CrudStateType {
  error: null | string;
  limit: number;
  loading: boolean;
  items: MovieType[];
  page: number;
  sortDirection: SortDirection;
  sortField?: keyof MovieType;
  total: number | null;
  aggregation: Aggregation | null;
  gridRowModesModel: GridRowModesModel;
}

export interface FetchPayload {
  pathname: string;
  query: URLSearchParams;
}

export interface Aggregation {
  [field: string]: (string | number)[]
}

export interface ItemsPayload {
  items: MovieType[];
  total: number;
  aggregation: Aggregation | null;
}

export interface TriggerMovieActionPayload {
  payload?: MovieType;
  action?: MovieCRUDActions;
  reloadListParams?: FetchPayload
}

const initialState: CrudStateType = {
  error: null,
  limit: 10,
  loading: false,
  items: [],
  page: 1,
  sortDirection: SortDirection.ASC,
  sortField: undefined,
  aggregation: null,
  total: null,
  gridRowModesModel: {},
};

export const reducer = createSlice({
  name: SLICE_CRUD_NAME,
  initialState,
  reducers: {
    reset: () => initialState,
    setItems: (state, action: PayloadAction<ItemsPayload>) => {
      state.items = action.payload?.items || [];
      state.total = action.payload?.total || null;
      state.aggregation = action.payload?.aggregation || null;
    },
    loadItems: (state, action: PayloadAction<FetchPayload>) => {
      const {query} = action.payload;
      
      state.limit = Number(query.get('limit') || 6);
      state.page = Number(query.get('page') || 6);
      state.sortDirection = query.get('sort_dir') as SortDirection;
      state.sortField = query.get('sort_field') as keyof MovieType;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    triggerMovieAction: (state, action: PayloadAction<TriggerMovieActionPayload>) => {
      const { action: actionType } = action.payload;
  
      if (actionType) {
        state.loading = true;
      }
    }
  },
});

export const {
  setItems,
  setError,
  setLoading,
  loadItems,
  reset,
  triggerMovieAction
} = reducer.actions;

export default reducer.reducer;
