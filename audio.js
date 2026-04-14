/**
 * UNICORN RAINBOW DASH - AUDIO ENGINE ✨🔊
 * Erzeugt synthetische, magische Töne direkt im Browser.
 */

const AudioEngine = {
    audioCtx: null,
    isPlaying: false,
    isTurbo: false,
    musicInterval: null,
    notes: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25],

    // Sorgt dafür, dass der AudioContext existiert und läuft
    async init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            await this.audioCtx.resume();
        }
        return this.audioCtx;
    },

    // Universelle Funktion zum Töne abspielen
    async playTone(freq, type, duration, vol) {
        if (!window.VIBE_CONFIG.soundEnabled) return;
        const ctx = await this.init();
        if (ctx.state !== 'running') return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.setTargetAtTime(vol, ctx.currentTime, 0.02);
        gain.gain.setTargetAtTime(0, ctx.currentTime + duration * 0.8, 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    },

    playStarDing() {
        const pitch = window.VIBE_CONFIG.magicPitch || 1.0;
        this.playTone(800 * pitch, 'triangle', 0.3, window.VIBE_CONFIG.masterVolume * 0.5);
    },

    playWingWhoosh() {
        const pitch = window.VIBE_CONFIG.magicPitch || 1.0;
        this.playTone(150 * pitch, 'sine', 0.2, window.VIBE_CONFIG.masterVolume * 0.3);
    },

    playGameOver() {
        this.playTone(200, 'sawtooth', 0.6, window.VIBE_CONFIG.masterVolume * 0.5);
    },

    playTurboDing() {
        this.playTone(400, 'sawtooth', 0.5, window.VIBE_CONFIG.masterVolume);
    },

    // --- MUSIK ---
    async startMusic() {
        if (!window.VIBE_CONFIG.musicEnabled || this.isPlaying) return;
        
        await this.init();
        this.isPlaying = true;

        const nextTick = () => {
            if (!this.isPlaying) return;
            
            const freq = this.notes[Math.floor(Math.random() * this.notes.length)];
            const vol = this.isTurbo ? window.VIBE_CONFIG.musicVolume * 0.4 : window.VIBE_CONFIG.musicVolume * 0.2;
            const type = this.isTurbo ? 'square' : 'sine';
            const dur = this.isTurbo ? 0.3 : 0.8;

            this.playTone(freq, type, dur, vol);

            const interval = this.isTurbo ? 200 : 500;
            this.musicInterval = setTimeout(nextTick, interval);
        };

        // Kleiner Delay damit der Browser bereit ist
        setTimeout(nextTick, 100);
    },

    stopMusic() {
        this.isPlaying = false;
        if (this.musicInterval) {
            clearTimeout(this.musicInterval);
            this.musicInterval = null;
        }
    }
};
