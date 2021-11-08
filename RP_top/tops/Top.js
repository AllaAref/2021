import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadPageItems, addNewItem, selectPageItems } from '../tops/topSlice';
import topFormConfig from './topFormSlice';
import ListView from '../../components/List/ListView';

function Top() {
    const listConfig = [
        {
            'field': 'path_id',
            'name': 'ID',
        },
        {
            'field': 'path_id',
            'name': 'Name',
        },
        {
            'field': 'status',
            'name': 'Status',
        },
        {
            'field': 'point_type',
            'name': 'Point type',
        }
    ];
    const allTops = useSelector(selectPageItems);
    const dispatch = useDispatch();
    
    const onFirstRender = () => {
        dispatch(loadPageItems());
    };
    
    useEffect(onFirstRender, [dispatch]);

    const onAddNewTop = (topToAdd) => {
        dispatch(addNewItem(topToAdd));
    };

    const onSetPage = (page) => {
        return page+1;
    }

    return(
        <div>
            <div className="container my-3">
                <ListView 
                    title='Топы'
                    listConfig={listConfig}
                    rows={allTops}
                    onAddClick={onAddNewTop}
                    onPageClick={onSetPage}
                    topFormConfig={topFormConfig}
                />
            </div>
        </div>
    )
}

export default Top;