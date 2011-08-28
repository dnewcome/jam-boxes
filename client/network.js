/*globals io: true */
var Network = (function() {
  var Network = function() {
    var roomid = 'pimpin';
    var socket = io.connect();

    socket.emit('join', { roomid: roomid });

    var me=this;
    socket.on('userupdate', function(data) {
      console.log('received a userupdate: ' + data.name);
      me.emit("userupdate", data);
    });

	  function broadcast() {
      console.log('broadcasting user data: ' + userData.name);
      userData.roomid = roomid;
      socket.emit('broadcast', userData );
	  }
	  setInterval( broadcast, 10000 );
  }

  Network.prototype = new EventEmitter();

  return Network;
}());
