function AudioEngine() {
	this.interval;
	this.samplers = [];
}

AudioEngine.prototype.start = function() {
	var me = this;
	this.interval = setInterval( function() { 	
		me.audioWriter(); 
	}, bufferTime ); 
}
AudioEngine.prototype.stop = function() {
	clearInterval( this.interval );
}

AudioEngine.prototype.addSampler = function( s ) {
	this.samplers.push( s );
}
      // tick is in ms
      var tick = 120/60/16/8*1000;
      var sampleRate = 44100;
	
      var bufferSize = Math.floor(tick/1000*sampleRate);
      var bufferTime = tick; 


// Borrowed from F1LTER's code
AudioEngine.midiNoteFreq = [
	16.35,    17.32,    18.35,    19.45,    20.6,     21.83,    23.12,    24.5,     25.96,    27.5,  29.14,    30.87,
	32.7,     34.65,    36.71,    38.89,    41.2,     43.65,    46.25,    49,       51.91,    55,    58.27,    61.74,
	65.41,    69.3,     73.42,    77.78,    82.41,    87.31,    92.5,     98,       103.83,   110,   116.54,   123.47,
	130.81,   138.59,   146.83,   155.56,   164.81,   174.61,   185,      196,      207.65,   220,   233.08,   246.94,
	261.63,   277.18,   293.66,   311.13,   329.63,   349.23,   369.99,   392,      415.3,    440,   466.16,   493.88,
	523.25,   554.37,   587.33,   622.25,   659.26,   698.46,   739.99,   783.99,   830.61,   880,   932.33,   987.77,
	1046.5,   1108.73,  1174.66,  1244.51,  1318.51,  1396.91,  1479.98,  1567.98,  1661.22,  1760,  1864.66,  1975.53,
	2093,     2217.46,  2349.32,  2489.02,  2637.02,  2793.83,  2959.96,  3135.96,  3322.44,  3520,  3729.31,  3951.07,
	4186.01,  4434.92,  4698.64,  4978 
];

	 var sequence1 = [ 1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0 ];
	 var sequence2 = [ 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0 ];

      // Setup audio channel
      var output = new Audio();
      output.mozSetup(1, sampleRate);


		var tick = 0;

AudioEngine.prototype.audioWriter = function() {
	if( tick % 8 == 0 && sequence1[ tick % 128 / 8 ] == 1 ) {
		this.trigger( this.samplers[0] );
	} 
	/*
	if( tick % 8 == 0 && sequence2[ tick % 128 / 8 ] ) {
		trigger( s2 );
	} 
	*/

	var additiveSignal = new Float32Array(bufferSize);
  
	for( var i=0; i < this.samplers.length; i++ ) {
		var s = this.samplers[i];
		if ( s.envelope.isActive() ) {
		  s.generate();
		  mix( s.applyEnvelope(), additiveSignal );
		}
	}
  
	  output.mozWriteAudio(additiveSignal);

	tick++;
};

AudioEngine.prototype.trigger = function( sampler ) {
  sampler.envelope.noteOn();
  sampler.setFreq(440);

	setTimeout( function() {
	  sampler.envelope.noteOff();
		sampler.reset();
	}, 1000);
  }

      
	// mix buf1 into buf2
	function mix( buf1, buf2 ) {
		for( var i=0; i < buf1.length; i++ ) {
			buf2[i] = ( buf1[i] + buf2[i] ) / 2;
		}	
	}

