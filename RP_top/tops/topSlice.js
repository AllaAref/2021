import { schema } from 'normalizr';
import {createListSlice} from '../../util/slice_util';

const top_endpoint = '/tops/?sort=[(%22update_time%22,-1)]';
export const top = new schema.Entity('tops');

export const {
    allItemsSlice,
    addNewItem,
    loadData,
    setPage,
    loadPageItems,
    selectPage,
    selectTotalPages,
    selectLimit,
    selectPageItems,
    selectAllItems,
    itemSchema
} = createListSlice({
    endpoint: top_endpoint,
    sliceName: 'allTops',
    entityName: 'tops',
    pageLimit: 3000,
    dataToEntity: (top) => {
        return {
            id: top._id,
            path_id: top.path_id,
            status: top.status,
            point_type: top.point_type
        };
    }
});

export default allItemsSlice.reducer;