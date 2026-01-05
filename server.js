const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const db = require('./config/db');

app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/student', require('./routes/student'));
app.use('/teacher', require('./routes/teacher'));
app.use('/parent', require('./routes/parent'));
app.use('/admin', require('./routes/admin'));

// Socket.io for chat
io.on('connection', socket => {
  socket.on('sendMessage', data => {
    const { sender_id, receiver_id, message } = data;
    db.query('INSERT INTO chat (sender_id, receiver_id, message) VALUES (?,?,?)',
      [sender_id, receiver_id, message]
    );
    io.to(receiver_id).emit('receiveMessage', data);
  });
});

http.listen(3000, () => console.log('RKA Portal running on port 3000'));
