import Vue from 'vue';
import Vuex from 'vuex';

import chats from './modules/chats';
import sockets from './modules/sockets';
import nxsns from './modules/nxsns';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    chats: chats,
    sockets: sockets,
    nxsns: nxsns
  }
})

export default store;