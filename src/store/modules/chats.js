
import { CHATS } from '../constant/index';

const chats = {
    //상태(데이터)
    state: {
        messageList : [{
            type: 'init',
            text: '시스템을 시작합니다.',
            teller: 'system',
            data: {},
            timestamp: new Date(Date.now()).toDateString()
        },
        {
            type: 'init',
            text: '북마크를 세팅해주세요.',
            teller: 'system',
            data: {},
            timestamp: new Date(Date.now()).toDateString()
        }],
        clientMinimize: false,
        adminMinimize: false,
        clientNew: false,
        adminNew: false,
    },
    getters: {
        messageList(state) {
            return state.messageList;
        },
        clientMinimize(state) {
            return state.clientMinimize;
        },
        adminMinimize(state) {
            return state.adminMinimize;
        },
        clientNew(state) {
            return state.clientNew;
        },
        adminNew(state) {
            return state.adminNew;
        }
    },
    //동기
    mutations: {
        [CHATS.ADD_TEXT]: (state, payload) => {

            if(payload.data.type === 'offer'){
                state.messageList = [
                    ...state.messageList,
                    {
                        type: payload.data.type,
                        text: '클라이언트에서 연결요청을 했습니다.',
                        teller: 'client',
                        data: payload.data,
                        timestamp: new Date(Date.now()).toDateString()
                    }
                ]
                if(state.clientMinimize){
                    state.clientNew  = true;
                }
                if(state.adminMinimize){
                    state.adminNew  = true;
                }
            }

            if(payload.data.type === 'answer'){
                state.messageList = [
                    ...state.messageList,
                    {
                        type: payload.data.type,
                        text: '클라이언트의 연결요청을 허용합니다.',
                        teller: 'admin',
                        data: payload.data,
                        timestamp: new Date(Date.now()).toDateString()
                    }
                ]
                if(state.clientMinimize){
                    state.clientNew  = true;
                }
                if(state.adminMinimize){
                    state.adminNew  = true;
                }
            }

            if(payload.data.type === 'candidate'){
                // state.messageList = [
                //     ...state.messageList,
                //     payload
                // ]
            }

            if(payload.data.type === 'text'){
                state.messageList = [
                    ...state.messageList,
                    {
                        type: payload.data.type,
                        text: payload.data.text,
                        teller: payload.data.teller,
                        data: payload.data,
                        timestamp: new Date(Date.now()).toDateString()
                    }
                ]
                if(state.clientMinimize){
                    state.clientNew  = true;
                }
                if(state.adminMinimize){
                    state.adminNew  = true;
                }
            }

        },
        [CHATS.CLIENT_ONOFF]: (state) => {
            state.clientMinimize = !state.clientMinimize
            if(!state.clientMinimize){
                state.clientNew  = false;
            }
        },
        [CHATS.ADMIN_ONOFF]: (state) => {
            state.adminMinimize = !state.adminMinimize
            if(!state.adminMinimize){
                state.adminNew  = false;
            }
        }
    }
}

export default chats