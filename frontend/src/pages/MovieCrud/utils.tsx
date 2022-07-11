import {
  GridActionsCellItem,
  GridColDef,
  GridFilterInputSingleSelect,
  GridFilterItem,
  GridPreProcessEditCellProps,
  GridEditCellProps
} from '@mui/x-data-grid';
import React from 'react';
import classes from './movieCrud.module.scss';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { Edit as EditSvg, DeleteOutlined as DeleteSvg, Save as SaveSvg, Close as CancelSvg } from '@mui/icons-material';
import { getMovieAttributeConfig, isFieldValueValid, ValidationRuleType } from '../../config';

export function getGridDropdownFilter(field: string, options: (string | number)[]): Required<GridColDef['filterOperators']> {
  return [{
    label: `Filter by ${field}`,
    value: 'Is',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (filterItem.value == null || filterItem.value === '' || (options.length && !options.includes(filterItem.value))) {
        return null;
      }
    
      return ({ value }): boolean => {
        if (typeof value === 'object') {
          return filterItem.value === (value as { value: string | number; label: string }).value;
        }
        return filterItem.value === value;
      };
    },
    InputComponent: GridFilterInputSingleSelect,
    InputComponentProps: { type: 'singleSelect' },
  }];
}

export function prepareGridColumns(errorProcessor: (msg: string) => void): GridColDef[] {
  const attributeConfig = getMovieAttributeConfig();
  const baseGridColumnConfig = getGridColumnRenderers();
  
  return baseGridColumnConfig.map((col) => ({
    ...(attributeConfig[col.field as keyof typeof attributeConfig] || {}),
    ...col,
    preProcessEditCellProps: (params) => {
      const { errorMessage, ...result } = preProcessEditCellProps(String(col.field || ''), params);

      if (errorMessage) {
        errorProcessor(errorMessage);
      }

      return result;
    }
  } as GridColDef));
}

export const preProcessEditCellProps = (field: string, params: GridPreProcessEditCellProps): GridEditCellProps & { errorMessage?: string} => {
  const attributeConfig = getMovieAttributeConfig();
  const { props, hasChanged = false } = params;
  const validationRules = field && attributeConfig?.[field as keyof typeof attributeConfig]?.validation_rules;
  let errors: string[] = [];

  if (hasChanged && validationRules?.length) {
    errors = isFieldValueValid(field, props.value, validationRules as ValidationRuleType[]);
  }

  return {...params.props, error: !!errors.length, errorMessage: errors.join('. ')};
};

export function getGridColumnRenderers(): Partial<GridColDef>[] {
  return [
    {
      field: 'title',
      minWidth: 150,
    },
    {
      field: 'logo',
      maxWidth: 100,
      renderCell: ({row}): React.ReactElement => (
        <div className={classes.logoWrapper}>
          <img src={row.logo} alt={row.title}/>
        </div>
      ),
    },
    {
      field: 'description',
      width: 150,
    },
    {
      field: 'rating',
      width: 150,
    },
    {
      field: 'year',
      width: 150,
      renderEditCell: ({value, api, field, id}) => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            minDate={(new Date(1940, 1))}
            maxDate={(new Date())}
            disableFuture
            views={['year']}
            label='Year only'
            value={(new Date(value, 1))}
            onChange={async (newValue) => {
              await api.setEditCellValue({id, field, value: newValue?.getFullYear() || null});
            }}
            renderInput={(params) => <TextField required {...params} helperText={null}/>}
          />
        </LocalizationProvider>
      )
    },
    {
      field: 'genres',
      width: 150,
    },
    {field: 'urlKey', width: 150},
    {field: 'cast', width: 150},
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      editable: true,
      renderCell: ({ id, api, row }) => [
        <GridActionsCellItem
          icon={<EditSvg />}
          label="Edit"
          onClick={async () => { await api.startRowEditMode({ id, fieldToFocus: 'title' }); }}
          color="inherit"
          key="edit"
        />,
        <GridActionsCellItem
          icon={<DeleteSvg />}
          label="Delete"
          onClick={async () => {
            await api.startRowEditMode({ id, deleteValue: true, fieldToFocus: 'actions'});
          }}
          color="inherit"
          key="delete"
        />,
      ],
      renderEditCell: ({ id, api }) => [
        <GridActionsCellItem
          icon={<SaveSvg />}
          label="Save"
          onClick={async () => { api.stopRowEditMode({ id }); }}
          color="primary"
          key="save"
        />,
        <GridActionsCellItem
          icon={<CancelSvg />}
          label="Cancel"
          onClick={async () => { await api.stopRowEditMode({ id, ignoreModifications: true }); }}
          color="inherit"
          key="cancel"
        />,
      ],
    },
  ];
}
