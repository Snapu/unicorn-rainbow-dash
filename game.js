/**
 * UNICORN RAINBOW DASH - ENGINE 🦄✨
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highscoreElement = document.getElementById('highscore');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');

// Spielzustand
let gameState = 'START';
let score = 0;
let highscore = localStorage.getItem('unicornHighscore') || 0;
highscoreElement.innerText = highscore;

// Bilder laden
const unicornImg = new Image();
unicornImg.src = 'assets/unicorn.png';

const bgImg = new Image();
bgImg.src = 'assets/background_v2.png';

// Spiel-Objekte
let unicorn = {
    x: window.VIBE_CONFIG.unicornStartX || 200,
    y: 0,
    width: window.VIBE_CONFIG.unicornSize || 150,
    height: window.VIBE_CONFIG.unicornSize || 150,
    velocity: 0,
    rotation: 0
};

let stars = [];
let obstacles = []; 
let powerups = []; // Liste für Diamanten
let particles = [];
let backgroundX = 0;
let gameTime = Math.PI * 1.5; 
let turboTimer = 0; 

// Statische Deko-Sterne für die Nacht (Fixe Positionen)
const staticStars = Array.from({ length: 50 }, () => ({
    x: Math.random(),
    y: Math.random() * 0.6, // Nur im oberen Bereich
    size: 0.5 + Math.random() * 1.5
}));

// Initialisierung
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Robuste Mobile-Erkennung
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 900;
    
    // Dynamische Größe: 20% der Bildschirmhöhe, aber nicht zu klein/groß
    let size = isMobile ? canvas.height * 0.20 : (window.VIBE_CONFIG.unicornSize || 150);
    if (isMobile) size = Math.min(Math.max(size, 60), 100); // Im Querformat am Handy begrenzen
    
    unicorn.x = window.VIBE_CONFIG.unicornStartX || 200;
    unicorn.width = size;
    unicorn.height = size; 
    unicorn.y = canvas.height / 2;
    unicorn.velocity = 0; 
    score = 0;
    scoreElement.innerText = score;
    stars = [];
    obstacles = []; 
    powerups = [];
    particles = [];
    gameTime = Math.PI * 1.5; 
    turboTimer = 0;
    AudioEngine.isTurbo = false;
}

window.addEventListener('resize', () => {
    init();
});
init();

// --- LOGIK ---

function jump() {
    if (gameState !== 'PLAYING') return;
    unicorn.velocity = window.VIBE_CONFIG.lift;
    AudioEngine.playWingWhoosh(); // Magischer Flügelschlag
}

// Eingabe-Events
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (gameState === 'START' || gameState === 'GAMEOVER') {
            startGame();
        } else {
            jump();
        }
    }
});

canvas.addEventListener('mousedown', () => {
    if (gameState === 'START' || gameState === 'GAMEOVER') {
        startGame();
    } else {
        jump();
    }
});

// Touch-Events für Handy/Tablet
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Verhindert Zoomen/Scrollen
    if (gameState === 'START' || gameState === 'GAMEOVER') {
        startGame();
    } else {
        jump();
    }
}, { passive: false });

function startGame() {
    AudioEngine.init(); // Wichtig: Audio im Browser 'aufwecken'
    AudioEngine.startMusic(); // Melodie starten! 🎶
    gameState = 'PLAYING';
    startScreen.style.display = 'none';
    init();
}

function gameOver() {
    AudioEngine.playGameOver(); // Trauriger Ton :(
    AudioEngine.stopMusic(); // Musik stoppt bei Game Over ⏸️
    gameState = 'GAMEOVER';
    startScreen.style.display = 'flex';
    document.querySelector('h1').innerText = "Oooops!";
    document.querySelector('p').innerText = `Dein Einhorn braucht eine Pause. \nDein Score: ${score}`;
    startButton.innerText = "NOCHMAL FLIEGEN!";

    if (score > highscore) {
        highscore = score;
        localStorage.setItem('unicornHighscore', highscore);
        highscoreElement.innerText = highscore;
    }
}

// Sterne erstellen
function spawnStar() {
    // Sterne spawnen etwas häufiger im Turbo
    const freq = turboTimer > 0 ? window.VIBE_CONFIG.starFrequency * 2 : window.VIBE_CONFIG.starFrequency;
    if (stars.length < 15 && Math.random() < freq) {
        stars.push({
            x: canvas.width + 100,
            y: Math.random() * (canvas.height - 100) + 50,
            size: 30 + Math.random() * 20,
            speed: window.VIBE_CONFIG.gameSpeed + (turboTimer > 0 ? 5 : 0) + Math.random() * 2
        });
    }
}

function spawnObstacle() {
    if (Math.random() < window.VIBE_CONFIG.obstacleFrequency) {
        obstacles.push({
            x: canvas.width + 200,
            y: Math.random() * (canvas.height - 100) + 50,
            width: 70 + Math.random() * 70,
            height: 40 + Math.random() * 30,
            speed: window.VIBE_CONFIG.obstacleSpeed + (turboTimer > 0 ? 5 : 0) + Math.random() * 1
        });
    }
}

function spawnPowerup() {
    if (Math.random() < window.VIBE_CONFIG.powerupFrequency) {
        powerups.push({
            x: canvas.width + 100,
            y: Math.random() * (canvas.height - 100) + 50,
            size: 40,
            speed: window.VIBE_CONFIG.gameSpeed + (turboTimer > 0 ? 5 : 0)
        });
    }
}

// Regenbogen-Partikel
function createParticle(x, y) {
    const isTurbo = turboTimer > 0;
    const colors = window.VIBE_CONFIG.rainbowColors;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Im Turbo mehr Partikel streuen
    const count = isTurbo ? window.VIBE_CONFIG.sparkleFactor * 2 : window.VIBE_CONFIG.sparkleFactor;
    
    for(let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: -1 - Math.random() * (isTurbo ? 10 : 3),
            vy: (Math.random() - 0.5) * (isTurbo ? 8 : 2),
            size: (window.VIBE_CONFIG.particleSize || 8) * (isTurbo ? 1.2 : (0.3 + Math.random())),
            life: window.VIBE_CONFIG.particleLife || 1.0,
            decay: isTurbo ? 0.01 : (0.01 + Math.random() * 0.02),
            color: color,
            type: Math.random() > 0.8 ? 'star' : 'circle', // Mischung aus Kreisen und Sternen
            twinkle: Math.random() * Math.PI * 2 // Zufällige Phase für das Funkeln
        });
    }
}

// --- HILFSFUNKTIONEN ---

function drawStar(ctx, x, y, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);
    for (let i = 0; i < spikes; i++) {
        ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
        rot += step;
    }
    ctx.lineTo(x, y - outerRadius);
    ctx.closePath();
    ctx.fill();
}

// Schneller Glow via halbtransparenter Kreis (GPU-beschleunigt, kein shadowBlur!)
function drawFakeGlow(ctx, x, y, radius, color, alpha) {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, color.replace(')', `, ${alpha})`).replace('rgb', 'rgba'));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawMoon(ctx, x, y, radius) {
    ctx.save();
    ctx.fillStyle = '#fdfdfd';
    // Äußerer Kreis
    ctx.beginPath();
    ctx.arc(x, y, radius, 0.2 * Math.PI, 1.8 * Math.PI);
    // Innerer Kreis (Crescent Effekt)
    ctx.arc(x + radius * 0.5, y, radius * 0.9, 1.8 * Math.PI, 0.2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// --- RENDERING ---

function update() {
    // Turbo Logik
    const turboCard = document.getElementById('turbo-card');
    const turboBar = document.getElementById('turbo-bar');
    
    if (turboTimer > 0) {
        turboTimer--;
        AudioEngine.isTurbo = true;
        
        // UI Update
        if (turboCard) turboCard.style.display = 'flex';
        if (turboBar) {
            const percent = (turboTimer / (window.VIBE_CONFIG.turboDuration * 60)) * 100;
            turboBar.style.width = percent + '%';
        }
    } else {
        AudioEngine.isTurbo = false;
        if (turboCard) turboCard.style.display = 'none';
    }

    // Sterne und Hintergrund sollen sich immer bewegen, auch im Startmenü
    spawnStar();
    spawnObstacle();
    spawnPowerup(); // Diamanten spawnen
    
    // Multiplikator für Turbo-Geschwindigkeit
    const speedMult = turboTimer > 0 ? window.VIBE_CONFIG.turboSpeedMultiplier : 1;

    // Sterne aktualisieren & Kollision
    stars.forEach(star => {
        star.x -= star.speed * speedMult;

        if (gameState === 'PLAYING') {
            const dx = unicorn.x - star.x;
            const dy = unicorn.y - star.y;
            if (Math.sqrt(dx * dx + dy * dy) < 100) {
                star.collected = true;
                score += (turboTimer > 0 ? 2 : 1);
                scoreElement.innerText = score;
                AudioEngine.playStarDing();
                for (let i = 0; i < 15; i++) createParticle(star.x, star.y);
            }
        }
    });
    stars = stars.filter(s => !s.collected && s.x > -100);

    // Hindernisse aktualisieren & Kollision
    obstacles.forEach(obs => {
        obs.x -= obs.speed * speedMult;

        if (gameState === 'PLAYING' && turboTimer <= 0) {
            if (unicorn.x + unicorn.width / 3 > obs.x - obs.width / 2 &&
                unicorn.x - unicorn.width / 3 < obs.x + obs.width / 2 &&
                unicorn.y + unicorn.height / 3 > obs.y - obs.height / 2 &&
                unicorn.y - unicorn.height / 3 < obs.y + obs.height / 2) {
                gameOver();
            }
        }
    });
    obstacles = obstacles.filter(o => o.x > -300);

    // Diamanten aktualisieren & Kollision
    powerups.forEach(p => {
        p.x -= p.speed * speedMult;

        if (gameState === 'PLAYING') {
            const dx = unicorn.x - p.x;
            const dy = unicorn.y - p.y;
            if (Math.sqrt(dx * dx + dy * dy) < 100) {
                p.collected = true;
                turboTimer = window.VIBE_CONFIG.turboDuration * 60;
                AudioEngine.playTurboDing();
                for (let i = 0; i < 30; i++) createParticle(p.x, p.y);
            }
        }
    });
    powerups = powerups.filter(p => !p.collected && p.x > -100);

    // Hintergrund bewegen
    backgroundX -= window.VIBE_CONFIG.parallaxSpeed * speedMult;
    if (backgroundX <= -canvas.width) backgroundX = 0;

    // Tag-Nacht-Zeit weiterschalten (Asymmetrisch: Langsamer Nacht, schneller Tag)
    let cycleSpeed = window.VIBE_CONFIG.dayNightCycleSpeed;
    if (Math.cos(gameTime) > 0) {
        gameTime += cycleSpeed * 0.5; // Langsamerer Sonnenuntergang
    } else {
        gameTime += cycleSpeed * 2.5; // Rasanter Sonnenaufgang
    }

    if (gameState !== 'PLAYING') return;

    // Einhorn Physik
    if (turboTimer <= 0) {
        unicorn.velocity += window.VIBE_CONFIG.gravity;
        unicorn.y += unicorn.velocity;
    } else {
        // Im Turbo schwebt das Einhorn sanft zur Mitte
        unicorn.y += (canvas.height/2 - unicorn.y) * 0.1;
        unicorn.velocity *= 0.9;
    }
    
    // Rotation basierend auf Geschwindigkeit
    unicorn.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, unicorn.velocity * 0.05));

    // Boden/Decke Check
    if (unicorn.y + unicorn.height/2 > canvas.height) {
        if (turboTimer <= 0) gameOver();
    }
    if (unicorn.y - unicorn.height/2 < 0) {
        if (turboTimer <= 0) {
            unicorn.y = unicorn.height/2;
            unicorn.velocity = 0;
        }
    }

    // Regenbogen-Schweif erzeugen (am hinteren Ende des Einhorns)
    createParticle(unicorn.x - (unicorn.width / 4), unicorn.y + (unicorn.height / 6));

    // Partikel aktualisieren
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
    });
    particles = particles.filter(p => p.life > 0);
    // Harte Grenze: max 150 Partikel gleichzeitig (Performance-Sicherung)
    if (particles.length > 150) particles.splice(0, particles.length - 150);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Hintergrund (Parallax)
    ctx.drawImage(bgImg, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, backgroundX + canvas.width, 0, canvas.width, canvas.height);

    // --- TAG-NACHT-BERECHNUNG ---
    const nightFactor = (Math.sin(gameTime) + 1) / 2;
    
    // Nacht-Overlay (günstiges source-over statt teures 'multiply')
    if (nightFactor > 0.05) {
        // Hintergrund-Sterne zeichnen (bevor das Overlay kommt)
        if (nightFactor > 0.3) {
            ctx.save();
            ctx.globalAlpha = (nightFactor - 0.3) * 1.4;
            ctx.fillStyle = 'white';
            staticStars.forEach(s => {
                ctx.beginPath();
                ctx.arc(s.x * canvas.width, s.y * canvas.height, s.size, 0, Math.PI * 2);
                ctx.fill();
            });
            drawMoon(ctx, canvas.width - 100, 80, 40);
            ctx.restore();
        }

        ctx.globalAlpha = nightFactor * 0.85; // Tieferes Blau
        ctx.fillStyle = 'rgb(10, 10, 60)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;

        // Dämmerungs-Rötung
        if (nightFactor > 0.2 && nightFactor < 0.5) {
            ctx.globalAlpha = (0.5 - nightFactor) * 0.4;
            ctx.fillStyle = 'rgb(255, 80, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;
        }
    }

    // Regenbogen-Schweif (Standard Blending ohne Glow)
    particles.forEach(p => {
        const twinkleAlpha = Math.sin(gameTime * 5 + p.twinkle) * 0.3 + 0.7;
        ctx.globalAlpha = p.life * twinkleAlpha;
        ctx.fillStyle = p.color;
        if (p.type === 'star') {
            drawStar(ctx, p.x, p.y, 4, p.size, p.size / 2);
        } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    ctx.globalAlpha = 1;

    // Sterne (Ohne Halo/Glow)
    stars.forEach(star => {
        const twinkle = window.VIBE_CONFIG.starTwinkle ? Math.sin(Date.now() / 200 + star.x) * 0.2 + 1 : 1;
        const r = (star.size / 2) * twinkle;
        ctx.fillStyle = '#ffeb3b';
        ctx.globalAlpha = 1;
        drawStar(ctx, star.x, star.y, 5, r, r / 2);
    });

    // 4. Hindernisse (Gewitterwolken)
    obstacles.forEach(obs => {
        ctx.save();
        ctx.translate(obs.x, obs.y);
        
        // Farbe basierend auf Turbo-Zustand (durchsichtig im Turbo)
        const alpha = turboTimer > 0 ? 0.3 : 0.8;
        const mainColor = `rgba(74, 74, 100, ${alpha})`; // Leicht violett-grau
        
        // Schatten für Tiefe
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        
        // Wir zeichnen eine 'fluffige' Wolke aus 6 Kreisen
        ctx.fillStyle = mainColor;
        const circles = [
            {x: 0, y: 0, r: obs.height/2},
            {x: -obs.width/3, y: 5, r: obs.height/2.5},
            {x: obs.width/3, y: 5, r: obs.height/2.5},
            {x: -obs.width/5, y: -obs.height/4, r: obs.height/3},
            {x: obs.width/5, y: -obs.height/4, r: obs.height/3},
            {x: 0, y: -obs.height/3, r: obs.height/2.8}
        ];
        
        circles.forEach(c => {
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Optionaler Blitz-Effekt (kurzes Flackern)
        if (Math.random() < 0.01) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-15, 30);
            ctx.lineTo(5, 20);
            ctx.lineTo(0, 50);
            ctx.fill();
        }
        
        ctx.restore();
    });

    // 5. Diamanten
    powerups.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#00ffff';
        
        // Diamanten-Form (gemessen an echtem Schliff)
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.moveTo(-p.size/2, -p.size/6);
        ctx.lineTo(-p.size/3, -p.size/2);
        ctx.lineTo(p.size/3, -p.size/2);
        ctx.lineTo(p.size/2, -p.size/6);
        ctx.lineTo(0, p.size/2);
        ctx.closePath();
        ctx.fill();
        
        // Facetten-Linien für 3D Look
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-p.size/2, -p.size/6);
        ctx.lineTo(p.size/2, -p.size/6);
        ctx.moveTo(-p.size/3, -p.size/2);
        ctx.lineTo(-p.size/4, -p.size/6);
        ctx.lineTo(0, p.size/2);
        ctx.moveTo(p.size/3, -p.size/2);
        ctx.lineTo(p.size/4, -p.size/6);
        ctx.lineTo(0, p.size/2);
        ctx.stroke();

        // Glanz-Punkt (wandert leicht mit Zeit)
        const shineX = Math.sin(Date.now()/500) * 10;
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.arc(shineX, -p.size/4, 5, 0, Math.PI*2);
        ctx.fill();
        
        ctx.restore();
    });

    // 6. Einhorn
    ctx.save();
    if (turboTimer > 0) {
        ctx.shadowBlur = 50;
        ctx.shadowColor = 'gold';
    }
    ctx.translate(unicorn.x, unicorn.y);
    ctx.rotate(unicorn.rotation);
    
    // Zeichnen
    if (unicornImg.complete) {
        ctx.drawImage(
            unicornImg, 
            -unicorn.width / 2, 
            -unicorn.height / 2, 
            unicorn.width, 
            unicorn.height
        );
    }
    ctx.restore();
}

let lastFrameTime = performance.now();

function loop() {
    lastFrameTime = performance.now();
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start
loop();
startButton.addEventListener('click', startGame);
