function BitCrusher(sampleRate, bits){
	var	self	= this,
		sample  = 0.0;
	self.sampleRate	= sampleRate;
	self.resolution	= bits ? Math.pow(2, bits-1) : Math.pow(2, 8-1); // Divided by 2 for signed samples (8bit range = 7bit signed)
	self.pushSample	= function(s){
		sample	= Math.floor(s*self.resolution+0.5)/self.resolution
		return sample;
	};
	self.getMix = function(){
		return sample;
	};
}

function IIRFilter(samplerate, cutoff, resonance, type){
	var	self	= this,
		f	= [0.0, 0.0, 0.0, 0.0],
		freq, damp,
		prevCut, prevReso,

		sin	= Math.sin,
		min	= Math.min,
		pow	= Math.pow;

	self.cutoff = !cutoff ? 20000 : cutoff; // > 40
	self.resonance = !resonance ? 0.1 : resonance; // 0.0 - 1.0
	self.samplerate = samplerate;
	self.type = type || 0;

	function calcCoeff(){
		freq = 2 * sin(Math.PI * min(0.25, self.cutoff / (self.samplerate * 2)));
		damp = min(2 * (1 - pow(self.resonance, 0.25)), min(2, 2 / freq - freq * 0.5));
	}

	self.pushSample = function(sample){
		if (prevCut !== self.cutoff || prevReso !== self.resonance){
			calcCoeff();
			prevCut = self.cutoff;
			prevReso = self.resonance;
		}

		f[3] = sample - damp * f[2];
		f[0] = f[0] + freq * f[2];
		f[1] = f[3] - f[0];
		f[2] = freq * f[1] + f[2];

		f[3] = sample - damp * f[2];
		f[0] = f[0] + freq * f[2];
		f[1] = f[3] - f[0];
		f[2] = freq * f[1] + f[2];

		return f[self.type];
	};

	self.getMix = function(type){
		return f[type || self.type];
	};
}


function Distortion(sampleRate) // Based on the famous TubeScreamer.
{
	var	hpf1	= new IIRFilter(sampleRate, 720.484),
		lpf1	= new IIRFilter(sampleRate, 723.431),
		hpf2	= new IIRFilter(sampleRate, 1.0),
		smpl	= 0.0;
	this.gain = 4;
	this.master = 1;
	this.sampleRate = sampleRate;
	this.filters = [hpf1, lpf1, hpf2];
	this.pushSample = function(s){
		hpf1.pushSample(s);
		smpl = hpf1.getMix(1) * this.gain;
		smpl = Math.atan(smpl) + smpl;
		if (smpl > 0.4){
			smpl = 0.4;
		} else if (smpl < -0.4) {
			smpl = -0.4;
		}
		lpf1.pushSample(smpl);
		hpf2.pushSample(lpf1.getMix(0));
		smpl = hpf2.getMix(1) * this.master;
		return smpl;
	};
	this.getMix = function(){
		return smpl;
	};
}

function Compressor(sampleRate, scaleBy, gain){
	var	self	= this,
		sample  = 0.0;
	self.sampleRate	= sampleRate;
	self.scale	= scaleBy || 1;
	self.gain	= gain || 0.5;
	self.pushSample = function(s){
		s	/= self.scale;
		sample	= (1 + self.gain) * s - self.gain * s * s * s;
		return sample;
	};
	self.getMix = function(){
		return sample;
	};
}

function AudioEngine() {
	this.interval;
	this.samplers = {};
	this.sequences = {};
	this.effectsData = {};
	this.lowpassFilters = {};
	this.bitCrushers = {};
	this.distortions = {};

	this.isMute = {};
	this.isSolo = {};

	this.sampleRate = 44100;
	// tick length is hard coded to 120bpm
	// ends up being about 62ms
	this.tickTime = 120/60/16/8*1000;
	this.bufferTime = this.tickTime;
	this.bufferSize = Math.floor(this.tickTime/1000*this.sampleRate);

      // Setup audio channel
	this.output = new Audio();
	this.output.mozSetup( 1, this.sampleRate );

	this.tick = 0;
	this.numSamplesWritten = 0;
	this.prebufferSize = this.sampleRate/2;

	this.overrideProvider = undefined;
	this.overrideProviderKey = undefined;

	this.tickDelay = 32;

	this.outputFilter = new IIRFilter(44100, 5000, 0, 0);
	this.outputCompressor = new Compressor(44100);
	this.outputCompressor.gain = 1.0;

	
}

AudioEngine.prototype = new EventEmitter();

AudioEngine.prototype.start = function() {
	var me = this;
	this.interval = setInterval( function() {
		me.updateAudio();
	}, this.bufferTime );
}
AudioEngine.prototype.stop = function() {
	clearInterval( this.interval );
}

AudioEngine.prototype.addSampler = function( name, sampler ) {
	this.samplers[name] =  sampler;
	this.lowpassFilters[name] = new audioLib.LowPassFilter(44100, 2500, 0.5);
	this.bitCrushers[name] = new BitCrusher(44100, 12);
	this.distortions[name] = new Distortion(44100);
	this.distortions[name].gain = 8;
	this.isMute[name] = false;
	this.isSolo[name] = false;
}

AudioEngine.prototype.registerMuteSoloEmitter = function(emitter) {
	var that = this;
	emitter.on("mute", function(ownerId, isMute) {
		var name = SAMPLES[ownerId];
		that.isMute[name] = isMute;
	});

	emitter.on("solo", function(ownerId, isSolo) {
		var name = SAMPLES[ownerId];
		that.isSolo[name] = isSolo;
	});
}

/**
 * convenience method for creating a new sampler and
 * adding it to the list of audio generators.
 * The name is used when looking for performance data
 */
AudioEngine.prototype.createSampler = function( name, wavfile ) {
	var s = new Sampler(wavfile, this.bufferSize, this.sampleRate);
	s.envelope = new ADSR(0, 0, 1, this.tickTime*8/1000, 0, this.sampleRate);
	// turn off so it does not trigger immediately
	s.envelope.disable();
	this.addSampler( name, s );
}

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


/**
 * Add a sequence for an instrument generator.
 * Name is the name of the generator,
 * seq is the array of notes.
 */
AudioEngine.prototype.addSequence = function( name, seq ) {
	this.sequences[name] = seq;
}

AudioEngine.prototype.addEffectsData = function( name, cc ) {
	this.effectsData[name] = cc;
}

AudioEngine.prototype.updateAudio = function() {
	var tick = this.tick - this.tickDelay;
	if (tick >=0) {
		this.emit('tick', tick);
	}

	this.writeAudio();
	this.tick++;
}

AudioEngine.prototype.writeAudio = function() {
	// start out with empty buffer
	var outBuffer = new Float32Array(this.bufferSize);
	for (var i=0; i<this.bufferSize; i++) {
		outBuffer[i] = 0;
	}

	// take a look at tick position to find out if we need to
	// trigger any generators

	//var tick = this.tick - this.tickDelay;
	var tick = this.tick;
	if (tick >= 0) {
		if( tick % 8 == 0 ) {
			for( var seq in this.sequences ) {
				var sequence = this.sequences[ seq ];
				if( sequence[ tick % 256 / 8 ] != null ) {
	
					// retrigger
					this.samplers[seq].envelope.noteOff();
					this.samplers[seq].reset();
					this.trigger(
						this.samplers[ seq ],
						AudioEngine.midiNoteFreq[sequence[ tick % 256 / 8 ] ] + 12
					);
				}
			}
		}

		// generate the sample data for any playing generators
		for( var key in this.samplers ) {
			if (this.isMute[key]) {
				continue;
			}
			var sampler = this.samplers[key];
			if ( sampler.envelope.isActive() ) {
				sampler.generate();
				var buffer = sampler.applyEnvelope();

				var effectsData;
				if (key == this.overrideProviderKey && typeof this.overrideProvider !== 'undefined') {
					effectsData = this.overrideProvider.getOverrideValue();
				}
				else {
					effectsData = this.effectsData[key][tick % 256];
				}
				var val1 = effectsData[0];
				var val2 = 1.-effectsData[1];
	
				var cutoff = val1 * 5000 + 500;
		      	//var resonance = .5*val2 + .3;
		      	var resonance = 0.8;
				var lowpassFilter = this.lowpassFilters[key];
				lowpassFilter.cutoff = cutoff;
				lowpassFilter.resonance = resonance;

				var bits = val2*24;
				var bitCrusher = this.bitCrushers[key];
				bitCrusher.resolution = bits ? Math.pow(2, bits-1) : Math.pow(2, 8-1);

				var distortion = this.distortions[key];
				distortion.gain = val2*16;
	
				for( var j=1; j < buffer.length; j++ ) {
					buffer[j] = lowpassFilter.pushSample( buffer[j] );
					buffer[j] = bitCrusher.pushSample( buffer[j] );
					buffer[j] = distortion.pushSample( buffer[j] );
				}
	
				outBuffer = DSP.mixSampleBuffers(buffer, outBuffer, false, 1);
			}
		}

		this.outputCompressor.scale = Object.keys(this.samplers).length;
		for (var j=1; j < outBuffer.length; j++) {
			outBuffer[j] = this.outputCompressor.pushSample(outBuffer[j]);
			outBuffer[j] = this.outputFilter.pushSample(outBuffer[j]);
		}
	}

	// flush the buffer
    this.output.mozWriteAudio([]);

	var numSamplesLeft = outBuffer.length;
	while (numSamplesLeft > 0) {
		var numSamplesWritten = this.output.mozWriteAudio(outBuffer);
		this.numSamplesWritten = this.numSamplesWritten + numSamplesWritten;
		numSamplesLeft = numSamplesLeft - numSamplesWritten;
		outBuffer = outBuffer.subarray(numSamplesWritten);
	}

	var currentPosition = this.output.mozCurrentSampleOffset();

	var available = currentPosition + this.prebufferSize - this.numSamplesWritten;

	if (available > 0) {
		this.writeAudio();
	}
};

AudioEngine.prototype.trigger = function( sampler, freq ) {
  sampler.envelope.noteOn();
  sampler.setFreq(freq);

/*	setTimeout( function() {
	  sampler.envelope.noteOff();
		sampler.reset();
	}, 1000);*/
  }


// mix buf1 into buf2
AudioEngine.prototype.mix = function( buf1, buf2 ) {
	for( var i=0; i < buf1.length; i++ ) {
		buf2[i] = ( buf1[i] + buf2[i] ) / 2;
	}
}

