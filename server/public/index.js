const startElem=document.getElementById("start");
const startStream=async()=>{
const stream=await navigator.mediaDevices.getDisplayMedia({
      video: {
    frameRate: { ideal: 30, max: 60 },
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  },
  audio: false
});
const ws=new WebSocket('ws://192.168.137.1:8080');
    const mimeType = [
    'video/webm;codecs=vp8',
    'video/mp4;codecs="avc1.42E01E"'
    ];
const recorder=new MediaRecorder(stream,{mimeType:mimeType[0]});
recorder.ondataavailable=e=>{
    if(e.data.size>0) ws.send(e.data);
}
recorder.start(250);
};
startElem.addEventListener('click',startStream);