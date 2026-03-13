const videoElem=document.getElementById('video');
videoElem.muted = true;
videoElem.play().catch(console.error);
const mediaSource=new MediaSource();
videoElem.src=URL.createObjectURL(mediaSource);
let sourceBuffer;
const queue=[];
mediaSource.addEventListener('sourceopen',()=>{
    const mimeType = 'video/webm;codecs=vp8';
    if (!MediaSource.isTypeSupported(mimeType)) {
    throw new Error(`MediaSource does not support ${mimeType}`);
    }
    sourceBuffer=mediaSource.addSourceBuffer(mimeType);
    sourceBuffer.addEventListener('updateend',()=>{
        if(queue.length>0 && !sourceBuffer.updating){
            sourceBuffer.appendBuffer(queue.shift());
        }
    })
    const ws=new WebSocket('ws://localhost:8080');
    ws.binaryType='arraybuffer';
    ws.onmessage=e=>{
        const chunk= new Uint8Array(e.data);
        if (!sourceBuffer || mediaSource.readyState !== "open") return;
        if(sourceBuffer.updating || queue.length>0){
        queue.push(chunk);
        }else{
        sourceBuffer.appendBuffer(chunk);
        }
    }
});