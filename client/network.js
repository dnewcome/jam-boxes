/*globals io: true */
var Network = (function() {
  var Network = function() {
    var socket = io.connect('http://localhost');
    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });

    socket.emit('join');
  }

  return Network;
}());
