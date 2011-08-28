var ae = new AudioEngine();

var SAMPLES = [
  'bass',
  'cymbal',
  'snare'
];
// TODO: we are hard coding the instruments here
ae.createSampler( 'cymbal', '../audio/1.wav' );
ae.createSampler( 'snare', '../audio/sn.wav' );
ae.createSampler( 'bass', '../audio/101-BS02.WAV' );

function start() {
	ae.start();
}
function stop() {
	ae.stop();
}
