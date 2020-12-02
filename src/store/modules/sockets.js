
import { SOCKETS } from '../constant/index';

const sockets = {
    //상태(데이터)
    state: {

    },
    //동기
    mutations: {
        [SOCKETS.SOCKET_SUCCESS]: (state, payload) => {
            console.log(state, payload)
        }
    }
}

export default sockets