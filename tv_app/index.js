var videoElem = document.getElementById('video');
videoElem.muted = true;

if (window.webOS) {
    webOS.service.request('luna://com.webos.service.tv.inputmanager', {
        method: 'setPointerVisibility',
        parameters: { visible: true },
        onSuccess: function (res) { console.log('Pointer enabled:', res); },
        onFailure: function (err) { console.error('Failed to enable pointer:', err); }
    });
}

console.log('TV app loaded, video element:', videoElem);

var ws = new WebSocket('ws://192.168.137.1:8080');
ws.binaryType = 'arraybuffer';
ws.onopen = function () { console.log('Receiver WS connected'); };
ws.onerror = function (e) { console.error('Receiver WS error:', e); };

var mediaSource = new MediaSource();
videoElem.src = URL.createObjectURL(mediaSource);
var sourceBuffer;
var queue = [];

mediaSource.addEventListener('sourceopen', function () {
    var mimeType = [
        'video/webm;codecs=vp8',
        'video/mp4;codecs="avc1.42E01E"'
    ];
    sourceBuffer = mediaSource.addSourceBuffer(mimeType[0]);
    sourceBuffer.addEventListener('updateend', function () {
        if (queue.length > 0 && !sourceBuffer.updating) {
            sourceBuffer.appendBuffer(queue.shift());
        }
        var playResult = videoElem.play();
        if (playResult && typeof playResult.catch === 'function') {
            playResult.catch(function (err) { console.error(err); });
        }
    });
    ws.onmessage = function (e) {
        if (!sourceBuffer || mediaSource.readyState !== 'open') return;
        var chunk = new Uint8Array(e.data);
        if (sourceBuffer.updating || queue.length > 0) {
            queue.push(chunk);
        } else {
            sourceBuffer.appendBuffer(chunk);
        }
    };
});