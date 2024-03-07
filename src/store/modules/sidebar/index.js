/**
 * Sidebar Module
 */

import { menus } from './data.js';

const state = {
    menus
}

const getters = {
    silderMenus: state => {
        return state.menus;
    }
}

const actions = {
    setActiveMenuGroup(context, payload) {
        context.commit('setActiveMenuGroupHandler', payload);
    }
}

const mutations = {
    setActiveMenuGroupHandler(state, menus) {
        state.menus = menus
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
