const io = require('socket.io')(process.env.PORT || 3000, { //8124 is the local port we are binding the pingpong server to
  pingInterval: 30005,		//An interval how often a ping is sent
  pingTimeout: 5000,		//The time a client has to respont to a ping before it is desired dead
  upgradeTimeout: 3000,		//The time a client has to fullfill the upgrade
  allowUpgrades: true,		//Allows upgrading Long-Polling to websockets. This is strongly recommended for connecting for WebGL builds or other browserbased stuff and true is the default.
  cookie: false,			//We do not need a persistence cookie for the demo - If you are using a load balöance, you might need it.
  serveClient: true,		//This is not required for communication with our asset but we enable it for a web based testing tool. You can leave it enabled for example to connect your webbased service to the same server (this hosts a js file).
  allowEIO3: false,			//This is only for testing purpose. We do make sure, that we do not accidentially work with compat mode.
  cors: {
    origin: "*"				//Allow connection from any referrer (most likely this is what you will want for game clients - for WebGL the domain of your sebsite MIGHT also work)
  }
});

let playerInfo={

  socketId: "null",
  playerId: "null",
  roomName: "null",
  name:"",

   health: 100,
   pos:{x:0.0,y:0.0,z:0.0},
   rot: {x:0.0,y:0.0,z:0.0}
};

let listPlayerInfo=[];

let room ={
  name:"null",
  maxPlayer:0
};


room1=room;

room1.name="sala1";
room1.maxPlayer=2;

function RegisterPlayer(json={}, socketId, socket){
  console.log("Registrando player...");
  if (listPlayerInfo.length>=2) {
    console.log("Room is full");
    console.log("Room: "+ listPlayerInfo.length + "/"+room1.maxPlayer);
    console.log("Player: "+ json.name + " se FU...");
    return;
  }
  else{

    
    
      let isInList=false;
      
      for (let i = 0; i < listPlayerInfo.length; i++) {
      if(listPlayerInfo[i] && listPlayerInfo[i].playerId==json.playerId){
        isInList=true;
      }    
    }
    
    if(!isInList){
      json.roomName=room1.name;
      json.playerId=000+listPlayerInfo.length+1;
      json.socketId = socketId;
      json.health = playerInfo.health;
      listPlayerInfo.push(json);
      socket.emit("player-connect", json)
      console.log("Player "+json.name+" entrou na sala ("+ listPlayerInfo.length + "/"+room1.maxPlayer+")");
      //console.log("PlayerInfo: "+ JSON.stringify(json));
      

    }
  }

}

function RemovePlayer(socket){
  console.log("Removendo player...");
  let index=-1;
  json=playerInfo;
  if (listPlayerInfo.length>0) {
    for (let i = 0; i < listPlayerInfo.length; i++) {
      if(listPlayerInfo[i] && listPlayerInfo[i].socketId == socket.id){
        index=i;
        json=listPlayerInfo[i];
        //console.log("Player: "+JSON.stringify(listPlayerInfo[i]));
        break;
      }
      
    }
  }

  if(index!=-1){
    listPlayerInfo.splice(index);
    console.log("Player: "+json.name+" saiu da sala.");
  }

}


// App Code starts here
console.log('Server is running!');

io.on('connection', (socket) => {


    // EMIT AREA -------------------------------------
    //io.emit("A","FUNCIONA!");







    // RECEIVE AREA  -------------------------------
    socket.on('B', (data) => {
      console.log(data);
    });
    
  
    socket.on('JOIN_ROOM', (data) => {
      //console.log(data);
      RegisterPlayer(data, socket.id, socket)
      // console.log("ListPlayerInfo: "+ listPlayerInfo.length);
      // console.log("PlayerInfo: "+ JSON.stringify(playerInfo));
      // console.log("Socket: "+ JSON.stringify(data));
    });






    socket.on('disconnect', (reason) => {
      console.log('[' + (new Date()).toUTCString() + '] ' + socket.id + ' disconnected: ' + reason);
      RemovePlayer(socket);
      socket.broadcast.emit("player-disconnect", socket.id);
    });

});



// console.log("Player: "+ JSON.stringify(playerInfo));