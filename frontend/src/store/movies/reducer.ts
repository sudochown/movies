import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MovieType } from '../../types';
import { FilterItem, SortDirection, SortField } from '../../types/types';

export const SLICE_MOVIES_NAME = 'movies';

export interface MoviesStateType {
  availableFilters: FilterItem[];
  availableSortFields: SortField[];
  error: null | string;
  filters: FilterItem[];
  limit: number;
  loading: boolean;
  movies: MovieType[];
  page: number;
  sortDirection: SortDirection;
  sortField?: keyof MovieType;
  total: number | null;
}

export interface FetchMoviesPayload {
  pathname: string;
  urlParams: URLSearchParams;
}

export interface InitToolbarPayload {
  availableFilters?: FilterItem[];
  availableSortFields?: SortField[];
}

const initialState: MoviesStateType = {
    availableFilters: [],
    availableSortFields: [],
    error: null,
    filters: [],
    limit: 10,
    loading: false,
    movies: [],
    page: 1,
    sortDirection: SortDirection.ASC,
    sortField: undefined,
    total: null,
};

export const reducer = createSlice({
    name: SLICE_MOVIES_NAME,
    initialState,
    reducers: {
        reset: () => initialState,
        setMovies: (state, action: PayloadAction<{ items: MovieType[]; total: number; }>) => {
            state.movies = action.payload?.items || [];
            state.total = action.payload?.total || null;
        },
        initToolbar: (state) => state,
        setToolbar: (state, action: PayloadAction<InitToolbarPayload>) => {
            state.availableFilters = action.payload.availableFilters || [];
            state.availableSortFields = action.payload.availableSortFields || [];
        },
        loadMovies: (state, action: PayloadAction<FetchMoviesPayload>) => {
            const { urlParams } = action.payload;

            state.filters = state.availableFilters.map<FilterItem>(({ field }) => {
                return { field, value: (urlParams.get(field) || '').split(',') };
            }).filter(i => !!i?.value?.length);

            state.limit = Number(urlParams.get('limit') || 6);
            state.page = Number(urlParams.get('page') || 6);
            state.sortDirection = urlParams.get('sort_dir') as SortDirection;
            state.sortField = urlParams.get('sort_field') as keyof MovieType;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const {
    initToolbar,
    setMovies,
    setError,
    setLoading,
    setToolbar,
    loadMovies,
    reset,
} = reducer.actions;

export default reducer.reducer;
