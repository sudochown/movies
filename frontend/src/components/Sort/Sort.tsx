import React, { FC } from 'react';
import styles from './sort.module.scss';
import {SortField} from '../../types/types';

export interface SortProps {
  sortHandler: (field: string) => void;
  directionHandler: (direction: string) => void;
  fields: SortField[];
  currentSort: string;
  currentField: string;
}

const Sort: FC<SortProps> = ({ fields , sortHandler, directionHandler, currentSort, currentField }) => {
    return (
        <div className={styles.root}>
            <p className={styles.label}>Sorting:</p>
            <select
                onChange={(event) => sortHandler(event.target.value)}
                key="fieldSortSelect"
                value={currentField}
            >
                {fields.map(field => {
                    return <option value={field.field} key={field.field}>
                        {field.field}
                    </option>;
                })}
            </select>
            <select
                onChange={(event) => directionHandler(event.target.value)}
                key="dirSortSelect"
                value={currentSort}
            >
                <option key="asc" value="asc">asc</option>
                <option key="desc" value="desc">desc</option>
            </select>
        </div>
    );
};

export default Sort;
