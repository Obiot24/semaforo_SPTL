var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var users = [];
var traffic_light = [];

io.on('connection', function(socket){

  console.log(socket.id)
    if(socket.handshake.query.group == "web"){
      users.push(socket.id)
    }else if(socket.handshake.query.group == "traffic_light"){
      traffic_light.push({id: socket.id, name: socket.handshake.query.name})
    }

    socket.on('traffic_light', function(data){
        if(data.traffic_light == 1 ||data.traffic_light == 2 || data.traffic_light == 3 || data.traffic_light == 4){
          let traffic_light_Temp = traffic_light.find(x => x.name == data.name)
          if(traffic_light_Temp){
            io.to(traffic_light_Temp.id).emit('emergency_traffic_light', data.traffic_light);
          }
        }
    });

    socket.on('disconnect', function () {
      console.log("DESCONECTO " + socket.id)
      if(socket.handshake.query.group == "web"){
        users.splice(users.findIndex(x => x === socket.id),1)
      }else if(socket.handshake.query.group == "traffic_light"){
        traffic_light.splice(traffic_light.findIndex(x => x.id === socket.id),1)
      }
    });

});

http.listen(80);