/*globals io: true */
var Network = (function() {
  var Network = function() {
    var socket = io.connect();
    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });

    socket.emit('join');

	  function broadcast() {
		console.log('broadcasting user data');
		console.log( userData );
		socket.emit('broadcast', userData );
	  }
	  setInterval( broadcast, 1000 );
  }

  return Network;
}());
