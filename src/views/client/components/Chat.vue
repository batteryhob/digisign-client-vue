<template>
  <div class="chat" v-bind:class="{ off: minimize }">
    <div class="header">
      <i class="fas fa-comment-dots"></i>
      Chat
      <div class="newdiv" v-if="newFlag">
        <span class="new"></span>
      </div>
      <div class="onoff" @click="minimizeOnoff()">
        <i class="fas fa-window-minimize" v-if="minimize"></i>
        <i class="far fa-window-maximize" v-if="!minimize"></i>
      </div>
    </div>
    <div class="message" id="message">

      <div class="bunch" v-for="(e, i) in messageList" :key="i">
        <div class="profile">
          <img src="//ml.na.nexon.com//digisign/img/blank.png" alt="profile">
        </div>
        <div class="text">
            <p class="name">
              {{ e.teller }}
              <span class="time">{{ e.timestamp }}</span>
            </p>
            <span class="content">
              {{ e.text }}
            </span>
        </div>
      </div>

    </div>
    <div class="input">
      <div class="flex">
        <input type="text" v-model="text" v-on:keyup.enter="onEnter">
        <button @click="sendText">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import { CHATS } from '../../../store/constant/index'

export default {
  name: 'Chat',
  props: {
  },
  methods: {
    sendText() {

      if(this.$data.text.trim() === '')
        return;

      let tempText = this.$data.text

      this.$parent.sendMessage({
        type: 'text',
        text: tempText, 
        teller: 'client',
      })

      this.$data.text = "";

    },
    onEnter(){
      this.sendText();
    },
    minimizeOnoff(){
      this.$store.commit(CHATS.CLIENT_ONOFF)
    }
  },
  mounted(){
  },
  computed: {
    messageList() {
        return this.$store.getters.messageList;
    },
    minimize(){
        return this.$store.getters.clientMinimize;
    },
    newFlag(){
      return this.$store.getters.clientNew;
    }
  },
  watch: {
    messageList: {
          handler: function() {
              this.$nextTick(() => {
                var message = this.$el.querySelector("#message");
                message.scrollTop = message.scrollHeight;
              });
        },
        deep: true
    }
  },
  data(){
    return{
      text: ""
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  $color-fontgray: #17191d;
  $color-linegray: #363d45;
  $color-bordergray: #e9ecef;

  .chat {
    position: fixed;
    display: inline-block;
    width: 380px;
    right: 30px;
    bottom: 30px;    
    box-shadow: 0 0 20px 0 rgba(0,0,0,.08);

    .header {
      position: relative;
      padding: 15px;
      font-size: 16px;
      color: $color-fontgray;
      background-color: #fff;
      border-bottom: 1px solid $color-bordergray;
      .newdiv{
        position: absolute;
        top: 8px;
        left: 65px;
        display: inline-block;
        width: 30px;
        height: 30px;
        text-align: center;
        .new{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: inline-block;
          width: 10px;
          height: 10px;
          background-color: red;
          border-radius: 100%;
        }
      }
      .onoff{
        position: absolute;
        top: 16px;
        right: 20px;
      }
    }
    .message {
      height: 500px;
      padding: 10px;
      overflow-y: scroll;
      background-color: #fff;
      .bunch{
        display: flex;
        margin-bottom: 10px;
        .profile{
          flex: 1;
          text-align: center;
          img{
            margin-top: 10px;
            width: 30px;
            height: 30px;
            border-radius: 5px;
          }          
        }
        .text{
          flex: 6;
          padding: 5px;
          .name{
            margin: 0;
             font-size: 16px;
             font-weight: 700;
             .time {
               margin-left: 5px;
               font-size: 10px;
             }
          }
          .content{
            font-size: 14px;
          }          
        }
      }
    }
    .input {
      padding: 15px;
      background-color: #fff;
      border-top: 1px solid $color-bordergray;
      .flex{
        display: flex;
        input {
          flex: 5;
          font-family: "Noto Sans KR";
          font-size: 14px;
          border: none;
          outline: none;
          border-bottom: 1px solid $color-bordergray;
        }
        button {
          flex: 1;        
          margin-left: 5px;
          background-color: #2be283;
          font-family: "Noto Sans KR";
          font-size: 14px;                    
          color: #fff;                    
          border: none;
          outline: none;
          text-decoration: none;
          &:hover{
              background-color: #ccc;
          }
        }
      }

    }

    &.off{
      bottom: -545px;
      box-shadow: none;
      .header{
        box-shadow: 0 0 20px 0 rgba(0,0,0,.08);
      }
      .message {
        visibility: hidden;
      }
      .input {
        visibility: hidden;
      }
    }
  }
</style>
