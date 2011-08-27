var ae = new AudioEngine();
ae.createSampler( 'cymbal', '../audio/1.wav' );
ae.createSampler( 'snare', '../audio/sn.wav' );

ae.addSequence(	'cymbal',  [ 1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0 ] );
ae.addSequence(	'snare', [ 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0 ] );

function start() { 
	ae.start();
}
function stop() {
	ae.stop();
}
