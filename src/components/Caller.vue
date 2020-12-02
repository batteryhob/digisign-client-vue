<template>
  <div class="hello">
    <div>
      Digisign - Caller
    </div>

    <div id="player"></div>

    <div id="div_video">
      <video id="localVideo" autoplay>
      </video>
      <canvas id="canvasOutput"></canvas>
    </div>

    <div id="div_video">
      <video id="mediaVideo" autoplay>
      </video>
    </div>

    <button @click="mediaConnect">미디어연결</button>

    

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
          
          const FPS = 20;
          this.$data.intetval = setInterval(() => {
              this.getFrame()
          }, 10000/FPS);

      },
      disconnect: function () {
        console.log('socket connected')

        try{
          this.$data.caller.close()
        }catch(e){
          console.log(e)
        }

        clearInterval(this.$data.intetval)
      },
      message: function (res) {

        if(res.data.type ==='answer'){
           this.receiveAnswer(res.data);
        }

        if(res.data.type ==='candidate'){
          this.$data.caller.addIceCandidate(res.data.candidate).catch(e => {
            console.log("Failure during addIceCandidate(): " + e);
          });
        }

      },
  },
  methods: {
      mediaConnect: function(){
        
        //get media stream
        this.$data.mediaVideo = document.getElementById("mediaVideo");

        var displayMediaStreamConstraints = {
            video: true
            // {
            //   aspectRatio: 'default',
            //   frameRate: 'default',
            //   cursor : 'default',
            //   displaySurface : 'default',            
            //   logicalSurface : true,
            //   width: 1280,
            //   height: 720
            // }
        };
        
        const v = this;
        if(navigator.mediaDevices.getDisplayMedia) {
            navigator.mediaDevices.getDisplayMedia(displayMediaStreamConstraints).then((stream)=>{
              v.$data.mediaStream = stream;
              v.$data.mediaVideo.srcObject = stream;
            }).catch(()=>{

            });
        }
        else {
            navigator.getDisplayMedia(displayMediaStreamConstraints).then((stream)=>{
              v.$data.mediaStream = stream;
              v.$data.mediaVideo.srcObject = stream;
            }).catch(()=>{

            });
        }
      },
      //메세지 보내기
      sendMessage: function(message){
        console.log(message)
        this.$socket.emit('message', message)
      },
      //프레임 보내기
      getFrame: function () {
        
          this.$data.canvasOutput.width = 300;
          this.$data.canvasOutput.height = 300;
          this.$data.canvasOutput.getContext('2d').drawImage(this.$data.localVideo, 0, 0, this.$data.canvasOutput.width, this.$data.canvasOutput.height);

          let data = this.$data.canvasOutput.toDataURL('image/png');
          data = data.replace('data:image/png;base64,', ''); //split off junk
          this.$socket.emit('frame', {
            image: data,
            timestamp: this.$data.player.getCurrentTime()
          });

      },      
      //WebRTC 피어커넥션 보내기
      connectStart: function(){

        this.$data.caller = new RTCPeerConnection(
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
        this.$data.caller.onicecandidate = this.handlerCallerOnicecandidate;
        //WebRTC 피어커넥션 상태추적
        this.$data.caller.onconnectionstatechange = this.handlerCallerOnconnectionstatechange;
        this.$data.caller.oniceconnectionstatechange = this.handlerCallerOniceconnectionstatechange;
        this.$data.caller.onsignalingstatechange = this.handlerCallerOnsignalingstatechange;
        //WebRTC 피어커넥션 상태추적
        //this.$data.caller.addStream(this.$data.localStream);
        this.$data.localStream.getTracks().forEach((track) => {
          this.$data.caller.addTrack(track, this.$data.localStream);
        });
        //this.createOffer()
        this.$data.caller.onnegotiationneeded = this.createOffer        

      },
      createOffer: function(){

        this.$data.caller.createOffer().then((sdp)=>{
          this.$data.caller.setLocalDescription(sdp);
          //this.sendOffer(sdp); //로컬
          this.sendMessage(sdp) //서버
        })

      },
      receiveAnswer: function (sdp){

        this.$data.caller.setRemoteDescription(sdp).catch(e => {
          console.log("Failure during setRemoteDescription(): " + e);
        });
          
      },
      handlerCallerOnicecandidate: function(evt){
      
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
      handlerCallerOnsignalingstatechange: function (){

        console.log("signaling state : " + this.$data.caller.signalingState)

      },
      handlerCallerOnconnectionstatechange: function (){

        console.log("connection state : " + this.$data.caller.connectionState)

      },
      handlerCallerOniceconnectionstatechange: function(){

        console.log("iceconnection state : " + this.$data.caller.iceConnectionState)

      },
      onYouTubeIframeAPIReady: function(){
        
        //eslint-disable-next-line
        this.$data.player = new YT.Player('player', {
          height: '360',
          width: '640',
          videoId: 'oieEXVtYKGY',
          events: {
            'onReady': this.onPlayerReady,
          }
        });

      },
  },
  mounted(){ 

      //eslint-disable-next-line
      if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
          var tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
      window.onYouTubePlayerAPIReady = this.onYouTubeIframeAPIReady

      //object setting
      this.$data.localVideo = document.getElementById("localVideo");
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
  beforeDestroy(){

        try{
          this.$data.caller.close()
        }catch(e){
          console.log(e)
        }

  },
  data(){
    return{
      interval: null,

      peerConnection: null,

      caller: null,

      isInitiator: null,
      isStarted: null,
      isChannelReady: true,

      localVideo: null,
      localStream: null,
      mediaVideo: null,
      mediaStream: null,

      remoteVideo: null,
      remoteStream: null,

      canvasOutput: null,

      startX: 0,
      startY: 0,
      detectWidth: 0,
      detectHeight: 0,
      strokeDashoffset: 0,

      player: null
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
