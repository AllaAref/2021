import fetcher from './Fetcher';

import { createSlice } from '@reduxjs/toolkit';
import { schema, normalize, denormalize } from 'normalizr';

// createListSlice creates slice for Redux store with given `options`.
export const createListSlice =(options) => {

    const createEntity = options.createEntity || (
        (options) => new schema.Entity(options.entityName));
    const item = createEntity(options);
    
    const sliceName = options.sliceName;
    const entityName = options.entityName;
    const dataToEntity = options.dataToEntity;
    const reducerOptions = {
        name: sliceName,
        initialState: {
            ...normalize([], [item]),
            pages: {},
            pagination: { 
                page: 1,
                totalPages: 0,
                limit: options.pageLimit || 25
            }
        },
        reducers: {
            loadData: (state, action) => {
                const data = action.payload.data.map(dataToEntity);
                const normalizedData = normalize(data, [item]);
                const pages = {...state.pages};
                pages[action.payload._links.page] = normalizedData.result;
                const mergedEntities = {
                    ...state.entities[entityName],
                    ...normalizedData.entities[entityName]
                }
                const entities = {};
                entities[entityName] = mergedEntities;
                // Returns normalized updated Redux state
                return {
                    ...state,
                    ...normalizedData,
                    entities: entities,
                    pages: pages,
                    pagination: { 
                        page: action.payload._links.page,
                        totalPages: action.payload._links.page_count,
                        totalItems: action.payload._links.total,
                        limit: action.payload._links.max_results
                    }
                };
            },
            setPage: (state, action) => {
                return {
                    ...state,
                    pagination:  {...state.pagination, page: action.payload}
                }
            },
            addNewNominationName: (state, action) => {
                const denormalizedData = denormalize(state.result, [item], state.entities);
                const data = [...denormalizedData, action.payload];
                return normalize(data, [item]);
            }
        }
    }

    const allItemsSlice = createSlice(reducerOptions);
    const { addNewFile, loadData, setPage } = allItemsSlice.actions;

    return {
        allItemsSlice: allItemsSlice,
        addNewFile: addNewFile,
        loadData: loadData,
        setPage: setPage,
        selectPage: (state) => state[sliceName].pagination.page,
        selectTotalPages: (state) => state[sliceName].pagination.totalPages,
        selectLimit: (state) => state[sliceName].pagination.limit,
        loadPageItems: (page) => {
            return async (dispatch, getState) => {
                const state = getState();
                if(page in state[sliceName].pages) {
                    dispatch(setPage(page));
                    return;
                };
                if(options.preloadSlices) {
                    const preloadAll = [];
                    for(let i=0; i<options.preloadSlices.length; i++){
                        preloadAll.push(dispatch(options.preloadSlices[i]()));
                    }
                    const preload = await Promise.all(preloadAll);
                }
                const payload = await fetcher(
                    options.endpoint+'&page='+page+'&max_results='+state[sliceName].pagination.limit
                    );
                dispatch(loadData(payload));
            }
        },
        // selectPageItems returns data denormalized.
        selectPageItems: (state) => {
            
            let mergedEntities = {
                ...state[sliceName].entities
            }
            if(options.additionalEntities) {
                options.additionalEntities.forEach(element => {
                    mergedEntities = {
                        ...mergedEntities,
                        ...state[element].entities
                    }
                    
                });
            }
            const denormalizedData = denormalize(
                state[sliceName].pages[state[sliceName].pagination.page] || [],
                [item],
                mergedEntities
            );
            return denormalizedData;
        },
        selectAllItems: (state) => {
            const denormalizedData = denormalize(state[sliceName].result, [item], state[sliceName].entities);
            return denormalizedData;
        },
        itemSchema: item
    }
}