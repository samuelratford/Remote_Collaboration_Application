// This code is written by Samuel Ratford in its entirety

const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// THis is done so that a .env file containing sensitive data can be includedm rather than used inline
require("dotenv").config();

const port = process.env.PORT || 4000;

// The following statement sets the middleware of express, it teslls the server to accept all CORS requests. This may not be necessary as the applicaiton is run on a local network but would be required if accessible across the web.
app.use(cors());

// This statement tells the server that it may receive incoming requests in JSON form (e.g. form data)
app.use(express.json());

const usersRouter = require('./routes/users');
const extensionsRouter = require('./routes/extensions');

app.use('/users', usersRouter);
app.use('/extensions', extensionsRouter);

io.on("connection", (socket) => {
  socket.on("createRoom", roomID => {
    if (roomID in io.sockets.adapter.rooms) {
      socket.emit("createdRoom", false)
    } else {
      socket.join(roomID);
      socket.emit("createdRoom", true);
    }
  })

  socket.on("joinRoom", roomID => {
    if (roomID in io.sockets.adapter.rooms) {
      socket.join(roomID);
      socket.emit("joinedRoom", true);
    } else {
      socket.emit("joinedRoom", false)
    }
  })

  socket.on("newJoin", data => {
    socket.to(data.roomID).broadcast.emit("userJoined", {
      id: socket.id,
      username: data.username
    })
  })

  socket.on("addUser", data => {
    io.to(data.dest).emit("addUser", {
      id: data.id,
      username: data.username
    })
  })


  // Voice and Video Chat
  socket.on("offerVideo", data => {
    socket.to(data.roomID).broadcast.emit('offerVideo', data);
  })

  socket.on("answerVideo", data => {
    socket.to(data.roomID).broadcast.emit('answerVideo', data);
  })

  socket.on("send_ice_candidate_video", (data) => {
    socket.to(data.roomID).broadcast.emit("send_ice_candidate_video", data);
  });

  socket.on("extensionEmit", (data) => {
    socket.to(data.roomID).broadcast.emit("extensionEmit", data);
  });

  socket.on("extensionEmitToID", (data) => {
    io.to(data.id).emit("extensionEmitToID", data);
  });

  socket.on("extensionEmitVolatile", (data) => {
    socket.volatile.to(data.roomID).broadcast.emit("extensionEmitVolatile", data);
  });

  socket.on("socketSendToSelf", (data) => {
    socket.emit("socketSendToSelf", data);
  });

  socket.on('disconnecting', () => {
    for (key in Object.keys(socket.rooms)) {
      if (key !== socket.id) {
        socket.to(key).broadcast.emit("leaving", socket.id);
      }
    }
  });

});

server.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
