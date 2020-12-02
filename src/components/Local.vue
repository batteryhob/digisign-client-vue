<template>
  <div class="hello">
    <div>
      디지털사이니지
    </div>
    <div id="div_video">
      <video id="localVideo" autoplay>
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

    <div id="div_remote">
      <video id="remoteVideo" autoplay>
      </video>
    </div>

    <canvas id="canvasOutput"></canvas>
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
          
          this.connectStart();

          // const FPS = 20;
          // this.$data.intetval = setInterval(() => {
          //     this.getFrame()
          // }, 10000/FPS);
      },
      disconnect: function () {
        console.log('socket connected')
        clearInterval(this.$data.intetval)
      },
      message: function (res) {

        console.log(res)

        if(res.data.type === 'offer'){
          this.sendOffer(res.data);
        }

        if(res.data.type ==='answer'){
           this.sendAnswer(res.data);
        } 

        // if(res.type ==='candidate'){
        //   const candidate = new RTCIceCandidate({
        //     sdpMLineIndex : res.label,
        //     candidate: res.candidate
        //   });
        //   this.$data.peerConnection.addIceCandidate(candidate);
        // }

      },
      responseimage: function (img) {

        let frames = JSON.parse(img.data)
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
      //메세지보내기
      sendMessage: function(message){
        this.$socket.emit('message', message)
      },
      //프레임보내기
      getFrame: function () {

          console.log('getFrame')
          this.$data.canvasOutput.width = 300;
          this.$data.canvasOutput.height = 300;
          this.$data.canvasOutput.getContext('2d').drawImage(this.$data.localVideo, 0, 0, this.$data.canvasOutput.width, this.$data.canvasOutput.height);

          let data = this.$data.canvasOutput.toDataURL('image/png');
          data = data.replace('data:image/png;base64,', ''); //split off junk
          this.$socket.emit('image', data);

      },
      
      //WebRTC 커넥션 시작
      connectStart: function(){
          
          this.$data.caller = new RTCPeerConnection();
          this.$data.caller.onicecandidate = this.handlerCallerOnicecandidate;
          this.$data.caller.addStream(this.$data.localStream);
          this.createOffer()

      },
      createOffer: function(){

          this.$data.caller.createOffer().then((sdp)=>{
            this.$data.caller.setLocalDescription(sdp);
            //this.sendOffer(sdp); //로컬
            this.sendMessage(sdp) //서버
          })

      },
      sendOffer: function (sdp){

        console.log(sdp)
        this.$data.callee = new RTCPeerConnection(null);
        this.$data.callee.setRemoteDescription(sdp);
        this.$data.callee.onicecandidate = this.handlerCalleeOnicecandidate;
        this.$data.callee.onaddstream  = this.handleRemoteStreamAdded;
        this.createAnswer();

      },
      createAnswer: function (){
       
          this.$data.callee.createAnswer().then((sdp)=>{
            this.$data.callee.setLocalDescription(sdp);
            //this.sendAnswer(sdp); //로컬
            this.sendMessage(sdp) //서버
          })     

      },
      sendAnswer: function (sdp){

          this.$data.caller.setRemoteDescription(sdp)
          
      },

      handlerCallerOnicecandidate: function(evt){
        try{
          if(evt.candidate) this.$data.callee.addIceCandidate(evt.candidate);
        }catch(e){
          console.log(e)
        }
      },
      handlerCalleeOnicecandidate: function(evt){
        try{
          if(evt.candidate) this.$data.caller.addIceCandidate(evt.candidate);
        }catch(e){
          console.log(e)
        }
      },
      handleRemoteStreamAdded: function (event) {
        this.$data.remoteStream = event.stream;
        this.$data.remoteVideo.srcObject = this.$data.remoteStream;
      }
      
  },
  mounted(){ 

      //object setting
      this.$data.localVideo = document.getElementById("localVideo");
      this.$data.remoteVideo = document.getElementById("remoteVideo");
      this.$data.canvasOutput = document.getElementById("canvasOutput");

      //get local stream
      navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        })
        .then(gotStream)
        .catch((error) => console.error(error));

      let v = this
      function gotStream(stream) {
        v.$data.localStream = stream;
        v.$data.localVideo.srcObject = stream;

        //socket connect
        v.$socket.connect();
      }

  },
  data(){
    return{
      interval: null,

      peerConnection: null,

      caller: null,
      callee: null,

      isInitiator: null,
      isStarted: null,
      isChannelReady: true,

      localVideo: null,
      localStream: null,
      remoteVideo: null,
      remoteStream: null,

      canvasOutput: null,

      startX: 0,
      startY: 0,
      detectWidth: 0,
      detectHeight: 0,
      strokeDashoffset: 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  #div_video {
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
