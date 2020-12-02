<template>
  <div id="admin">

    <div class="content">
        <div class="header">
          <img src="//ml.na.nexon.com//digisign/img/logo02.png" alt="nexon">
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
                  <span class="copy clipboard_url" :data-clipboard-text="clientUrl" >
                    <i class="far fa-copy"></i>
                  </span>                  
                </p>
              </div>
              <div class="view">
                <video id="remoteVideo" autoplay>
                </video>
                <i v-if="!isConnectVideo" class="connect fas fa-satellite-dish"></i>
                <!--디텍션-->
                <div v-if="isFaceDetect" id="facesquere"  :style="{ 
                  top:startY + 'px', 
                  left: startX + 'px',
                  width: detectWidth + 'px',
                  height: detectHeight + 'px'
                }">
                  <div class="age">
                    <p>{{age}} Age | {{gender}}</p>
                  </div>

                  <div class="squere upleft"></div>
                  <div class="squere upright"></div>
                  <div class="squere downleft"></div>
                  <div class="squere downright"></div>

                  <div id="progress">
                    <div class="range" :style="{ width: detectWidth + 'px' }">
                      <div class="bar">
                        <span class="value" :style="{ width: score + '%' }"></span>
                      </div>
                      <span class="icon">
                        <i class="fas fa-search"></i>
                      </span>
                      
                    </div>
                    <div :class="{ 'range': center, 'range false' : !center }" :style="{ width: detectWidth + 'px' }">
                      <div class="bar">
                        <span class="value" :style="{ width: center ? '100%' : '0%' }"></span>
                      </div>
                      <span class="icon">
                        <i class="fas fa-eye"></i>
                      </span>
                    </div>
                  </div>
                </div>
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
                </p>
              </div>
              <div class="view">
                <video id="remoteMedia" autoplay>
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

        <div class="infomation">
          <div class="timeline">
            <div class="content">
              <div class="title">                
                <span>
                  <i class="fas fa-history"></i>
                  Timeline
                </span>- {{ new Date(timeLine * 1000).toISOString().substr(11, 8) }}
              </div>
              <div class="graph">
                <div class="circle" :style="{ left: '0%' }"></div>
                <div class="bookmark" :style="{ left: (marks.time/timeLine) * 100  + '%' }" v-for="(marks, i) in bookMarks" :key="i">
                  <i v-if="marks.data.emotion === 'angry'" class="fas fa-angry"></i>
                  <i v-if="marks.data.emotion === 'disgust'" class="fas fa-grimace"></i>
                  <i v-if="marks.data.emotion === 'fear'" class="fas fa-flushed"></i>
                  <i v-if="marks.data.emotion === 'happy'" class="fas fa-laugh-beam"></i>
                  <i v-if="marks.data.emotion === 'sad'" class="fas fa-tired"></i>
                  <i v-if="marks.data.emotion === 'surprise'" class="fas fa-surprise"></i>
                  <i v-if="marks.data.emotion === 'neutral'" class="fas fa-meh"></i>
                  <i v-if="marks.data.bookmark === 'start'" class="fas fa-play"></i>
                  <i v-if="marks.data.bookmark === 'end'" class="fas fa-pause"></i>
                  <i v-if="marks.data.bookmark === 'check'" class="fas fa-check"></i>
                  <i v-if="marks.data.bookmark === 'custom'" class="fas fa-user-check"></i>
                  <div class="tooltip">
                    <p>type: {{marks.type}}</p>
                    <p>second: {{marks.time}}</p>
                  </div>
                </div>
                <div class="circle" :style="{ left: '100%' }"></div>
              </div>     
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="left">
            <div class="title">
              <span>
                <i class="fas fa-laugh-beam"></i>
                Realtime Emotion
              </span>
            </div>
            <div class="legend">
              <!-- $color-angry: #ED5565;
              $color-disgust: #5D9CEC;
              $color-fear: #AC92EC;
              $color-happy: #EC87C0;
              $color-sad: #4FC1E9;
              $color-surprise: #FFCE54;
              $color-neutral: #48CFAD;  -->
              <ul>
                <li v-for="(e,i) in emotions" :key="i">
                  <span :class="`point ${e}`"></span>{{e}}
                </li>
              </ul>
            </div>
            <div class="chart">
              <canvas id="line">
              </canvas>
            </div>
          </div>
          <div class="right">
            <div class="title">
              <span>
                <i class="fas fa-bookmark"></i>
                Bookmark
              </span>
            </div>
            <div class="buttons">
              <ul>
                <li v-if="!isFgtStart">
                  <div class="button" @click="fgtStart()">
                    <p class="icon"><i class="fas fa-play"></i></p>
                    <p class="text">Start</p>
                  </div>
                </li>  
                <li v-if="isFgtStart">
                  <div class="button" @click="fgtEnd()">
                    <p class="icon"><i class="fas fa-pause"></i></p>
                    <p class="text">End</p>
                  </div>
                </li> 
                <li>
                  <div class="button" @click="bookMark('check')">
                    <p class="icon"><i class="fas fa-check"></i></p>
                    <p class="text">Check</p>
                  </div>
                </li>                
                <li v-for="(e, i) in customButtons" :key="i">
                  <div class="button" @click="customBookMark(e)">
                    <p class="icon"><i class="fas fa-user-check"></i></p>
                    <p class="text">{{ e }}</p>
                  </div>
                </li>
                <li>
                  <div class="button etc" @click="openBookmark()">
                    <p class="icon"><i class="fas fa-plus"></i></p>
                    <p class="text">Add</p>
                  </div>
                </li>
                <li>
                  <div class="button etc" @click="resetBookmark()">
                    <p class="icon"><i class="fas fa-trash-alt"></i></p>
                    <p class="text">Reset</p>
                  </div>
                </li>
              </ul>
            </div>     
          </div>       
        </div>

        <div class="replay" v-show="isReplaySetting">
          <div class="left">
            <div class="cam">
              <div class="desc">
                <p>                  
                  <span class="title">
                    <i class="fas fa-redo"></i>
                    Replay
                  </span>
                  <button class="download" @click="downloadVideo()"><i class="fas fa-download"></i>Download</button>
                </p>
              </div>
              <div class="view">
                <video id="reFaceVideo" autoplay>
                </video>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="device">
              <div class="desc">
                <p>                  
                  <span class="title">
                  </span>
                </p>
              </div>
              <div class="view">
                <video id="reScreenVideo" autoplay>
                </video>
              </div>
            </div>
          </div>
        </div>

    </div>

    <Chat/>
    <AddBookmark :bookmarkPopup="bookmarkPopup" />

  </div>
</template>

<script>
import Chat from './components/Chat.vue'
import AddBookmark from './components/AddBookmark.vue'

import { CHATS } from '../../store/constant/index'

import Chart from 'chart.js';
import { chartConfig, emotionDataset } from './emotionDataset'

export default {
  name: 'Admin',
  props: {
    msg: String
  },
  components: {
    Chat,
    AddBookmark
  },
  sockets: {
      connect: function () {
        console.log('===== 2. socket connect =====')   
      },
      disconnect: function () {
        console.log('===== etc. socket disconnect =====')
      },
      message: function (res) {
        
        this.$store.commit(CHATS.ADD_TEXT, res)

        if(res.data.type ==='offer'){
          if(res.data.screen === 'video'){
            this.receiveVideoOffer(res.data);

            //클라이언트 nxsn
            this.$data.clientNXSN = res.data.nxsn;
          }

          if(res.data.screen === 'media'){
            this.receiveMediaOffer(res.data);
          }
        }

        if(res.data.type ==='candidate'){

          if(res.data.screen === 'video'){
            this.$data.videoCallee.addIceCandidate(res.data.candidate).catch(e => {
              console.log("Failure during addIceCandidate(): " + e);
            });
          }

          if(res.data.screen === 'media'){
            this.$data.mediaCallee.addIceCandidate(res.data.candidate).catch(e => {
              console.log("Failure during addIceCandidate(): " + e);
            });
          }

        }

      },
      responseimage: function (img) {

        let frames = JSON.parse(img.data)
        this.$data.timestamp = img.timestamp

        try{

          if(!this.$data.isFgtStart)
            return

          //Face Detect
          this.$data.age = frames[0].Frame.age
          this.$data.gender = frames[0].Frame.gender

          this.$data.startY = frames[0].Frame.startY
          this.$data.startX = frames[0].Frame.startX
          this.$data.detectWidth = frames[0].Frame.endX - frames[0].Frame.startX
          this.$data.detectHeight = frames[0].Frame.endX - frames[0].Frame.startX
          this.$data.score = parseInt(frames[0].Frame.score * 100)

          this.$data.isFaceDetect = true;

          //Frontial Detect
          this.$data.center = frames[0].Frame.center === "True" ?  true : false;

          //Emotion Detect
          if(this.$data.emotionChart.data.labels.length > 50){
            this.$data.emotionChart.data.labels.shift()
            this.$data.emotionChart.data.datasets.forEach(element => {
              element.data.shift()
            });
          }
          this.$data.emotionChart.data.labels.push(this.$data.timeLine);
          this.$data.emotionChart.data.datasets[0].data.push(frames[0].Frame.angry * 100)
          this.$data.emotionChart.data.datasets[1].data.push(frames[0].Frame.disgust * 100)
          this.$data.emotionChart.data.datasets[2].data.push(frames[0].Frame.fear * 100)
          this.$data.emotionChart.data.datasets[3].data.push(frames[0].Frame.happy * 100)
          this.$data.emotionChart.data.datasets[4].data.push(frames[0].Frame.sad * 100)
          this.$data.emotionChart.data.datasets[5].data.push(frames[0].Frame.surprise * 100)
          this.$data.emotionChart.data.datasets[6].data.push(frames[0].Frame.neutral * 100)          
          this.$data.emotionChart.update();

          //Bookmark
          this.$data.emotions = [
            "angry",
            "disgust",
            "fear",
            "happy",
            "sad",
            "surprise",
            "neutral"
          ]

          this.$data.emotions.forEach(element => {

            if(element === 'neutral')
              return

            if((frames[0].Frame[element] * 100) > 60){

              this.$data.bookMarks.push({
                type: 'emotion',
                data: {
                  emotion: element,
                  variance: frames[0].Frame[element] * 100
                },
                time: frames[0].Frame.timeline
              })

            }

          });

        }catch(e){
          this.$data.isFaceDetect = false;
          console.log('error:' + e)
        }

      },
      created: function(res){
        console.log(res)
      },
      destroyed: function(res){
        console.log(res)
      }
  },
  methods: {

      bookMark: function(bookmark){

        //FGT시작시에만 작동
        if(!this.$data.isFgtStart)
          return;

        //북마크전송
        this.sendMessage({
          nxsn: this.$data.clientNXSN, //북마크시 nxsn 전송
          type: 'bookmark',
          bookmark: bookmark,
          timeline: this.$data.timeLine
        })

        this.$data.bookMarks.push({
          type: 'bookmark',
          data: {
            bookmark: bookmark
          },
          time: this.$data.timeLine
        })

      },
      customBookMark: function(desc){

        //FGT시작시에만 작동
        if(!this.$data.isFgtStart)
          return;

        //북마크전송
        this.sendMessage({
          nxsn: this.$data.clientNXSN, //북마크시 nxsn 전송
          type: 'bookmark',
          bookmark: desc,
          timeline: this.$data.timeLine
        })

        this.$data.bookMarks.push({
          type: 'bookmark',
          data: {
            bookmark: 'custom',
            desc: desc
          },
          time: this.$data.timeLine
        })

      },
      openBookmark: function(){
        this.$data.bookmarkPopup = true;
      },
      resetBookmark: function(){
        this.$data.customButtons = [];
      },

      //메세지 보내기
      sendMessage: function(message){
        this.$socket.emit('message', {
          room: this.$data.uuid,
          ...message
        })
      },
      receiveVideoOffer: function (sdp){

        console.log("receiveVideoOffer :" + sdp)
        this.$data.videoCallee = new RTCPeerConnection(
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
        this.$data.videoCallee.setRemoteDescription(sdp).then(()=>{
          this.createVideoAnswer();
        });
        this.$data.videoCallee.onicecandidate = this.handlerVideoCalleeOnicecandidate;

        // this.$data.videoCallee.onconnectionstatechange = this.handlerCalleeOnconnectionstatechange;
        // this.$data.videoCallee.oniceconnectionstatechange = this.handlerCalleeOniceconnectionstatechange;
        // this.$data.videoCallee.onsignalingstatechange = this.handlerCalleeOnsignalingstatechange;

        this.$data.videoCallee.ontrack = this.handleRemoteVideoStreamAdded;       

      },
      receiveMediaOffer: function (sdp){

        console.log("receiveMediaOffer :" + sdp)
        this.$data.mediaCallee = new RTCPeerConnection(
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
        this.$data.mediaCallee.setRemoteDescription(sdp).then(()=>{
          this.createMediaAnswer();
        });
        this.$data.mediaCallee.onicecandidate = this.handlerMediaCalleeOnicecandidate;

        this.$data.mediaCallee.onconnectionstatechange = this.handlerCalleeOnconnectionstatechange;
        this.$data.mediaCallee.oniceconnectionstatechange = this.handlerCalleeOniceconnectionstatechange;
        this.$data.mediaCallee.onsignalingstatechange = this.handlerCalleeOnsignalingstatechange;

        this.$data.mediaCallee.ontrack = this.handleRemoteMediaStreamAdded;       

      },

      //WebRTC 앤써 보내기
      createVideoAnswer: function (){
       
          this.$data.videoCallee.createAnswer().then((sdp) => {
            this.$data.videoCallee.setLocalDescription(sdp);
            this.sendMessage({
              screen: 'video',
              type: sdp.type,
              sdp: sdp.sdp,  
            })
          })

      },
      createMediaAnswer: function (){
       
          this.$data.mediaCallee.createAnswer().then((sdp) => {
            this.$data.mediaCallee.setLocalDescription(sdp);
            this.sendMessage({
              screen: 'media',
              type: sdp.type,
              sdp: sdp.sdp,  
            })
          })

      },

      //WebRTC Candidate 세팅
      handlerVideoCalleeOnicecandidate: function(evt) {

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
      handlerMediaCalleeOnicecandidate: function(evt) {

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
      handlerCalleeOnsignalingstatechange: function (){

        this.sendMessage({
          type: 'text',
          text: "signaling state : " + this.$data.mediaCallee.signalingState, 
          teller: 'webrtc',
        })

      },
      handlerCalleeOnconnectionstatechange: function (){

        this.sendMessage({
          type: 'text',
          text: "connection state : " + this.$data.mediaCallee.connectionState, 
          teller: 'webrtc',
        })

      },
      handlerCalleeOniceconnectionstatechange: function(){

        this.sendMessage({
          type: 'text',
          text: "iceconnection state : " + this.$data.mediaCallee.iceConnectionState, 
          teller: 'webrtc',
        })

      },

      //WebRTC Stream 세팅
      handleRemoteVideoStreamAdded: function (event) {
     
        this.$data.remoteVideo.srcObject = event.streams[0];
        this.$data.videoStream = event.streams[0];

        this.$data.remoteVideo.autoplay  = true;
        this.$data.remoteVideo.playsInline  = true;
        this.$data.remoteVideo.muted   = true;

        this.$data.isConnectVideo = true;

      },
      handleRemoteMediaStreamAdded: function (event) {

        this.$data.remoteMedia.srcObject = event.streams[0];
        this.$data.mediaStream = event.streams[0];

        this.$data.remoteMedia.autoplay = true;
        this.$data.remoteMedia.playsInline = true;
        this.$data.remoteMedia.muted = true;

        this.$data.isConnectMedia = true;

      },

      getTimeline: function () {

          this.$data.timer = setTimeout(() => {

            this.$data.timeLine += 1;
            this.getTimeline();

          },1000);

      },
      generateUUID: function () { 
        // Public Domain/MIT
        var d = new Date().getTime();//Timestamp
        var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if(d > 0){//Use timestamp until depleted
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
      },

      //테스트 시작
      fgtStart: function(){

        //Face&Screen 둘다 연결되있을때만 테스트시작가능
        if(this.$data.isConnectVideo && this.$data.isConnectMedia)
        {

            let rtn = confirm('Are you going to FGT? Datas will be initialized.')
            if(!rtn)
              return;

            //데이터초기화
            this.$data.bookMarks = [];
            //레코딩초기화
            this.$data.faceRecorder = null;
            this.$data.faceRecordedBlobs = [];
            this.$data.screenRecorder = null;
            this.$data.screenRecordedBlobs = [];
            this.$data.isReplaySetting = false;

            //타임라인초기화
            this.$data.timeLine = 0;
            //플래그세팅
            this.$data.isFgtStart = true;
            //타이머시작
            this.getTimeline();

            //북마크세팅
            this.bookMark('start');

            //레코딩
            this.startFaceRecording();
            this.startScreenRecording();

        }

      },
      fgtEnd: function(){
        
        let rtn = confirm('Are you going to stop testing?')
        if(!rtn)
          return;

        //북마크세팅
        this.bookMark('end');

        //타이머해제
        clearTimeout(this.$data.timer)
        this.$data.timer = null;

        //플래그세팅
        this.$data.isFgtStart = false;
        this.$data.isFaceDetect = false;

        //레코딩정지
        this.stopRecoding();

      },

      //레코딩
      startFaceRecording: function() {

        let options = {mimeType: 'video/webm;codecs=vp9,opus'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.error(`${options.mimeType} is not supported`);
          options = {mimeType: 'video/webm;codecs=vp8,opus'};
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.error(`${options.mimeType} is not supported`);
            options = {mimeType: 'video/webm'};
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              console.error(`${options.mimeType} is not supported`);
              options = {mimeType: ''};
            }
          }
        }

        try {
          this.$data.faceRecorder = new MediaRecorder(this.$data.videoStream, options);
        } catch (e) {
          console.error('Exception while creating faceRecorder:', e);
          return;
        }

        console.log('Created faceRecorder', this.$data.faceRecorder, 'with options', options);
        this.$data.faceRecorder.onstop = (event) => {
          console.log('Recorder stopped: ', event);
          console.log('Recorded Blobs: ', this.$data.faceRecordedBlobs);
        };
        this.$data.faceRecorder.ondataavailable = this.handleFaceDataAvailable;
        this.$data.faceRecorder.start();
        console.log('faceRecorder started', this.$data.faceRecorder);

      },
      handleFaceDataAvailable: function(event) {

        console.log('handleFaceDataAvailable', event);
        if (event.data && event.data.size > 0) {
          this.$data.faceRecordedBlobs.push(event.data);
        }

      },
      startScreenRecording: function() {

        let options = {mimeType: 'video/webm;codecs=vp9,opus'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.error(`${options.mimeType} is not supported`);
          options = {mimeType: 'video/webm;codecs=vp8,opus'};
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.error(`${options.mimeType} is not supported`);
            options = {mimeType: 'video/webm'};
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              console.error(`${options.mimeType} is not supported`);
              options = {mimeType: ''};
            }
          }
        }

        try {
          this.$data.screenRecorder = new MediaRecorder(this.$data.mediaStream, options);
        } catch (e) {
          console.error('Exception while creating ScreenRecorder:', e);
          return;
        }

        console.log('Created ScreenRecorder', this.$data.screenRecorder, 'with options', options);
        this.$data.screenRecorder.onstop = (event) => {
          console.log('Recorder stopped: ', event);
          console.log('Recorded Blobs: ', this.$data.screenRecordedBlobs);
        };
        this.$data.screenRecorder.ondataavailable = this.handleScreenDataAvailable;
        this.$data.screenRecorder.start();
        console.log('ScreenRecorder started', this.$data.screenRecorder);

      },
      handleScreenDataAvailable: function(event) {

        console.log('handleScreenDataAvailable', event);
        if (event.data && event.data.size > 0) {
          this.$data.screenRecordedBlobs.push(event.data);
        }

      },
      stopRecoding: function() {

        this.$data.faceRecorder.stop();
        this.$data.screenRecorder.stop();

        setTimeout(()=>{

          const faceBuffer = new Blob(this.$data.faceRecordedBlobs, {type: 'video/webm'});
          this.$data.reFaceVideo.src = null;
          this.$data.reFaceVideo.srcObject = null;
          this.$data.reFaceVideo.src = window.URL.createObjectURL(faceBuffer);
          this.$data.reFaceVideo.controls = true;
          this.$data.reFaceVideo.play();

          const screenBuffer = new Blob(this.$data.screenRecordedBlobs, {type: 'video/webm'});
          this.$data.reScreenVideo.src = null;
          this.$data.reScreenVideo.srcObject = null;
          this.$data.reScreenVideo.src = window.URL.createObjectURL(screenBuffer);
          this.$data.reScreenVideo.controls = true;
          this.$data.reScreenVideo.play();

          this.$data.isReplaySetting = true;

          setTimeout(()=>{
            const el = this.$el.getElementsByClassName('replay')[0];
            el.scrollIntoView({behavior: 'smooth'});
          }, 500)

        }, 2000);

      },

      //다운로드
      downloadVideo: function(){
        this.downloadFace();
        this.downloadScreen();
      },
      downloadFace: function() {
          const faceBlob = new Blob(this.$data.faceRecordedBlobs, {type: 'video/webm'});
          const url = window.URL.createObjectURL(faceBlob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `face-${this.$data.uuid}.webm`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 100);
      },
      downloadScreen: function() {
          const screenBlob = new Blob(this.$data.screenRecordedBlobs, {type: 'video/webm'});
          const url = window.URL.createObjectURL(screenBlob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `screen-${this.$data.uuid}.webm`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 100);
      }
  },
  mounted(){

      console.log('===== 1. admin mounted =====')   

      this.$data.remoteVideo = document.getElementById("remoteVideo");
      this.$data.remoteMedia = document.getElementById("remoteMedia");

      this.$data.reFaceVideo = document.getElementById("reFaceVideo");
      this.$data.reScreenVideo = document.getElementById("reScreenVideo");

      //클립보드        
      if(typeof window.clipboard === 'undefined'){
        // eslint-disable-next-line no-undef
        window.clipboard = new ClipboardJS('.clipboard_url');
        window.clipboard.on('success', (e) => {
            alert("copy")
            e.clearSelection();
        });
      }

      //소켓연결
      this.$socket.connect();
      this.$data.uuid = this.generateUUID();
      this.$socket.emit('create', this.$data.uuid)

      let ctx = document.getElementById('line').getContext('2d');
      //let gradientFill = ctx.createLinearGradient(0, 0, 0, 160);
      //gradientFill.addColorStop(0, "rgba(35, 185, 255, 0.18)");
      //gradientFill.addColorStop(1, "rgba(35, 185, 255, 0)");

      this.chartConfig = chartConfig,
      this.chartConfig.data.datasets = emotionDataset;

      /* eslint-disable */
      let myChart = new Chart(ctx, this.chartConfig)
      this.$data.emotionChart = myChart;

      //클라이언트Url
      this.$data.clientUrl = `https://${window.location.host}/digisign/client/${this.$data.uuid}`;

  },
  beforeDestroy(){

        try{
          
          this.$socket.emit('leaved', this.$data.uuid);
          this.$data.videoCallee.close();
          this.$data.mediaCallee.close();          

        }catch(e){
          console.log(e)
        }

  },
  data(){
    return{

      uuid: "xxxx-xxxx-xxxx-xxxx",

      timeLine: 0,

      remoteVideo: null,
      remoteMedia: null,
      reFaceVideo: null,
      reScreenVideo: null,

      videoCallee: null,
      mediaCallee: null,

      videoStream: null,
      mediaStream: null,

      age: 0,
      gender: 0,

      center: false,

      startX: 0,
      startY: 0,
      detectWidth: 0,
      detectHeight: 0,
      score: 0,

      bookMarks: [],

      emotionChart: null,
      chartConfig: {},

      isConnectVideo: false,
      isConnectMedia: false,

      isFaceDetect: false,

      isFgtStart: false,

      timer: null,

      customButtons: [ 'Kill', 'Die', 'Gatcha', 'Getitem'],
      bookmarkPopup: false,

      emotions : [
                  "angry",
                  "disgust",
                  "fear",
                  "happy",
                  "sad",
                  "surprise",
                  "neutral"
                ],

      //레코딩
      faceRecorder: null,
      faceRecordedBlobs: [],
      screenRecorder: null,
      screenRecordedBlobs: [],

      isReplaySetting: false,

      //공유
      clientUrl: "",
      clientNXSN: 0,

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
   @import './Admin.scss';
</style>
