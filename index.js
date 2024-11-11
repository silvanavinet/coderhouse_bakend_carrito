const express = require('express')
const { createServer } = require("http");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");

// Express Ap
const app = express();
const port = 8080

app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer);


app.set('socketio', io);

// Setup Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "src/views");

// Serve static files
app.use(express.static("public"));

app.use(function(req, res, next) {
  req.io = io;
  next();
});

app.use('/', require('./src/routes/index'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/carts', require('./src/routes/carts'));


const realtime = io.of("/realtimeproducts");
// Socket.IO
realtime.on("connection", (socket) => {
  console.log("a user connected");
  
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("message", (data) => {
    console.log("Server Received message:", data);
    io.emit("message", data);
  });
});


httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})