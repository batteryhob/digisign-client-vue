# digisign-client


## 해당 프로젝트
> 디지털사이니지 프로젝트
> WebRTC 영상과 프레임 단위의 비전 인퍼런스 결과를 함꼐 보여주는 샘플 프로젝트
> 백엔드 서버는 tensorflow + flask + socketio 구성되어있다.


## 프로세스
> 1. webrtc 피어커넥션 연결
> 2. 로컬스트림 캡처(canvas)
> 3. webrtc 시그널링 서버로 소켓에 base64 image string 전송
> 4. 서버에서 inference(tensorflow) 소켓으로 다시 클라이언트로 전송
> 5. 리모트스트림과 inference 결과를 함께 출력