import types from './types';
import {result} from './state';

const tableLoading = (state, payload) => {
    state.tableLoading = payload;
};

const setTableList = (state, payload) => {
    state.tableList = payload;
};
const setPageSize = (state, payload) => {
    state.size = payload;
};
const setTotal = (state, payload) => {
    state.total = payload;
};
const setPage = (state, payload) => {
    state.page = payload;
};
const setTableFinished = (state, payload) => {
    state.tableFinished = payload;
};
const setRequestFinished = (state, payload) => {
    state.requestFinished = payload;
};
const resetSearchResult = state => {
    const initialResult = result();
    Object.keys(initialResult).forEach(key => {
        state[key] = initialResult[key];
    });
};

export default {
    [types.SET_TABLE_LIST]: setTableList,
    [types.SET_PAGE_SIZE]: setPageSize,
    [types.SET_TOTAL]: setTotal,
    [types.SET_PAGE]: setPage,
    [types.RESET_SEARCH_RESULT]: resetSearchResult,
    [types.TABLE_LOADING]: tableLoading,
    [types.SET_TABLE_FINISHED]: setTableFinished,
    [types.SET_REQUEST_FINISHED]: setRequestFinished
};
