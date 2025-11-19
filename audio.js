class AudioController {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.muted = false;
        this.bgmOscillators = [];
        this.bgmInterval = null;
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopBGM();
            if (this.ctx.state === 'running') {
                this.ctx.suspend();
            }
        } else {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            this.playBGM();
        }
        return this.muted;
    }

    playTone(freq, type, duration, startTime = 0, vol = 0.1) {
        if (this.muted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + startTime);
        osc.stop(this.ctx.currentTime + startTime + duration);
    }

    playBGM() {
        if (this.muted || this.bgmInterval) return;

        // Simple procedural loop
        const melody = [
            { f: 392.00, d: 0.2 }, // G4
            { f: 523.25, d: 0.2 }, // C5
            { f: 392.00, d: 0.2 }, // G4
            { f: 329.63, d: 0.2 }, // E4
            { f: 349.23, d: 0.2 }, // F4
            { f: 293.66, d: 0.2 }, // D4
            { f: 261.63, d: 0.4 }, // C4
            { f: 0, d: 0.2 }       // Rest
        ];

        let noteIndex = 0;

        const playNextNote = () => {
            if (this.muted) return;
            const note = melody[noteIndex];
            if (note.f > 0) {
                this.playTone(note.f, 'sine', note.d, 0, 0.05);
            }
            noteIndex = (noteIndex + 1) % melody.length;
        };

        this.bgmInterval = setInterval(playNextNote, 300);
    }

    stopBGM() {
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
    }

    playShoot() {
        // Quick high pitch pew
        this.playTone(600, 'square', 0.1, 0, 0.05);
        this.playTone(400, 'square', 0.1, 0.05, 0.05);
    }

    playHit() {
        // Low thud
        this.playTone(100, 'sawtooth', 0.1, 0, 0.05);
    }

    playSun() {
        // High chime
        this.playTone(1000, 'sine', 0.3, 0, 0.1);
        this.playTone(1500, 'sine', 0.3, 0.1, 0.1);
    }

    playExplosion() {
        // Noise-like effect (simulated with low freq saw)
        this.playTone(50, 'sawtooth', 0.5, 0, 0.2);
        this.playTone(40, 'square', 0.5, 0.1, 0.2);
    }
}

const audioController = new AudioController();
