import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import MovieCard from '../../components/MovieCard';
import styles from './movies.module.scss';
import { useAppDispatch, useAppSelector } from '../../store/use-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { initToolbar, loadMovies, SLICE_MOVIES_NAME } from '../../store/movies/reducer';
import Filter, { MoviesFilterProps } from '../../components/Filter';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Sort from '../../components/Sort';
import classNames from 'classnames';
import { ButtonVariant } from '../../components/Button/Button';
import { MovieType, PaginationUrlParams, SortDirection, SortUrlParams } from '../../types/types';
import uniqBy from 'lodash/uniqBy';

const Movies = () => {
    const { movies, availableFilters, availableSortFields, total, loading }
    = useAppSelector((state) => state[SLICE_MOVIES_NAME]);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { pathname, search } = useLocation();
  
    const [showSidebar, setShowSidebar] = useState<boolean>(false);
    const [showClearFilters, setShowClearFilters] = useState<boolean>(false);
    const [items, setItems] = useState<MovieType[]>([]);
  
    const urlParams = useMemo(() => new URLSearchParams(search), [search]);
  
    useLayoutEffect(() => {
        dispatch(initToolbar());
    }, [dispatch]);
    
    useEffect(() => setItems([]), [total]);
  
    useEffect(() => {
        setItems((i) => uniqBy([...i, ...movies], '_id'));
    }, [movies]);

    useEffect(() => {
        let isFilterApplied = false;
        availableFilters.forEach(({ field }) => { isFilterApplied = !!urlParams.get(field) ||  isFilterApplied; });
        setShowClearFilters(isFilterApplied);
    }, [availableFilters, urlParams]);
  
    useEffect(() => {
        if (!urlParams.get(SortUrlParams.field)) {
            const currentSortField = availableSortFields.find(item => item.isDefault)?.field || '';
            urlParams.set(SortUrlParams.field, currentSortField);
            urlParams.set(SortUrlParams.dir, SortDirection.ASC);
        }
    
    }, [availableSortFields, urlParams]);
  
    useEffect(() => {
        dispatch(loadMovies({ pathname, urlParams }));
    }, [dispatch, pathname, urlParams]);
  
    const applyFilterHandler = useCallback<Required<MoviesFilterProps>['applyFilter']>((field, appliedValues) => {
        urlParams.set(field, appliedValues.join(','));
    
        if (appliedValues.length === 0) {
            urlParams.delete(field);
        }
    
        navigate({ pathname, search: urlParams.toString() }, { replace: true });
    }, [navigate, pathname, urlParams]);
  
    const sortHandler = useCallback((value: string) => {
        urlParams.set(SortUrlParams.field, value);
        navigate({pathname, search: urlParams.toString()}, { replace: true });
    }, [navigate, pathname, urlParams]);
  
    const directionHandler = useCallback((value: string) => {
        urlParams.set(SortUrlParams.dir, value);
        navigate({pathname, search: urlParams.toString()}, {replace: true});
    }, [navigate, pathname, urlParams]);
  
    const clearFiltersHandler = useCallback(() => {
        availableFilters.forEach(f => urlParams.delete(f.field));
        navigate({ pathname, search: urlParams.toString()}, { replace: true });
    }, [navigate, pathname, urlParams, availableFilters]);
  
    const loadNextPage = useCallback(() => {
        const currentPage = Number(urlParams.get(PaginationUrlParams.page) || 1);
        
        if (loading || currentPage * 10 >= Number(total)) {
            return;
        }

        const newParams = new URLSearchParams(urlParams);
        newParams.set(PaginationUrlParams.page, `${currentPage + 1}`);
        newParams.set(PaginationUrlParams.pageSize, '10');
        dispatch(loadMovies({ pathname, urlParams: newParams }));
    }, [navigate, pathname, urlParams, loading, total]);

    return (
        <div className={styles.root}>
            <div className={classNames(styles.filterContainer, { [styles.sidebarClosed]: !showSidebar })}>
                {showSidebar ?
                    <>
                        <div className={styles.close} onClick={() => setShowSidebar(false)}>
                            <span>X</span>
                        </div>
                        {availableFilters.map(filter => <Filter
                            key={filter.field}
                            field={filter.field}
                            applyFilter={applyFilterHandler}
                            appliedValues={urlParams.get(filter.field)?.split(',') || []}
                            values={filter.value?.length ? filter.value : []}
                        />)}
  
                        { showClearFilters && <div style={{ margin: '20px' }}>
                            <Button
                                onClick={clearFiltersHandler}
                                text="Clear Filters"
                                variant={ButtonVariant.primary}
                            />
                        </div>}
                    </>
                    : <div className={styles.open} onClick={() => setShowSidebar(true)}>
                        <span>&#x0003E;</span>
                    </div>
                }
            </div>
            <div id="scrollableDiv" className={styles.rightColumn}>
                <Sort
                    fields={availableSortFields || []}
                    sortHandler={sortHandler}
                    directionHandler={directionHandler}
                    currentField={urlParams.get('sort_field') || ''}
                    currentSort={urlParams.get('sort_dir') || ''}
                />
                <InfiniteScroll
                    dataLength={items?.length}
                    next={loadNextPage}
                    hasMore={items.length < Number(total)}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{textAlign: 'center'}}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                    hasChildren={true}
                    height={900}
                >
                    <div className={styles.moviesListBlock}>
                        {items?.map((movie) => (
                            <MovieCard key={movie._id} {...movie} />
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default Movies;
