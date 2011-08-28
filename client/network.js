/*globals io: true */
var Network = (function() {
  var Network = function() {
    var roomid = 'pimpin';
    var socket = io.connect();

    socket.emit('join', { roomid: roomid });

    var me=this;
    socket.on('userupdate', function(data) {
      me.emit("userupdate", data);
    });

	  function broadcast() {
      userData.roomid = roomid;
      socket.emit('broadcast', userData );
	  }
	  setInterval( broadcast, 10000 );
  }

  Network.prototype = new EventEmitter();

  return Network;
}());
