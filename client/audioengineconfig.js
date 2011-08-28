var ae = new AudioEngine();

var SAMPLES = [
  'bass',
  'guitar',
  'snare'
];

ae.overrideProviderKey = SAMPLES[0];	// this should be the SAMPLE name for the local user

// TODO: we are hard coding the instruments here
ae.createSampler( 'guitar', '../audio/guitar.wav' );
ae.createSampler( 'snare', '../audio/sn.wav' );
ae.createSampler( 'bass', '../audio/101-BS02.WAV' );

function start() {
	ae.start();
}
function stop() {
	ae.stop();
}
