import express from 'express';
import WebSocket,{WebSocketServer} from 'ws';
import http from 'http';
const app=express();
app.use(express.static('public'));
const server=http.createServer(app);
const wss=new WebSocketServer({server});
wss.on('connection',ws=>{
    console.log('Client connected');
    ws.on('message',message=>{
        wss.clients.forEach(client=>{
            if(client!==ws&&client.readyState===WebSocket.OPEN){
                client.send(message);
            }
        })
    });
    ws.on('close',()=>{
        console.log('Client disconnected');
    });
});
server.listen(8080,"0.0.0.0",()=>{
    console.log('Server is listening on port http://localhost:8080');
});