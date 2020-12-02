<template>
  <div id="client">

    <div class="content">
        <div class="header">
          <img src="//ml.na.nexon.com//digisign/img/logo01.png" alt="nexon">
        </div>

        <div class="screen">
          <div class="left">
            <div class="cam">
              <div class="desc">
                <p>                  
                  <span class="title">
                    <i class="fas fa-camera"></i>
                    Face
                  </span>- #{{uuid}}
                </p>
              </div>
              <div class="view">
                <video id="localVideo" autoplay>
                </video>
                <i v-if="!isConnectVideo" class="connect fas fa-satellite-dish"></i>
                <canvas id="canvasOutput"></canvas>
                <div class="recorddiv" v-if="isFgtStart">
                  <span class="record"></span>
                  <span class="background"></span>
                </div>
              </div>
            </div>
          </div>

          <div class="right">
            <div class="device">
              <div class="desc">
                <p>                  
                  <span class="title">
                    <i class="fas fa-desktop"></i>
                    Screen
                  </span>
                  <button class="link" @click="mediaSetting">
                    <i class="fas fa-link"></i>Link
                  </button>
                </p>
              </div>
              <div class="view">
                <video id="localMedia" autoplay>
                </video>
                <i v-if="!isConnectMedia" class="connect fas fa-satellite-dish"></i>
                <div class="recorddiv" v-if="isFgtStart">
                  <span class="record"></span>
                  <span class="background"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- {{ new Date(timeLine * 1000).toISOString().substr(11, 8) }} -->

    </div>

    <Chat/>
    
  </div>
</template>

<script>
import Chat from './components/Chat.vue'
import { CHATS } from '../../store/constant/index'


export default {
  name: 'Client',
  props: {
    msg: String
  },
  components: {
    Chat
  },
  sockets: {
      connect: function () {
          console.log('===== 3. socket connect =====')
      },
      disconnect: function () {
        console.log('===== etc. socket disconnect =====')
      },
      message: function (res) {

        this.$store.commit(CHATS.ADD_TEXT, res)

        if(res.data.type === 'answer'){
          if(res.data.screen === 'video'){
            this.$data.videoCaller.setRemoteDescription(res.data).catch(e => {
              console.log("Failure during setRemoteDescription(): " + e);
            });
          }

          if(res.data.screen === 'media'){
            this.$data.mediaCaller.setRemoteDescription(res.data).catch(e => {
              console.log("Failure during setRemoteDescription(): " + e);
            });
          }
        }
        if(res.data.type === 'candidate'){

          if(res.data.screen === 'video'){
            this.$data.videoCaller.addIceCandidate(res.data.candidate).catch(e => {
              console.log("Failure during addIceCandidate(): " + e);
            });
          }

          if(res.data.screen === 'media'){
            this.$data.mediaCaller.addIceCandidate(res.data.candidate).catch(e => {
              console.log("Failure during addIceCandidate(): " + e);
            });
          }

        }

        //테스트시작&종료
        if(res.data.type ==='bookmark'){

          if(res.data.bookmark === 'start'){
            //타임라인초기화
            this.$data.timeLine = 0;
            //플래그세팅
            this.$data.isFgtStart = true;
            //타이머시작
            this.getFrame();
          }
          if(res.data.bookmark === 'end'){
            //타이머종료
            clearTimeout(this.$data.timer)
            this.$data.timer = null
            //플래그세팅
            this.$data.isFgtStart = false;
          }

        }

      },
      joined: function(res){
        console.log(res) 
        if(!this.$data.isConnectVideo)
        {
          this.connectVideoStart();
        }
          
        // if(this.$data.isConnectMedia)
        // {
        //     if(this.$data.timer === null)
        //     {
        //       this.getFrame();
        //     }
        // }
      },
      leaved: function(res){   
        console.log(res)     
      }
  },
  methods: {
      videoSetting: function(){

        console.log('===== 2. set video =====')

        //마이캠세팅
        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        })
        .then((videoStream)=>{

          this.$data.videoStream = videoStream;
          this.$data.localVideo.srcObject = videoStream;

          this.$socket.connect();
          this.$data.uuid = this.$route.params.uuid
          this.$socket.emit('join', this.$data.uuid )

        })
        .catch((error) => {
          console.error(error)
        });
        
      },
      mediaSetting: function(){

        //미디어세팅
        navigator.mediaDevices.getDisplayMedia({
          video: true
        }).then((mediaStream)=>{

          this.$data.mediaStream = mediaStream;
          this.$data.localMedia.srcObject = mediaStream;

          this.connectMediaStart();

        })
        .catch((error) => {
          console.error(error)
        });

      },

      //메세지 보내기
      sendMessage: function(message){
        this.$socket.emit('message', {
          room: this.$data.uuid,
          ...message
        })
      },
      //프레임 보내기
      getFrame: function () {

          this.$data.timer = setTimeout(() => {

            this.$data.canvasOutput.width = 300;
            this.$data.canvasOutput.height = 300;
            this.$data.canvasOutput.getContext('2d').drawImage(this.$data.localVideo, 0, 0, this.$data.canvasOutput.width, this.$data.canvasOutput.height);

            let data = this.$data.canvasOutput.toDataURL('image/png');
            data = data.replace('data:image/png;base64,', ''); //split off junk
            this.$socket.emit('frame', {
              room: this.$data.uuid,
              nxsn: this.nxsn, //Frame 인퍼런스시 nxsn 전송
              image: data,              
              timeline: this.$data.timeLine
            });
            this.$data.timeLine += 1;
            this.getFrame();

          }, 1000)

      },      

      //WebRTC 피어커넥션 보내기
      connectVideoStart: function(){

        this.$data.videoCaller = new RTCPeerConnection(
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
        this.$data.videoCaller.onicecandidate = this.handlerVideoCallerOnicecandidate;
        // this.$data.videoCaller.onconnectionstatechange = this.handlerCallerOnconnectionstatechange;
        // this.$data.videoCaller.oniceconnectionstatechange = this.handlerCallerOniceconnectionstatechange;
        // this.$data.videoCaller.onsignalingstatechange = this.handlerCallerOnsignalingstatechange;

        this.$data.videoStream.getTracks().forEach((track) => {
          this.$data.videoCaller.addTrack(track, this.$data.videoStream);
        });
        this.$data.videoCaller.onnegotiationneeded = this.createVideoOffer        

        //비디오연결플래그
        this.$data.isConnectVideo = true;

      },
      connectMediaStart: function(){

        this.$data.mediaCaller = new RTCPeerConnection(
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
        this.$data.mediaCaller.onicecandidate = this.handlerMedaiCallerOnicecandidate;
        this.$data.mediaCaller.onconnectionstatechange = this.handlerCallerOnconnectionstatechange;
        this.$data.mediaCaller.oniceconnectionstatechange = this.handlerCallerOniceconnectionstatechange;
        this.$data.mediaCaller.onsignalingstatechange = this.handlerCallerOnsignalingstatechange;

        this.$data.mediaStream.getTracks().forEach((track) => {
          this.$data.mediaCaller.addTrack(track, this.$data.mediaStream);
        });
        this.$data.mediaCaller.onnegotiationneeded = this.createMediaOffer 
        
        //미디어연결플래그
        this.$data.isConnectMedia = true;

      },

      //WebRTC 오퍼 보내기
      createVideoOffer: function(){

        this.$data.videoCaller.createOffer().then((sdp)=>{
          this.$data.videoCaller.setLocalDescription(sdp);
          this.sendMessage({
              screen: 'video',
              type: sdp.type,
              sdp: sdp.sdp,
              nxsn: this.nxsn //첫 video offer시 client nxsn 전송
          })
        })

      },
      createMediaOffer: function(){

        this.$data.mediaCaller.createOffer().then((sdp)=>{
          this.$data.mediaCaller.setLocalDescription(sdp);
          this.sendMessage({
              screen: 'media',
              type: sdp.type,
              sdp: sdp.sdp,              
          })
        })

      },

      //WebRTC Candidate 세팅
      handlerVideoCallerOnicecandidate: function(evt){
      
        try{
          if(evt.candidate){
            this.sendMessage({
              type: 'candidate',
              screen: 'video',
              candidate: evt.candidate
            })
          }
        }catch(e){
          console.log(e)
        }

      },
      handlerMedaiCallerOnicecandidate: function(evt){
      
        try{
          if(evt.candidate){
            this.sendMessage({
              type: 'candidate',
              screen: 'media',
              candidate: evt.candidate
            })
          }
        }catch(e){
          console.log(e)
        }

      },

      //WebRTC 상태추적
      handlerCallerOnsignalingstatechange: function (){

        this.sendMessage({
          type: 'text',
          text: "signaling state : " + this.$data.mediaCaller.signalingState, 
          teller: 'webrtc',
        })

      },
      handlerCallerOnconnectionstatechange: function (){

        this.sendMessage({
          type: 'text',
          text: "connection state : " + this.$data.mediaCaller.connectionState, 
          teller: 'webrtc',
        })

      },
      handlerCallerOniceconnectionstatechange: function(){

        this.sendMessage({
          type: 'text',
          text: "iceconnection state : " + this.$data.mediaCaller.iceConnectionState, 
          teller: 'webrtc',
        })

      }

  },
  computed: {
    nxsn(){
      return this.$store.getters.nxsn;
    }
  },
  mounted(){

    console.log('===== 1. mounted =====')

    //마이캠
    this.$data.localVideo = document.getElementById("localVideo");
    this.$data.canvasOutput = document.getElementById("canvasOutput");
    //디바이스
    this.$data.localMedia = document.getElementById("localMedia");

    this.videoSetting();

  },
  beforeDestroy(){

    try{
      
      this.$data.videoCaller.close();
      this.$data.mediaCaller.close();

    }catch(e){
      console.log(e)
    }

  },
  data(){
    return{

      uuid: "xxxxxxx-xxxx-xxxx-xxxxxx",

      timeLine: 0,

      localVideo: null,
      localMedia: null,

      videoCaller: null,
      mediaCaller: null,

      videoStream: null,
      mediaStream: null,

      canvasOutput: null,

      isConnectVideo: false,
      isConnectMedia: false,

      isFgtStart: false,
      
      timer: null

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
   @import './Client.scss';
</style>
