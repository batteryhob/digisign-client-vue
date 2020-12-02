
import { NXSNS } from '../constant/index';

const sockets = {
    //상태(데이터)
    state: {
        nxsn: 0
    },
    getters: {
        nxsn(state) {
            return state.nxsn;
        },
    },
    //동기
    mutations: {
        [NXSNS.SET_NXSN]: (state, payload) => {
            state.nxsn  = payload;
        }
    }
}

export default sockets