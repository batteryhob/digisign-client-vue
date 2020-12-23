import Vue from 'vue'
import VueRouter from 'vue-router'

import Admin from './views/admin/Admin.vue'
import Client from './views/client/Client.vue'

// import store from './store/index'

// import { getCookie } from './cookie';
// import { NXSNS } from './store/constant/index'

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/digisign/admin',
            name: 'Admin',
            component: Admin,
            // beforeEnter: (to, from, next) => {

            //     if(getCookie("NPP") === "")
            //         window.location.href = `https://nxlogin.nexon.com/common/login.aspx?redirect=https://ml.na.nexon.com${to.path}`;
            //     else{
            //         const nxsn = getCookie("NPP").split(':')[2];
            //         store.commit(NXSNS.SET_NXSN, nxsn)
            //         next()
            //     }
                
            // }
        },
        {
            path: '/digisign/client/:uuid',
            name: 'Client',
            component: Client,
            // beforeEnter: (to, from, next) => {

            //     if(getCookie("NPP") === "")
            //         window.location.href = `https://nxlogin.nexon.com/common/login.aspx?redirect=https://ml.na.nexon.com${to.path}`;
            //     else{
            //         const nxsn = getCookie("NPP").split(':')[2];
            //         store.commit(NXSNS.SET_NXSN, nxsn)
            //         next()
            //     }
                
            // }
        }
    ]
})
