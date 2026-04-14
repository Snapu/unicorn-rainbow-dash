/**
 * UNICORN RAINBOW DASH - AUDIO ENGINE ✨🔊
 * Erzeugt synthetische, magische Töne direkt im Browser.
 */

const AudioEngine = {
    audioCtx: null,

    // Initialisierung (wird beim ersten Klick gerufen)
    init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        // Wichtig: AudioContext nach Tab-Wechsel wieder aufwecken
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    },

    // Ein glitzerndes "Pling" für die Sterne
    playStarDing() {
        if (!window.VIBE_CONFIG.soundEnabled) return;
        this.init();
        
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.type = 'triangle'; // Weicher, magischerer Ton
        const baseFreq = 800 * (window.VIBE_CONFIG.magicPitch || 1.0);
        osc.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.audioCtx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(window.VIBE_CONFIG.masterVolume * 0.5, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.3);
    },

    // Ein sanftes "Wusch" für den Flügelschlag
    playWingWhoosh() {
        if (!window.VIBE_CONFIG.soundEnabled) return;
        this.init();
        
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.type = 'sine';
        const baseFreq = 150 * (window.VIBE_CONFIG.magicPitch || 1.0);
        osc.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, this.audioCtx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(window.VIBE_CONFIG.masterVolume * 0.3, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.2);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.2);
    },

    // Ein trauriges Geräusch beim Game Over
    playGameOver() {
        if (!window.VIBE_CONFIG.soundEnabled) return;
        this.init();
        
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, this.audioCtx.currentTime + 0.5);
        
        gain.gain.setValueAtTime(window.VIBE_CONFIG.masterVolume * 0.5, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.6);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.6);
    },

    // --- MUSIK ENGINE ---
    musicInterval: null,
    isPlaying: false,
    isTurbo: false,

    // Pentatonische Skala für magischen Sound (C4–C5)
    notes: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25],

    startMusic() {
        if (!window.VIBE_CONFIG.musicEnabled || this.isPlaying) return;
        this.init();
        this.isPlaying = true;

        const playTick = () => {
            if (!this.isPlaying) return; // Race Condition Guard
            const freq = this.notes[Math.floor(Math.random() * this.notes.length)];
            this.playMagicalNote(freq);

            const interval = this.isTurbo ? 200 : 500;
            this.musicInterval = setTimeout(playTick, interval);
        };

        playTick();
    },

    playMagicalNote(freq) {
        if (!this.audioCtx) return;
        
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        // Im Turbo etwas 'aufgeregtere' Wellenform
        osc.type = this.isTurbo ? 'square' : 'sine'; 
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        
        const volume = this.isTurbo ? window.VIBE_CONFIG.musicVolume * 0.4 : window.VIBE_CONFIG.musicVolume * 0.2;
        
        gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(volume, this.audioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + (this.isTurbo ? 0.4 : 0.8));
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.start();
        osc.stop(this.audioCtx.currentTime + 1.0);
    },

    playTurboDing() {
        if (!window.VIBE_CONFIG.soundEnabled) return;
        this.init();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, this.audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(window.VIBE_CONFIG.masterVolume, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.5);
    },

    stopMusic() {
        this.isPlaying = false;
        if (this.musicInterval) {
            clearTimeout(this.musicInterval);
            this.musicInterval = null;
        }
    }
};
