var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');

var dbPath="mongodb://localhost/connectDB";

db = mongoose.connect(dbPath);

var Chat= require('./models/Chat.js');
var chatModel = mongoose.model('Chat');

app.get('/', function(req, res){

  res.sendFile(__dirname + '/index.html');

});


app.get('/chatroom',function(req,res){
  res.sendFile('/chatroom.html');

});

app.get('/logout',function(req,res){
      

    });//end logout

  io.on('connection', function(socket){
  //socket.broadcast.emit('chat message', 'A new user has just joined the chat');

  socket.on('user',function(data){
    //console.log(data);
    console.log(data+" came online");
    socket.broadcast.emit('chat message', data+" came online");
    // you can allocate variables in socket.
    socket.user = data;
  });

  socket.on('loadMore',function(){
    var stream = chatModel.find().sort({ _id : 1 }).stream();
    stream.on('data', function (chat) { 
      socket.emit('chat message',chat.creator+' : '+ chat.content); });
  });

 socket.on('typing', function () {
      socket.broadcast.emit('log message',socket.user + ' is typing');
    });


    socket.on('chat message', function(msg){
      socket.broadcast.emit('log message',socket.user + ' sent a message');
    io.emit('chat message', socket.user +' : '+msg);
     var newMessage = new chatModel({
                creator             :socket.user ,
                content             :msg              
            });// end new user
     var today= Date.now();       
     newMessage.createdOn=today;
     newMessage.save( function(error){
  if(error)
  { 
    console.log(error);
  }
  else
  {
    console.log("new message inserted:"+newMessage);
  }
});
  

  });
     socket.on('logout',function(){
  	 console.log(socket.user+" left the chat");
     socket.broadcast.emit('log message',socket.user + ' left the chatroom');
     socket.broadcast.emit('chat message', socket.user+" has logged out");
  }); //end socket disconnected
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
