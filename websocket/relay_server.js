const WebSocket = require('ws');
const fs = require('fs');
const recordingPath = 'app_audio';
const port = 3009

console.log(`listening on port ${port}, writing incoming raw audio to file ${recordingPath}.raw`);

const wss = new WebSocket.Server({ port: port });
wss.on('connection', (socket, req) => {

    let wstream, reads = 0;
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    console.log(new Date() + `, received connection from ${socket._socket._handle.fd}(${ clientIp })`);

    var connectionTime = (new Date()).getTime();
    wstream = fs.createWriteStream(recordingPath + "_" + connectionTime + ".raw");

    socket.on('message', (message) => {
        if (typeof message === 'string') {
            console.log(new Date() + `, received String  message: ${message}`);
        } else if (message instanceof Buffer) {
            console.log(new Date() + `, received Buffer message: `);
            reads++;
            wstream.write(message);
        } else {
            console.log(new Date() + `, received etc message: ${message}`);
            reads++;
            wstream.write(message);
        }
    });

    socket.on('close', (code, reason) => {
        console.log(new Date() + `, ws closed with reason ${code}:${reason}; received ${reads} binary frames`);
        wstream.end();
    });
    socket.on('error', (code, reason) => {
        console.log(new Date() + `, ws error with reason ${code}:${reason}; received ${reads} binary frames`);
        wstream.end();
    });

});