const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 80;
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/control', (req, res) => {
  res.sendFile(__dirname + '/control.html');
});

app.get('/premio', (req, res) => {
  res.sendFile(__dirname + '/premio.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', function () {
        console.log('Socket control disconnected: ' + socket.id);
    });

    socket.on('changeStep', function (step) {
      io.emit('setStep', step);
      console.log('changeStep: ' + step);
    });

    socket.on('selectReward', function (reward) {
      io.emit('setReward', reward);
      console.log('setReward: ' + reward);
    });

    socket.on('sendRewardWithCode', function (data) {
      io.emit('showRewardWithCode', data);
      console.log('showRewardWithCode: ' + data);
    });

});

app.use(express.static(path.join(__dirname, 'assets')));

server.listen(port, () => {
  console.log('listening Server on *:' + port.toString());
});