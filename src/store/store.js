import Vue from 'vue'
import Vuex from 'vuex'

// modules
import auth from './modules/auth';
import login from './modules/auth/login';
import socket from './modules/auth/socket';
import library from './modules/auth/library';
import settings from './modules/settings';
import sidebar from './modules/sidebar';
import request from './modules/request'
import usertable from './modules/usertable'
import routers from './modules/routers'
import role from './modules/role'
import map from './modules/map'
import liveshow from './modules/liveshow'

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        // auth,
        request,
        login,
        socket,
        settings,
        sidebar,
        usertable,
        routers,
        role,
        map,
        liveshow,
        library
    }
})
