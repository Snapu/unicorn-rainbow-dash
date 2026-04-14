/**
 * UNICORN RAINBOW DASH - VIBE CONFIG 🦄✨
 *
 * Hier könnt ihr zusammen das Spiel anpassen!
 * Ändert einfach die Zahlen (Werte) und speichert die Datei,
 * um den "Vibe" des Spiels zu verändern.
 */

window.VIBE_CONFIG = {

    // --- PHYSIK ---
    // Schwerkraft: Wie schnell fällt das Einhorn? (Höher = schwerer)
    gravity: 0.25,

    // Auftrieb: Wie stark fliegt es nach oben beim Klicken?
    lift: -6,

    // Geschwindigkeit: Wie schnell kommen die Sterne auf euch zu?
    gameSpeed: 3,

    // Background-Parallax: Wie schnell bewegt sich der Wald?
    parallaxSpeed: 2.0,

    // --- EINHORN ---
    // Größe des Einhorns (auf Desktop)
    unicornSize: 150,

    // Position: Wie weit links soll das Einhorn fliegen?
    unicornStartX: 200,

    // --- REGENBOGEN-SCHWEIF ---
    // Regenbogen-Farben: Sucht euch eure Lieblingsfarben aus!
    rainbowColors: [
        '#FF0000', // Rot
        '#FF7F00', // Orange
        '#FFFF00', // Gelb
        '#00FF00', // Grün
        '#0000FF', // Blau
        '#4B0082', // Indigo
        '#8B00FF'  // Violett
    ],

    // Glitzer-Faktor: Wie viele Funkel-Teilchen? (1–15)
    sparkleFactor: 3,

    // Regenbogen-Länge: Wie lange bleiben Teilchen sichtbar? (0.5–2.0)
    particleLife: 0.8,

    // Regenbogen-Dicke: Wie groß sind die Glitzer-Teilchen? (5–15)
    particleSize: 10,

    // --- STERNE ---
    // Wie oft kommen neue Sterne? (0.01 = selten, 0.03 = häufig)
    starFrequency: 0.015,

    // Sollen die Sterne funkeln? (true/false)
    starTwinkle: true,

    // --- AUDIO ---
    // Ton an/aus
    soundEnabled: true,

    // Gesamtlautstärke Effekte (0.0 bis 1.0)
    masterVolume: 0.5,

    // Musik an/aus
    musicEnabled: true,

    // Musik-Lautstärke (leise empfohlen)
    musicVolume: 0.3,

    // Magische Tonhöhe (1.0 = normal, höher = heller)
    magicPitch: 1.0,

    // --- HINDERNISSE ---
    // Wie oft kommen Gewitterwolken? (0.001 = selten, 0.01 = häufig)
    obstacleFrequency: 0.003,

    // Wie schnell sind die Wolken?
    obstacleSpeed: 4.5,

    // --- TAG & NACHT ---
    // Wie schnell vergeht ein Tag? (0.0005 = langsam, 0.002 = schnell)
    dayNightCycleSpeed: 0.001,

    // Wie stark leuchten Sterne und Schweif nachts? (1.0–8.0)
    nightGlowIntensity: 4.0,

    // --- TURBO (RAINBOW DASH) 💎 ---
    // Wie lange hält der Turbo in Sekunden?
    turboDuration: 6,

    // Wie viel schneller wird die Welt im Turbo?
    turboSpeedMultiplier: 2.2,

    // Wie oft tauchen Glitzer-Diamanten auf? (0.001 = selten)
    powerupFrequency: 0.0015
};
