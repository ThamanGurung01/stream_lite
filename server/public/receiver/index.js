const videoElem=document.getElementById('video');
videoElem.muted = true;
const ws=new WebSocket('ws://192.168.137.1:8080');
    ws.binaryType='arraybuffer';
    ws.onopen = () => console.log("Receiver WS connected");
ws.onerror = (e) => console.error("Receiver WS error:", e);

const mediaSource=new MediaSource();
videoElem.src=URL.createObjectURL(mediaSource);
let sourceBuffer;
const queue=[];
mediaSource.addEventListener('sourceopen',()=>{
    const mimeType = [
    'video/webm;codecs=vp8',
    'video/mp4;codecs="avc1.42E01E"',
    ];
    sourceBuffer=mediaSource.addSourceBuffer(mimeType[1]);
    sourceBuffer.addEventListener('updateend',()=>{
        if(queue.length>0 && !sourceBuffer.updating){
            sourceBuffer.appendBuffer(queue.shift());
        }
videoElem.play().catch(console.error);
    })
    ws.onmessage=e=>{
        if (!sourceBuffer || mediaSource.readyState !== "open") return;
        const chunk= new Uint8Array(e.data);
        if(sourceBuffer.updating || queue.length>0){
        queue.push(chunk);
        }else{
        sourceBuffer.appendBuffer(chunk);
        }
    }
});