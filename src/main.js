import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'
import store from './store/index'
import router from './route'

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
    debug: true,
    //connection: 'http://localhost:8889' ,
    connection: '/',
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
    options: { autoConnect: false } //Optional options
}))

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
