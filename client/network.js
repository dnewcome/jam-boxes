/*globals io: true */
var Network = (function() {
  function getUrlVars() {
    var vars = {}, hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars[hash[0]] = hash[1];
    }
    return vars;
  }


  var Network = function() {
    var urlParams = getUrlVars();
    var jamid = urlParams['jamid'] || undefined;
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
