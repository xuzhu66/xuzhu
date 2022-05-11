import {getTemp} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';

const templateStore = {
    install() {
        store.registerModule(['templateStore'], {
            namespaced: true,
            state: {
                template: '',// 模板
                theme: '', // 主题 默认theme1
                templateId:'',//模板ID
            },
            mutations: {
                SET_TEMPLATE(state, data) {
                    state.template = data;
                },
                SET_THEME(state, data) {
                    state.theme = data;
                },
                SET_TEMPLATE_ID(state, data) {
                    state.templateId = data;
                },

            },
            actions: {
                async getTemplate({commit}, data) {
                    try {
                        let res = await getTemp(data)
                        if (res && res.success) {
                            commit('SET_TEMPLATE', res.data.templateNumber);
                            commit('SET_THEME', res.data.styleNumber);
                            commit('SET_TEMPLATE_ID', res.data.templateId);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                }
            }
        })
    },
    uninstall() {
        store.unregisterModule(['templateStore'])
    }
};

export default templateStore;
