var ae = new AudioEngine();

// TODO: we are hard coding the instruments here
ae.createSampler( 'cymbal', '../audio/1.wav' );
ae.createSampler( 'snare', '../audio/sn.wav' );

function start() { 
	ae.start();
}
function stop() {
	ae.stop();
}
