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
const ws=new WebSocket('ws://localhost:8080');
    const mimeType = 'video/webm;codecs=vp8';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
    throw new Error(`MediaRecorder does not support ${mimeType}`);
    }
const recorder=new MediaRecorder(stream,{mimeType:mimeType});
recorder.ondataavailable=e=>{
    if(e.data.size>0) ws.send(e.data);
}
recorder.start(100);
};
startElem.addEventListener('click',startStream);