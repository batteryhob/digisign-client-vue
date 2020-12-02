<template>
  <div class="hello">
    <div>
      Digisign - Callee
    </div>

    <div id="div_remote">
      <video id="remoteVideo" autoplay>
      </video>

      <div id="face" :style="{ 
        top:startY + 'px', 
        left: startX + 'px',
        width: detectWidth + 'px',
        height: detectHeight + 'px',          
      }">
        <svg xmlns="http://www.w3.org/2000/svg"
            viewBox="-1 -1 34 34">
            <circle cx="16" cy="16" r="15.9155"
                    class="progress-bar__background" />
            <circle cx="16" cy="16" r="15.9155"
                    class="progress-bar__progress 
                            js-progress-bar" 
                    :style="{ 
                      strokeDashoffset: strokeDashoffset,
                    }"/>
        </svg>
      </div>
    </div>


  </div>
</template>

<script>

export default {
  name: 'Digisign',
  props: {
    msg: String
  },
  sockets: {
      connect: function () {
        console.log('socket connected')          
      },
      disconnect: function () {
        console.log('socket connected')

        try{
          this.$data.callee.close()
        }catch(e){
          console.log(e)
        }

      },
      message: function (res) {
        
        if(res.data.type === 'offer'){
          this.receiveOffer(res.data);
        }

        if(res.data.type === 'candidate'){
          this.$data.callee.addIceCandidate(res.data.candidate);
        }

        if(res.data.type === 'mediaCandidate'){
          console.log(res.data)
        }

      },
      responseimage: function (img) {

        let frames = JSON.parse(img.data)
        this.$data.timestamp = img.timestamp

        try{
          this.$data.startY = frames[0].Frame.startY
          this.$data.startX = frames[0].Frame.startX
          this.$data.detectWidth = frames[0].Frame.endX - frames[0].Frame.startX
          this.$data.detectHeight = frames[0].Frame.endX - frames[0].Frame.startX
          this.$data.strokeDashoffset = 100 - parseInt(frames[0].Frame.score * 100)
        }catch{
          console.log('no detect')
        }

      }
  },
  methods: {
      //메세지 보내기
      sendMessage: function(message){
        console.log(message)
        this.$socket.emit('message', message)
      },
      receiveOffer: function (sdp){

        console.log("receiveOffer :" + sdp)
        this.$data.callee = new RTCPeerConnection(
          {
            iceServers: [
              {
                urls: "turn:3.35.140.181:3478",
                username: "batteryho",
                credential: "@@jj369369"
              }
            ]
          }
        );
        this.$data.callee.setRemoteDescription(sdp).then(()=>{
          this.createAnswer();
        });
        this.$data.callee.onicecandidate = this.handlerCalleeOnicecandidate;
        //WebRTC 피어커넥션 상태추적
        this.$data.callee.onconnectionstatechange = this.handlerCalleeOnconnectionstatechange;
        this.$data.callee.oniceconnectionstatechange = this.handlerCalleeOniceconnectionstatechange;
        this.$data.callee.onsignalingstatechange = this.handlerCalleeOnsignalingstatechange;
         //WebRTC 피어커넥션 상태추적
        this.$data.callee.ontrack = this.handleRemoteStreamAdded;       

      },
      createAnswer: function (){
       
          this.$data.callee.createAnswer().then((sdp) => {
            this.$data.callee.setLocalDescription(sdp);
            //this.sendAnswer(sdp); //로컬
            this.sendMessage(sdp) //서버
          })

      },

      handlerCalleeOnicecandidate: function(evt) {

        try{
          if(evt.candidate){
            this.sendMessage({
              type: 'candidate',
              candidate: evt.candidate
            })
          }            
        }catch(e){
          console.log(e)
        }

      },
      handlerCalleeOnsignalingstatechange: function (){

        console.log("signaling state : " + this.$data.callee.signalingState)

      },
      handlerCalleeOnconnectionstatechange: function() {

        console.log("connection state : " + this.$data.callee.connectionState)

      },
      handlerCalleeOniceconnectionstatechange: function() {

        console.log("iceconnection state : " + this.$data.callee.iceConnectionState)

      },
      handleRemoteStreamAdded: function (event) {

        this.$data.remoteVideo.srcObject = event.streams[0];
        this.$data.remoteStream = event.streams[0];

        this.$data.remoteVideo.autoplay  = true;
        this.$data.remoteVideo.playsInline  = true;
        this.$data.remoteVideo.muted   = true;

      }      
      
  },
  mounted(){ 

      //object setting
      this.$data.remoteVideo = document.getElementById("remoteVideo");
      //socket connect
      this.$socket.connect();

  },
  beforeDestroy(){

        try{
          this.$data.callee.close()
        }catch(e){
          console.log(e)
        }

  },
  data(){
    return{
      interval: null,

      peerConnection: null,

      callee: null,

      isInitiator: null,
      isStarted: null,
      isChannelReady: true,

      isNegotiating: false,

      localVideo: null,
      localStream: null,
      remoteVideo: null,
      remoteStream: null,

      canvasOutput: null,

      startX: 0,
      startY: 0,
      detectWidth: 0,
      detectHeight: 0,
      strokeDashoffset: 0,

      timestamp: 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  #div_remote {
    position: relative;

    #face{
      position: absolute;
      top: 0px;
      left: 0px;
      width: 0px;
      height: 0px;
      
      box-sizing: border-box;
      transition: all .1s ease-out;

      $progress-bar-stroke-width: 1.8;
      $progress-bar-size: 100%;
      svg {
        height: $progress-bar-size;
        transform: rotate(-90deg);
        width: $progress-bar-size;
      }              
      .progress-bar__background {
        fill: none;
        stroke: #e2eff0;
        stroke-width: $progress-bar-stroke-width;
      }              
      .progress-bar__progress {
        fill: none;
        stroke: transparent;
        stroke: green;
        stroke-dasharray: 100 100;
        stroke-dashoffset: 40;
        stroke-linecap: round;
        stroke-width: $progress-bar-stroke-width;
        transition: stroke-dashoffset 1s ease-in-out;
      }
    }
  }

</style>
