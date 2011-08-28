/*globals io: true */
var Network = (function() {
  var Network = function() {
    var jamid = 'pimpin';
    var socket = io.connect();

    socket.emit('join', { jamid: jamid });

    socket.on("joinack", function(data) {
      if(jamid && data.jamid != jamid) {
        alert('requested room was full - requested: ' + jamid + " in: " +
        data.jamid);
      }
      me.emit("localuserjoined", data);
    });

    var me=this;
    socket.on('userupdate', function(data) {
      me.emit("userupdate", data);
    });

	  function broadcast() {
      socket.emit('broadcast', userData);
	  }
	  setInterval( broadcast, 10000 );
  }

  Network.prototype = new EventEmitter();

  return Network;
}());
