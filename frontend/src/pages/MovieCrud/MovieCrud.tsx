import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import classes from './movieCrud.module.scss';
import { useAppDispatch, useAppSelector } from '../../store/use-redux';
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRowModes,
} from '@mui/x-data-grid';
import { MovieType } from '../../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { MovieCRUDActions, PaginationUrlParams } from '../../types/types';
import {
  EmptyMovie,
  loadItems,
  setError,
  setItems,
  SLICE_CRUD_NAME,
  triggerMovieAction
} from '../../store/crud/reducer';
import { GridFilterModel } from '@mui/x-data-grid/models/gridFilterModel';
import { GridFilterItem } from '@mui/x-data-grid/models/gridFilterItem';
import EditToolbar from './components/EditToolbar/EditToolbar';
import { prepareGridColumns } from './utils';
import { getApiConfig, getFilterFields } from '../../config';
import { DataGridProps } from '@mui/x-data-grid/models/props/DataGridProps';
import { GridRowEditStartParams } from '@mui/x-data-grid/models/params/gridRowParams';
import { MuiEvent } from '@mui/x-data-grid/models/muiEvent';
import { Alert, Snackbar } from '@mui/material';

const MovieCrud: FC = () => {
  const { pathname, search } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const state = useAppSelector((store) => store[SLICE_CRUD_NAME]);

  const query = useMemo(() => new URLSearchParams(search), [search]);
  const rows = useMemo<GridRowModel<MovieType>[]>(() => state.items.map(({
    _id,
    ...rest
  }) => ({ id: _id, _id, ...rest })), [state.items]);
  
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: getFilterFields().map((columnField) => {
      if (query.get(columnField)) {
        return {columnField, operatorValue: 'Is', value: query.get(columnField)};
      }
      
      return undefined;
    }).filter(Boolean) as GridFilterItem[]
  });

  // handler to add new movie
  const processError = useCallback<(error: string) => void>((error) => dispatch(setError(error)), []);
  
  const columns = useMemo<GridColDef[]>(() => prepareGridColumns(processError), [processError]);

  const onPageChangeHandler = useCallback<(pageNum: number) => void>((pageNum) => {
    query.set(PaginationUrlParams.page, `${pageNum + 1}`);
    navigate({ pathname, search: query.toString() }, { replace: true });
  }, [pathname, query]);

  const onFilterChange = useCallback<(filters: GridFilterModel) => void>((filters) => {
    filters?.items?.forEach(({ columnField, value }) => {
      if (!value) {
        setFilterModel({ items: [{ columnField, operatorValue: 'Is', value: undefined }] });
      }

      if (value && value !== query.get(columnField)) {
        getFilterFields().forEach((f) => query.delete(f));
        query.set(columnField, String(value));
        navigate({pathname, search: query.toString()}, { replace: true });
      }
    });
  }, [query]);

  // dispatch action to perform api request with item update
  const processRowUpdate = useCallback<Required<DataGridProps>['processRowUpdate']>(async (row)=> {
    const { id, ...payload } = row;
    let action = id ? MovieCRUDActions.update : MovieCRUDActions.create;

    if (!Object.keys(payload).length) {
      action = MovieCRUDActions.delete;
    }

    const reloadListParams = { pathname: getApiConfig().controller, query };

    dispatch(triggerMovieAction({
      payload: action === MovieCRUDActions.delete ? { _id: id } : payload,
      action,
      reloadListParams
    }));

    return row;
  }, [query]);

  // prevent default event to access edit mode
  const preventEditMode = useCallback<Required<DataGridProps>['onRowEditStart'] | Required<DataGridProps>['onRowEditStop']>(
    async (params: GridRowEditStartParams, e: MuiEvent) => {
      if (params?.reason) {
        e.defaultMuiPrevented = true;
      }
    }, []);

  // handler to add new movie
  const addNewMovie = useCallback<() => void>(() => {
    dispatch(setItems({
      items: [...state.items, EmptyMovie],
      aggregation: state.aggregation,
      total: Number(state.total)
    }));
  }, []);

  const onRowModeChange = useCallback<Required<DataGridProps>['onRowModesModelChange']>((params) => {
    Object.keys(params).forEach((id) => {
      const row = { id, field: '', ...params[id] };
      if (row.mode == GridRowModes.Edit && row.deleteValue && row.fieldToFocus === 'actions') {
        processRowUpdate({ id }, { id });
      }
    });
  }, []);

  // reload movies list when url is changing
  useEffect(() => {
    dispatch(loadItems({ pathname: getApiConfig().controller, query }));
  }, [dispatch, pathname, query]);

  return (
    <div className={classes.pageContainer}>
      <div>
        {!!state.error && (
          <Snackbar open onClose={() => processError('')} className={classes.messageContainer}>
            <Alert onClose={() => processError('')} severity="error" className={classes.alert}>
              { state.error }
            </Alert>
          </Snackbar>
        )}
      </div>
      <div className={classes.gridWrapper}>
        <DataGrid
          filterModel={filterModel}
          editMode='row'
          paginationMode='server'
          page={(Number(query.get(PaginationUrlParams.page)) || 1) - 1}
          onPageChange={onPageChangeHandler}
          experimentalFeatures={{ newEditingApi: true }}
          rows={rows}
          columns={columns}
          components={{ Toolbar: EditToolbar }}
          componentsProps={{ toolbar: { addNewRowHandler: addNewMovie } }}
          disableSelectionOnClick
          pageSize={10}
          rowsPerPageOptions={[10]}
          pagination
          rowCount={state.total || 0}
          rowHeight={150}
          filterMode='server'
          onFilterModelChange={onFilterChange}
          processRowUpdate={processRowUpdate}
          onRowEditStart={preventEditMode}
          onRowEditStop={preventEditMode}
          onRowModesModelChange={onRowModeChange}
        />
      </div>
    </div>
  );
};

export default MovieCrud;

