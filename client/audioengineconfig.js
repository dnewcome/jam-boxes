var ae = new AudioEngine();

var SAMPLES = [
  'bass',
  'bass2',
  'guitar',
  'acid'
];

ae.overrideProviderKey = SAMPLES[0];	// this should be the SAMPLE name for the local user

// TODO: we are hard coding the instruments here
ae.createSampler( 'guitar', '../audio/guitar.wav' );
ae.createSampler( 'bass', '../audio/101-BS02.WAV' );
ae.createSampler( 'bass2', '../audio/101-BS06.WAV' );
ae.createSampler( 'acid', '../audio/ODY-ACD1.WAV' );

function start() {
	ae.start();
}
function stop() {
	ae.stop();
}
