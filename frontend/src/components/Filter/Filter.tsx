import React, { FC } from 'react';
import styles from './moviesFilter.module.scss';

export interface MoviesFilterProps {
  applyFilter?: (field: string, appliedValues: string[]) => void;  // @TODO in parent component create function that JUST CHANGING URL PARAMS [field]=value1,valueX
  appliedValues: string[];
  field: string;
  values: (string | number)[];
}

const Filter: FC<MoviesFilterProps> = ({ applyFilter, appliedValues, field, values }) => {
    if (!values.length) {
        return null;
    }

    return (
        <div className={styles.filters}>
            <p className={styles.filterItemTitle}>
                { field.replace('_', ' ').toUpperCase() }
            </p>
            <div className={styles.filtersOptions}>
                {values.map((value) => (
                    value && <div key={value}>
                        <input
                            type="checkbox"
                            id={value?.toString().replace(' ', '')}
                            name={value?.toString()}
                            checked={!!value && !!appliedValues?.includes(value.toString())}
                            onChange={(e) => applyFilter?.(
                                field,
                                [...appliedValues.filter(v => v !== value), value && e.target.checked ? value.toString() : ''].filter(String)
                            )}
                        />
                        <label htmlFor={value?.toString().replace(' ', '')}>{value}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Filter;
