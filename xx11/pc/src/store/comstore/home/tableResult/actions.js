import types from './types';

async function getTableList({state, commit}, payload) {
    // 如果已经加载了最后一页或者 还正在请求，则不执行
    if (state.tableFinished || !state.requestFinished) {
        return;
    }
    // 必须传formApi字段 ,  body 字段可选
    // if (state.tableLoading) return;
    const {formApi} = payload;
    // 页面增加一页
    commit('SET_PAGE', state.page + 1);
    // 默认显示loading
    commit('TABLE_LOADING', true);
    // 显示正在执行请求
    commit('SET_REQUEST_FINISHED', false);

    try {
        let body = {};
        // 参数
        let response
        if (payload.body) {
            body = payload.body;
            response = await formApi(body);
        } else {
            response = await formApi();
        }
        if (response && response.success) {
            if (response.data && response.data.records) {
                if (body.query.current == 1) {
                    commit(types.SET_TABLE_LIST, response.data.records);
                } else {
                    let newTableList = state.tableList.concat(response.data.records);
                    commit(types.SET_TABLE_LIST, newTableList);
                }
            }
            if ((response.data.total < response.data.records.length) || (response.data.current >= response.data.total / response.data.size)) {// 表示已经到最后一页
                commit('SET_TABLE_FINISHED', true);
            }
        } else {
            //
        }
        ////结束请求
        commit('SET_REQUEST_FINISHED', true);
        commit('TABLE_LOADING', false);
        return response;
    } catch (e) {
        // 结束请求
        commit('SET_REQUEST_FINISHED', true);
        commit('TABLE_LOADING', false);
        return e;
    }
}

const resetSearchResult = ({commit}) => {
    commit('RESET_SEARCH_RESULT');
};
export default {
    getTableList,
    resetSearchResult
};
