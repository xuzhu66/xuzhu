import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

const namespaced = true;

export const tableResult = {
    namespaced: namespaced,
    state() {
        return {
            ...state
        };
    },
    // state,
    actions,
    getters,
    mutations
};
