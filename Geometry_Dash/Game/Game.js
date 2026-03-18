// game.js - YOUR STABLE VERSION + ENTIRE BASE LOWERED PROPERLY + SPIKES ALWAYS ON GROUND + MODS SUPPORT
const gameCanvas = document.getElementById('gameCanvas');
const gameCtx = gameCanvas.getContext('2d');
const editorCanvas = document.getElementById('editorCanvas');
const editorCtx = editorCanvas.getContext('2d');

const bgMusic = document.getElementById('bgMusic');
const fireInTheHoleAudio = document.getElementById('fireInTheHole');
const menuIconsLayer = document.getElementById('menuIconsLayer');

let audioCtx;
function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playFireInTheHole() {
    if (!fireInTheHoleEnabled || !fireInTheHoleAudio) return;
    try {
        fireInTheHoleAudio.currentTime = 0;
        fireInTheHoleAudio.play().catch(() => { });
    } catch { }
}

let currentScreen = 'menu';
let gameRunning = false;
let editorRunning = false;
let paused = false;

const BASE_CANVAS_WIDTH = 900;
const BASE_CANVAS_HEIGHT = 500;
const GROUND_RATIO = 340 / 500;
const PLAYER_X_CELLS = 3;
const BASE_PLAYER_SIZE = 40;
const BASE_GRID_SIZE = 40;
const BASE_SPEED = 6;
const BASE_GRAVITY = 0.85;
const BASE_JUMP_STRENGTH = -13.6;

// Game variables
let groundY = Math.round(BASE_CANVAS_HEIGHT * GROUND_RATIO);
let worldScale = 1;
let player = { x: 120, y: groundY - BASE_PLAYER_SIZE, width: BASE_PLAYER_SIZE, height: BASE_PLAYER_SIZE, dy: 0, onGround: true, angle: 0 };
let playerVisible = true;
let cameraX = 0;
let gameCameraY = 0;
let speed = BASE_SPEED;
let gravity = BASE_GRAVITY;
let jumpStrength = BASE_JUMP_STRENGTH;
let score = 0;
let levelLength = 4000;
let gameOver = false;
let won = false;
let jumpBuffer = 0;
let jumpHeld = false;
let jumpPressedThisFrame = false;
let orbConsumedThisHold = false;
let gravityDirection = 1;
let padTriggerCooldown = 0;
let testPlayActive = false;
let deathRestartTimer = 0;
const MAX_MENU_AMBIENT_ICONS = 18;
let deathExplosion = null;
let deathFlash = 0;
let menuAmbientSpawnTimer = null;

let obstacles = [];
let particles = [];
let stars = [];
let gdColonCubeEnabled = false;
let vortroxCubeEnabled = false;
let nexusCubeEnabled = false;
let gdIconCubeEnabled = false;
let robTopCubeEnabled = false;
let rubRubCubeEnabled = false;
let tricipitalCubeEnabled = false;
let avatarAangCubeEnabled = false;
let boomlingsCubeEnabled = false;
let sansCubeEnabled = false;
let batmanCubeEnabled = false;
let creeperCubeEnabled = false;
let superMeatBoyCubeEnabled = false;
let noclipEnabled = false;
let showHitboxesEnabled = false;
let infiniteJumpsEnabled = false;
let autoJumpEnabled = false;
let lowGravityEnabled = false;
let noRotationEnabled = false;
let speedhackMultiplier = 1;
let speedhackFrameCounter = 0;
let speedhackAccumulator = 0;
let trailEnabled = false;
let rgbCubeEnabled = false;
let levelEditorEnabled = true;
let betterEditEnabled = false;
let fireInTheHoleEnabled = false;
let rainbowStarsEnabled = false;
let rainbowGroundEnabled = false;
let showGameGridEnabled = false;
let playerGlowEnabled = false;
let groundPulseEnabled = false;
let starTwinkleBoostEnabled = false;
let nyanCatTogglesEnabled = false;
let trailParticles = [];
const MENU_ICON_HITBOX = 57;
const NYAN_ASSET_BASES = ['../Mods/', '../Mods Stuff/', './'];

function getIconState() {
    return window.iconState || { primary: '#FFD200', secondary: '#2FD2FF', skinIndex: 0 };
}

function getCubeSkinCount() {
    return Array.isArray(window.CUBE_SKINS) && window.CUBE_SKINS.length ? window.CUBE_SKINS.length : 10;
}

function getActiveCubeSkinIndex() {
    const state = getIconState();
    const idx = Number(state.skinIndex);
    if (!Number.isFinite(idx)) return 0;
    return Math.max(0, Math.min(getCubeSkinCount() - 1, Math.round(idx)));
}

function getBaseCubeColorsSafe() {
    const state = window.iconState || getIconState();
    return {
        primary: state.primary || '#FFD200',
        secondary: state.secondary || '#2FD2FF'
    };
}

function getActiveCubeColors(hueOverride) {
    if (typeof window.getCubeColors === 'function') {
        try {
            const colors = window.getCubeColors(hueOverride);
            if (colors && typeof colors.primary === 'string' && typeof colors.secondary === 'string') {
                return colors;
            }
        } catch { }
    }
    return getBaseCubeColorsSafe();
}

function renderCubeSkinToCanvas(canvas, skinIndex, primary, secondary) {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const size = MENU_ICON_HITBOX;
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    if (typeof window.renderCubeSkin === 'function') {
        window.renderCubeSkin(ctx, size, skinIndex, primary, secondary);
        return;
    }
    ctx.fillStyle = primary;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = secondary;
    ctx.lineWidth = Math.max(2, Math.round(size * 0.08));
    ctx.strokeRect(1, 1, size - 2, size - 2);
}

let NYAN_CAT_GIF_SRC = `${NYAN_ASSET_BASES[0]}Nyan Cat.gif`;
const nyanCatImage = new Image();
let nyanCatCrop = null;

function loadFirstAvailableAsset(image, candidates, onLoaded) {
    let idx = 0;
    const tryNext = () => {
        if (idx >= candidates.length) return;
        image.src = candidates[idx++];
    };
    image.onload = () => {
        if (onLoaded) onLoaded(image.src);
    };
    image.onerror = () => {
        tryNext();
    };
    tryNext();
}

function getAssetCandidates(fileNames, basePaths) {
    const sources = [];
    for (const basePath of basePaths) {
        for (const file of fileNames) {
            sources.push(`${basePath}${file}`);
        }
    }
    return sources;
}

// Editor
let editorCameraX = 0;
let editorCameraY = 0;
let editorTool = 0;
let gridSize = BASE_GRID_SIZE;
let isMouseDown = false;
let isViewDragging = false;
let lastViewDragX = 0;
let lastViewDragY = 0;
let editDragMoved = false;
let editorPanelMode = 'objects';
let selectedObstacleIndex = -1; // kept for legacy compat, mirrors first of selectedIndices
let selectedIndices = new Set();

function getScaled(value) {
    return Math.max(1, Math.round(value * worldScale));
}

function snapToGrid(value) {
    return Math.round(value / gridSize) * gridSize;
}

function clampEditorCameraY(value) {
    const minY = -Math.round(editorCanvas.height * 0.45);
    const maxY = Math.round(groundY + editorCanvas.height * 0.25);
    return Math.max(minY, Math.min(maxY, value));
}

function getJumpVelocity(multiplier = 1) {
    return jumpStrength * gravityDirection * multiplier;
}

function flipGravity() {
    gravityDirection *= -1;
    player.onGround = false;
    jumpBuffer = 0;
}

function normalizeRotation(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    const snapped = Math.round(n / 90) * 90;
    return ((snapped % 360) + 360) % 360;
}

function getPlayerStartX() {
    return PLAYER_X_CELLS * gridSize;
}

function initNyanCatAssets() {
    nyanCatImage.onload = () => {
        try {
            const probe = document.createElement('canvas');
            probe.width = nyanCatImage.naturalWidth;
            probe.height = nyanCatImage.naturalHeight;
            const pctx = probe.getContext('2d');
            pctx.drawImage(nyanCatImage, 0, 0);
            const data = pctx.getImageData(0, 0, probe.width, probe.height).data;

            let minX = probe.width, minY = probe.height, maxX = -1, maxY = -1;
            for (let y = 0; y < probe.height; y++) {
                for (let x = 0; x < probe.width; x++) {
                    const a = data[(y * probe.width + x) * 4 + 3];
                    if (a > 10) {
                        if (x < minX) minX = x;
                        if (y < minY) minY = y;
                        if (x > maxX) maxX = x;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            if (maxX >= minX && maxY >= minY) {
                nyanCatCrop = {
                    x: minX,
                    y: minY,
                    w: maxX - minX + 1,
                    h: maxY - minY + 1
                };
            }
        } catch {
            nyanCatCrop = null;
        }
        updateModsUI();
    };
    nyanCatImage.onerror = () => {
        updateModsUI();
    };
    loadFirstAvailableAsset(nyanCatImage, getAssetCandidates(['Nyan Cat.gif'], NYAN_ASSET_BASES), (src) => {
        NYAN_CAT_GIF_SRC = src;
    });
}

function renderMenuCubeSkinToCanvas(skinIndex, canvas) {
    const colors = getBaseCubeColorsSafe();
    renderCubeSkinToCanvas(canvas, skinIndex, colors.primary, colors.secondary);
}

function clearMenuAmbientIcons() {
    if (!menuIconsLayer) return;
    menuIconsLayer.innerHTML = '';
}

function stopMenuAmbient() {
    if (menuAmbientSpawnTimer) {
        clearTimeout(menuAmbientSpawnTimer);
        menuAmbientSpawnTimer = null;
    }
    clearMenuAmbientIcons();
}

function spawnMenuFakeIcon() {
    if (!menuIconsLayer || currentScreen !== 'menu') return;
    if (document.hidden) return;
    if (menuIconsLayer.childElementCount >= MAX_MENU_AMBIENT_ICONS) {
        const first = menuIconsLayer.firstElementChild;
        if (first) first.remove();
    }
    const icon = document.createElement('div');
    icon.className = 'menu-fake-icon';
    const cubeCanvas = document.createElement('canvas');
    cubeCanvas.className = 'menu-fake-icon-img';
    cubeCanvas.width = MENU_ICON_HITBOX;
    cubeCanvas.height = MENU_ICON_HITBOX;
    const skinIndex = Math.floor(Math.random() * getCubeSkinCount());
    renderMenuCubeSkinToCanvas(skinIndex, cubeCanvas);
    icon.style.animationDuration = `${(4.8 + Math.random() * 2.4).toFixed(2)}s`;
    icon.style.opacity = (0.8 + Math.random() * 0.2).toFixed(2);
    icon.style.width = `${MENU_ICON_HITBOX}px`;
    icon.style.height = `${MENU_ICON_HITBOX}px`;
    icon.style.bottom = '6px';
    icon.appendChild(cubeCanvas);
    menuIconsLayer.appendChild(icon);

    // Random, non-continuous hops while moving across the menu ground.
    const travelMs = parseFloat(icon.style.animationDuration) * 1000;
    let hopRotation = 0;
    let hopRaf = null;
    const scheduleHop = () => {
        if (!icon.isConnected) return;
        if (hopRaf) cancelAnimationFrame(hopRaf);

        // Same jump logic/values as gameplay cube: dy += gravity, y += dy, angle += 7.5 while airborne.
        let y = 0;
        let dy = BASE_JUMP_STRENGTH;
        let angle = hopRotation;
        let lastTs = performance.now();

        const step = (ts) => {
            if (!icon.isConnected) return;
            const dtFrames = Math.max(0.6, Math.min(2.2, (ts - lastTs) / 16.6667));
            lastTs = ts;

            dy += BASE_GRAVITY * dtFrames;
            y += dy * dtFrames;
            angle += 7.5 * dtFrames;

            if (y >= 0 && dy > 0) {
                y = 0;
                hopRotation = Math.round(angle / 90) * 90;
                cubeCanvas.style.transform = `translateY(0px) rotate(${hopRotation}deg)`;
                hopRaf = null;
                return;
            }

            cubeCanvas.style.transform = `translateY(${y}px) rotate(${angle}deg)`;
            hopRaf = requestAnimationFrame(step);
        };

        hopRaf = requestAnimationFrame(step);
    };
    const firstHopAt = 700 + Math.random() * Math.max(300, travelMs - 1800);
    setTimeout(scheduleHop, firstHopAt);
    if (Math.random() < 0.42) {
        const secondHopAt = firstHopAt + 550 + Math.random() * 1150;
        if (secondHopAt < travelMs - 250) setTimeout(scheduleHop, secondHopAt);
    }

    icon.addEventListener('animationend', (e) => {
        if (e.target !== icon) return;
        if (e.animationName !== 'menuIconRun') return;
        icon.remove();
    });
}

function scheduleMenuAmbientSpawn() {
    if (menuAmbientSpawnTimer) clearTimeout(menuAmbientSpawnTimer);
    if (currentScreen !== 'menu') return;
    if (document.hidden) {
        menuAmbientSpawnTimer = setTimeout(scheduleMenuAmbientSpawn, 300);
        return;
    }
    spawnMenuFakeIcon();
    const nextDelay = 1000 + Math.random() * 500;
    menuAmbientSpawnTimer = setTimeout(scheduleMenuAmbientSpawn, nextDelay);
}

function startMenuAmbient() {
    if (currentScreen !== 'menu') return;
    if (menuAmbientSpawnTimer) return;
    scheduleMenuAmbientSpawn();
}

function renderStaticNyan(canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const cw = Math.max(1, Math.round(rect.width * dpr));
    const ch = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
    }

    const cctx = canvas.getContext('2d');
    cctx.clearRect(0, 0, cw, ch);
    cctx.imageSmoothingEnabled = false;
    cctx.fillStyle = '#1b1b24';
    cctx.fillRect(0, 0, cw, ch);

    if (nyanCatImage.complete && nyanCatImage.naturalWidth > 0) {
        const srcX = nyanCatCrop ? nyanCatCrop.x : 0;
        const srcY = nyanCatCrop ? nyanCatCrop.y : 0;
        const srcW = nyanCatCrop ? nyanCatCrop.w : nyanCatImage.naturalWidth;
        const srcH = nyanCatCrop ? nyanCatCrop.h : nyanCatImage.naturalHeight;
        // Use "cover" (+small zoom) so OFF state fills the toggle box like ON.
        const scale = Math.max(cw / srcW, ch / srcH) * 1.12;
        const dw = Math.max(1, Math.round(srcW * scale));
        const dh = Math.max(1, Math.round(srcH * scale));
        const dx = Math.floor((cw - dw) / 2);
        const dy = Math.floor((ch - dh) / 2);
        cctx.drawImage(nyanCatImage, srcX, srcY, srcW, srcH, dx, dy, dw, dh);
    }
}

function applyToggleVisual(toggleBtn, enabled) {
    if (!toggleBtn) return;

    toggleBtn.classList.toggle('on', enabled);

    if (!nyanCatTogglesEnabled) {
        toggleBtn.classList.remove('nyan-toggle');
        toggleBtn.textContent = enabled ? 'ON' : 'OFF';
        return;
    }

    toggleBtn.classList.add('nyan-toggle');
    toggleBtn.textContent = '';

    if (enabled) {
        let icon = toggleBtn.querySelector('img.nyan-icon');
        if (!icon) {
            toggleBtn.innerHTML = '';
            icon = document.createElement('img');
            icon.className = 'nyan-icon';
            toggleBtn.appendChild(icon);
        }
        icon.alt = 'ON';
        icon.src = NYAN_CAT_GIF_SRC;
    } else {
        let stillCanvas = toggleBtn.querySelector('canvas.nyan-icon-canvas');
        if (!stillCanvas) {
            toggleBtn.innerHTML = '';
            stillCanvas = document.createElement('canvas');
            stillCanvas.className = 'nyan-icon-canvas';
            toggleBtn.appendChild(stillCanvas);
        }
        renderStaticNyan(stillCanvas);
    }
}

function normalizeObstaclesToGrid() {
    if (obstacles.length === 0) return;

    for (let obs of obstacles) {
        obs.worldX = snapToGrid(obs.worldX);

        if (obs.type === 'spike') {
            obs.w = gridSize * Math.max(1, Math.round(obs.w / gridSize));
            obs.h = gridSize;
        } else {
            obs.w = gridSize * Math.max(1, Math.round(obs.w / gridSize));
            obs.h = gridSize;
        }
        obs.rotation = normalizeRotation(obs.rotation);

        const offsetSteps = Math.max(0, Math.round((groundY - (obs.y + obs.h)) / gridSize));
        obs.y = groundY - obs.h - offsetSteps * gridSize;
        obs.y = snapToGrid(obs.y);
    }
}

function resizeCanvases() {
    const prevScale = worldScale;
    const prevGroundY = groundY;
    const width = Math.max(window.innerWidth, BASE_CANVAS_WIDTH);
    const height = Math.max(window.innerHeight, BASE_CANVAS_HEIGHT);

    worldScale = height / BASE_CANVAS_HEIGHT;
    gameCanvas.width = width;
    gameCanvas.height = height;
    editorCanvas.width = width;
    editorCanvas.height = height;

    gridSize = getScaled(BASE_GRID_SIZE);
    groundY = Math.max(gridSize * 3, Math.min(height - gridSize, Math.floor((height * GROUND_RATIO) / gridSize) * gridSize));
    speed = BASE_SPEED * worldScale;
    gravity = BASE_GRAVITY * worldScale;
    jumpStrength = BASE_JUMP_STRENGTH * worldScale;

    const nextPlayerSize = getScaled(BASE_PLAYER_SIZE);
    const oldPlayerHeight = player.height;
    player.width = nextPlayerSize;
    player.height = nextPlayerSize;
    player.x = getPlayerStartX();

    if (player.onGround) {
        player.y = groundY - player.height;
    } else {
        player.y += (groundY - prevGroundY) - (player.height - oldPlayerHeight);
    }

    if (obstacles.length > 0 && prevScale > 0) {
        const ratio = worldScale / prevScale;
        for (let obs of obstacles) {
            const offsetFromGround = prevGroundY - (obs.y + obs.h);
            obs.w = Math.max(1, Math.round(obs.w * ratio));
            obs.h = Math.max(1, Math.round(obs.h * ratio));
            const scaledOffset = Math.round(offsetFromGround * ratio);
            obs.y = groundY - obs.h - scaledOffset;
        }

        normalizeObstaclesToGrid();
    }

    initStars();
}

// Sounds
function playJumpSound() {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(920, audioCtx.currentTime + 0.12);
    gain.gain.value = 0.25;
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
}

function playDeathSound() {
    initAudio();
    const noise = audioCtx.createBufferSource();
    const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.7, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 650;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.45; gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.65);
    noise.connect(filter).connect(gain).connect(audioCtx.destination);
    noise.start();
}

function getDefaultLevel() {
    const blockH = gridSize;
    const spikeH = gridSize;
    const blockW = gridSize;
    const spikeW = gridSize;
    return [
        { type: 'block', worldX: gridSize * 13, y: groundY - blockH, w: blockW, h: blockH },
        { type: 'spike', worldX: gridSize * 21, y: groundY - spikeH, w: spikeW, h: spikeH },

        { type: 'block', worldX: gridSize * 29, y: groundY - blockH, w: blockW, h: blockH },
        { type: 'spike', worldX: gridSize * 38, y: groundY - spikeH, w: spikeW, h: spikeH },

        { type: 'block', worldX: gridSize * 47, y: groundY - blockH, w: blockW, h: blockH },
        { type: 'spike', worldX: gridSize * 56, y: groundY - spikeH, w: spikeW * 2, h: spikeH },

        { type: 'block', worldX: gridSize * 66, y: groundY - blockH, w: blockW, h: blockH },
        { type: 'spike', worldX: gridSize * 75, y: groundY - spikeH, w: spikeW, h: spikeH },

        { type: 'block', worldX: gridSize * 84, y: groundY - blockH, w: blockW, h: blockH }
    ];
}

function initStars() {
    stars = [];
    const skyHeight = Math.max(120, gameCanvas.height);
    const fieldWidth = Math.max(2500, gameCanvas.width * 3);
    const starCount = Math.max(220, Math.round((gameCanvas.width * gameCanvas.height) / 3500));
    for (let i = 0; i < starCount; i++) stars.push({ x: Math.random() * fieldWidth, y: Math.random() * skyHeight, size: Math.random() * 3.5 + 1, alpha: Math.random() * 0.7 + 0.5 });
}

function drawBackground(ctx, camX) {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let s of stars) {
        let sx = (s.x - camX * 0.08) % (ctx.canvas.width * 2);
        let sy = s.y - gameCameraY * 0.08;
        if (sx < -10 || sx > ctx.canvas.width + 10) continue;
        const twinkleAmp = starTwinkleBoostEnabled ? 0.45 : 0.25;
        ctx.globalAlpha = s.alpha + Math.sin(Date.now() / 400 + s.x) * twinkleAmp;
        ctx.fillStyle = rainbowStarsEnabled
            ? `hsl(${(Date.now() / 30 + s.x) % 360}, 80%, 72%)`
            : '#ffffff';
        ctx.beginPath(); ctx.arc(sx, sy, s.size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function drawGround(ctx, camX, camY = 0) {
    const gy = groundY - camY;
    const hue = (Date.now() / 40) % 360;
    const pulse = groundPulseEnabled ? 0.85 + Math.sin(Date.now() / 220) * 0.15 : 1;
    if (rainbowGroundEnabled) {
        const light = 35 * pulse;
        ctx.fillStyle = `hsl(${hue}, 75%, ${light}%)`;
    } else {
        ctx.fillStyle = '#4B0082';
        if (groundPulseEnabled) {
            const lum = Math.max(0, Math.min(1, pulse));
            ctx.fillStyle = `rgba(75, 0, 130, ${lum})`;
        }
    }
    ctx.fillRect(0, gy, ctx.canvas.width, ctx.canvas.height - gy);
    if (rainbowGroundEnabled) {
        const light = 48 * pulse;
        ctx.strokeStyle = `hsl(${(hue + 20) % 360}, 75%, ${light}%)`;
    } else {
        ctx.strokeStyle = '#6B2A9E';
    }
    ctx.lineWidth = 5;
    for (let gx = -gridSize; gx < ctx.canvas.width + gridSize; gx += gridSize) {
        const x = gx - (camX % gridSize);
        ctx.beginPath();
        ctx.moveTo(x, gy);
        ctx.lineTo(x + gridSize * 0.7, gy + gridSize * 0.7);
        ctx.stroke();
    }
}

function drawGameGrid(ctx, camX, camY = 0) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    for (let x = 0; x < ctx.canvas.width; x += gridSize) {
        let wx = Math.floor((x + camX) / gridSize) * gridSize - camX;
        ctx.beginPath(); ctx.moveTo(wx, 0); ctx.lineTo(wx, ctx.canvas.height); ctx.stroke();
    }
    for (let y = 0; y < ctx.canvas.height; y += gridSize) {
        let wy = Math.floor((y + camY) / gridSize) * gridSize - camY;
        ctx.beginPath(); ctx.moveTo(0, wy); ctx.lineTo(ctx.canvas.width, wy); ctx.stroke();
    }
    ctx.restore();
}

function drawPlayer(ctx, camY = 0) {
    ctx.save();
    const cx = player.x + player.width / 2, cy = player.y - camY + player.height / 2;
    const ps = player.width / BASE_PLAYER_SIZE;
    ctx.translate(cx, cy);
    ctx.rotate(player.angle * Math.PI / 180);

    if (playerGlowEnabled) {
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = '#76b6ff';
        ctx.beginPath();
        ctx.arc(0, 0, player.width * 0.75, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    const skinIndex = getActiveCubeSkinIndex();
    const colors = getActiveCubeColors();
    let drewSkin = false;
    if (typeof window.renderCubeSkin === 'function') {
        try {
            window.renderCubeSkin(ctx, player.width, skinIndex, colors.primary, colors.secondary, {
                x: -player.width / 2,
                y: -player.height / 2
            });
            drewSkin = true;
        } catch {
            drewSkin = false;
        }
    }
    if (!drewSkin) {
        const hue = (Date.now() / 8) % 360;
        const baseFill = rgbCubeEnabled ? `hsl(${hue}, 95%, 55%)` : '#FFEE33';
        const baseStroke = rgbCubeEnabled ? `hsl(${(hue + 35) % 360}, 95%, 45%)` : '#FFAA00';
        ctx.fillStyle = baseFill;
        ctx.fillRect(-20 * ps, -20 * ps, 40 * ps, 40 * ps);
        ctx.strokeStyle = baseStroke;
        ctx.lineWidth = 7 * ps;
        ctx.strokeRect(-15 * ps, -15 * ps, 30 * ps, 30 * ps);
        ctx.fillStyle = '#111';
        ctx.fillRect(-11 * ps, -9 * ps, 7 * ps, 8 * ps);
        ctx.fillRect(5 * ps, -9 * ps, 7 * ps, 8 * ps);
    }

    ctx.restore();
}

function drawObstacle(ctx, obs, sx, camY = 0) {
    const sy = obs.y - camY;
    const rotation = normalizeRotation(obs.rotation);
    const drawAt = (x, y) => {
        if (obs.type === 'block') {
            ctx.fillStyle = '#555577'; ctx.fillRect(x, y, obs.w, obs.h);
            ctx.strokeStyle = '#9999cc'; ctx.lineWidth = 5; ctx.strokeRect(x + 6, y + 6, obs.w - 12, obs.h - 12);
        } else if (obs.type === 'spike') {
            const inset = Math.max(2, Math.round(gridSize * 0.12));
            const px = x + inset;
            const py = y + inset;
            const pw = Math.max(4, obs.w - inset * 2);
            const baseY = y + obs.h;
            ctx.fillStyle = '#FF3333';
            ctx.beginPath(); ctx.moveTo(px, baseY); ctx.lineTo(px + pw / 2, py); ctx.lineTo(px + pw, baseY); ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#FF9999'; ctx.lineWidth = 4; ctx.stroke();
        } else if (obs.type === 'yellowOrb' || obs.type === 'blueOrb' || obs.type === 'pinkOrb') {
            const isBlue = obs.type === 'blueOrb';
            const isPink = obs.type === 'pinkOrb';
            const glowColor = isBlue ? '#6cd6ff' : isPink ? '#ff80cc' : '#ffd44d';
            const fillColor = isBlue ? '#42bfff' : isPink ? '#ff50b0' : '#ffd84b';
            const rimColor = isBlue ? '#007bd6' : isPink ? '#cc0077' : '#f5a700';
            const innerColor = isBlue ? '#b8eeff' : isPink ? '#ffd6ee' : '#fff2a1';
            const r = Math.max(9, Math.round(obs.w * 0.3));
            const cx = x + obs.w / 2;
            const cy = y + obs.h / 2;
            ctx.save();
            ctx.globalAlpha = 0.33;
            ctx.fillStyle = glowColor;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 1.95, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.fillStyle = fillColor;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = rimColor;
            ctx.lineWidth = Math.max(2, getScaled(2));
            ctx.beginPath();
            ctx.arc(cx, cy, r * 1.02, 0, Math.PI * 2);
            ctx.stroke();
            ctx.strokeStyle = innerColor;
            ctx.lineWidth = Math.max(2, getScaled(2));
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.68, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        } else if (obs.type === 'yellowPad' || obs.type === 'bluePad' || obs.type === 'pinkPad') {
            const isBlue = obs.type === 'bluePad';
            const isPink = obs.type === 'pinkPad';
            const glowColor = isBlue ? '#73ddff' : isPink ? '#ff99dd' : '#ffd55a';
            const bodyColor = isBlue ? '#007ecf' : isPink ? '#cc0077' : '#d39100';
            const topColor = isBlue ? '#79dcff' : isPink ? '#ff70c0' : '#ffe27b';
            const arrowColor = isBlue ? '#d9f8ff' : isPink ? '#ffe0f5' : '#fff4b0';
            const strokeColor = isBlue ? '#c8f2ff' : isPink ? '#ffc0e8' : '#fff6c2';
            const padW = Math.max(14, Math.round(obs.w * 0.78));
            const padH = Math.max(10, Math.round(obs.h * 0.28));
            const px = x + (obs.w - padW) / 2;
            const py = y + obs.h - padH - Math.max(2, Math.round(obs.h * 0.06));
            const radius = Math.max(3, Math.round(padH * 0.45));

            ctx.save();
            ctx.globalAlpha = 0.35;
            ctx.fillStyle = glowColor;
            ctx.beginPath();
            ctx.roundRect(px - 2, py - 2, padW + 4, padH + 5, radius + 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            ctx.fillStyle = bodyColor;
            ctx.beginPath();
            ctx.roundRect(px, py, padW, padH, radius);
            ctx.fill();

            ctx.fillStyle = topColor;
            ctx.beginPath();
            ctx.roundRect(px + 2, py + 2, padW - 4, Math.max(3, Math.round(padH * 0.45)), Math.max(2, radius - 1));
            ctx.fill();

            const arrowW = Math.max(8, Math.round(padW * 0.22));
            const arrowH = Math.max(5, Math.round(padH * 0.36));
            const ax = px + (padW - arrowW) / 2;
            const ay = py + Math.max(1, Math.round(padH * 0.52));
            ctx.fillStyle = arrowColor;
            ctx.beginPath();
            ctx.moveTo(ax, ay + arrowH);
            ctx.lineTo(ax + arrowW / 2, ay);
            ctx.lineTo(ax + arrowW, ay + arrowH);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = Math.max(2, getScaled(2));
            ctx.beginPath();
            ctx.roundRect(px, py, padW, padH, radius);
            ctx.stroke();
            ctx.restore();
        }
    };

    if (rotation === 0) {
        drawAt(sx, sy);
        return;
    }
    ctx.save();
    const cx = sx + obs.w / 2;
    const cy = sy + obs.h / 2;
    ctx.translate(cx, cy);
    ctx.rotate(rotation * Math.PI / 180);
    drawAt(-obs.w / 2, -obs.h / 2);
    ctx.restore();
}

function checkCollision(p, obs, screenX) {
    return !(p.x + p.width < screenX || p.x > screenX + obs.w || p.y + p.height < obs.y || p.y > obs.y + obs.h);
}

function getSpikeHitbox(obs, screenX) {
    const rot = normalizeRotation(obs.rotation);
    const insetX = Math.round(obs.w * 0.30);
    const insetBase = Math.round(obs.h * 0.10);
    let hx, hy, hw, hh;

    if (rot === 0) {
        hw = Math.max(4, obs.w - insetX * 2);
        hh = Math.max(4, Math.round(obs.h * 0.60));
        hx = screenX + insetX;
        hy = obs.y + insetBase;
    } else if (rot === 180) {
        hw = Math.max(4, obs.w - insetX * 2);
        hh = Math.max(4, Math.round(obs.h * 0.60));
        hx = screenX + insetX;
        hy = obs.y + obs.h - insetBase - hh;
    } else if (rot === 90) {
        hw = Math.max(4, Math.round(obs.w * 0.60));
        hh = Math.max(4, obs.h - insetX * 2);
        hx = screenX + obs.w - insetBase - hw;
        hy = obs.y + insetX;
    } else {
        hw = Math.max(4, Math.round(obs.w * 0.60));
        hh = Math.max(4, obs.h - insetX * 2);
        hx = screenX + insetBase;
        hy = obs.y + insetX;
    }

    return { x: hx, y: hy, w: hw, h: hh };
}

function createDeathParticles() {
    particles = [];
    const worldX = cameraX + player.x + player.width / 2;
    const worldY = player.y + player.height / 2;
    for (let i = 0; i < 28; i++) {
        const angle = Math.random() * Math.PI * 2;
        const vel = 2 + Math.random() * 6;
        particles.push({ x: worldX, y: worldY, vx: Math.cos(angle) * vel, vy: Math.sin(angle) * vel - 3, life: 45 + Math.random() * 20, color: `hsl(${195 + Math.random() * 35}, 100%, 62%)` });
    }
}

function createDeathExplosion() {
    deathExplosion = {
        x: cameraX + player.x + player.width / 2,
        y: player.y + player.height / 2,
        radius: 8,
        life: 30,
        maxLife: 30
    };
    deathFlash = 1;
}

function updateDeathExplosion(dt = 1) {
    if (!deathExplosion) return;
    deathExplosion.life -= dt;
    deathExplosion.radius += 7.5 * dt;
    deathFlash = Math.max(0, deathFlash - 0.08 * dt);
    if (deathExplosion.life <= 0) deathExplosion = null;
}

function drawDeathExplosion(ctx, camY = 0) {
    if (!deathExplosion && deathFlash <= 0) return;

    if (deathFlash > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(0.35, deathFlash * 0.35);
        ctx.fillStyle = '#dff6ff';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }

    if (!deathExplosion) return;
    const t = deathExplosion.life / deathExplosion.maxLife;
    const sx = deathExplosion.x - cameraX;
    const sy = deathExplosion.y - camY;
    ctx.save();
    ctx.globalAlpha = Math.max(0, 0.95 * t);
    ctx.lineWidth = Math.max(3, getScaled(3));
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sx, sy, deathExplosion.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = Math.max(0, 0.75 * t);
    ctx.strokeStyle = '#7fd8ff';
    ctx.beginPath();
    ctx.arc(sx, sy, deathExplosion.radius * 0.68, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = Math.max(0, 0.55 * t);
    ctx.fillStyle = '#8ee7ff';
    ctx.beginPath();
    ctx.arc(sx, sy, Math.max(4, deathExplosion.radius * 0.28), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function updateParticles(dt = 1) {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 0.28 * dt; p.life -= dt;
        if (p.life <= 0) particles.splice(i, 1);
    }
}

function drawParticles(ctx, camY = 0) {
    const particleSize = getScaled(8);
    for (let p of particles) {
        ctx.globalAlpha = p.life / 50;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - cameraX, p.y - camY, particleSize, particleSize);
    }
    ctx.globalAlpha = 1;
}

function spawnTrailParticle() {
    const size = Math.max(3, Math.round(player.width * 0.24));
    const jitter = Math.max(1, Math.round(player.width * 0.08));
    const worldX = cameraX + player.x + player.width * 0.15 + (Math.random() * jitter - jitter / 2);
    // Keep trail near cube bottom; this is half-step lower than previous tweak.
    const baseY = player.y + player.height - size * 0.05 + (Math.random() * jitter - jitter / 2);
    trailParticles.push({
        worldX,
        baseY,
        size,
        life: 18
    });
    if (trailParticles.length > 90) trailParticles.splice(0, trailParticles.length - 90);
}

function updateTrail(dt = 1) {
    for (let i = trailParticles.length - 1; i >= 0; i--) {
        const t = trailParticles[i];
        t.life -= dt;
        t.size = Math.max(1, t.size * (1 - 0.04 * dt));
        if (t.life <= 0) trailParticles.splice(i, 1);
    }
}

function drawTrail(ctx) {
    for (let t of trailParticles) {
        ctx.globalAlpha = t.life / 18;
        ctx.fillStyle = '#7fffd4';
        // Anchor particle bottom while size shrinks, so it stays on the same line.
        const drawY = t.baseY - t.size;
        ctx.fillRect(t.worldX - cameraX, drawY, t.size, t.size);
    }
    ctx.globalAlpha = 1;
}

function triggerDeath() {
    if (testPlayActive) {
        returnToEditorFromTestPlay();
        return;
    }
    playerVisible = false;
    gameOver = true;
    deathRestartTimer = 420;
    createDeathParticles();
    createDeathExplosion();
    playDeathSound();
    bgMusic.pause();
}

function gameUpdate(dt) {
    if (!gameRunning || paused || gameOver || won) {
        // still draw
    } else {
        if (padTriggerCooldown > 0) padTriggerCooldown -= dt;
        const gravityScale = lowGravityEnabled ? 0.65 : 1;
        player.dy += gravity * gravityDirection * gravityScale * dt;
        player.y += player.dy * dt;

        player.onGround = false;
        if (player.y >= groundY - player.height) {
            player.y = groundY - player.height;
            player.dy = 0;
            player.onGround = true;
            player.angle = Math.round(player.angle / 90) * 90;
        }

        for (let obs of obstacles) {
            if (obs.type !== 'block') continue;
            const sx = obs.worldX - cameraX;
            if (sx < -100 || sx > gameCanvas.width + 100) continue;
            const overlapsX = player.x + player.width > sx && player.x < sx + obs.w;
            if (!overlapsX) continue;

            if (gravityDirection === 1) {
                if (player.dy > 0 &&
                    player.y + player.height > obs.y &&
                    player.y + player.height - player.dy * dt <= obs.y) {
                    player.y = obs.y - player.height;
                    player.dy = 0;
                    player.onGround = true;
                    player.angle = Math.round(player.angle / 90) * 90;
                    break;
                }
            } else {
                const obsBottom = obs.y + obs.h;
                if (player.dy < 0 &&
                    player.y < obsBottom &&
                    player.y - player.dy * dt >= obsBottom) {
                    player.y = obsBottom;
                    player.dy = 0;
                    player.onGround = true;
                    player.angle = Math.round(player.angle / 90) * 90;
                    break;
                }
            }
        }

        // Auto trigger pads on touch (yellow jumps, blue flips gravity).
        for (let obs of obstacles) {
            if (obs.type !== 'yellowPad' && obs.type !== 'bluePad' && obs.type !== 'pinkPad') continue;
            const sx = obs.worldX - cameraX;
            if (sx < -100 || sx > gameCanvas.width + 100) continue;
            if (padTriggerCooldown > 0) continue;
            const padInsetX = Math.max(1, Math.round(obs.w * 0.08));
            const padTop = obs.y + Math.round(obs.h * 0.45);
            const padBottom = obs.y + obs.h;
            if (
                player.x + player.width > sx + padInsetX &&
                player.x < sx + obs.w - padInsetX &&
                player.y + player.height >= padTop &&
                player.y < padBottom
            ) {
                if (obs.type === 'yellowPad') {
                    player.dy = getJumpVelocity(1.12);
                    player.onGround = false;
                } else if (obs.type === 'pinkPad') {
                    player.dy = getJumpVelocity(0.80);
                    player.onGround = false;
                } else {
                    flipGravity();
                    player.dy = gravityDirection * getScaled(2.8);
                }
                padTriggerCooldown = 8;
                orbConsumedThisHold = true;
                break;
            }
        }

        // Orbs: one activation per hold. Yellow jumps, blue flips gravity.
        if (jumpPressedThisFrame || (jumpHeld && !orbConsumedThisHold)) {
            for (let obs of obstacles) {
                if (obs.type !== 'yellowOrb' && obs.type !== 'blueOrb' && obs.type !== 'pinkOrb') continue;
                if (obs._consumed) continue;
                const sx = obs.worldX - cameraX;
                if (sx < -120 || sx > gameCanvas.width + 120) continue;
                const orbExpand = Math.max(6, Math.round(obs.w * 0.28));
                const orbLeft = sx - orbExpand;
                const orbRight = sx + obs.w + orbExpand;
                const orbTop = obs.y - orbExpand;
                const orbBottom = obs.y + obs.h + orbExpand;
                if (
                    player.x + player.width > orbLeft &&
                    player.x < orbRight &&
                    player.y + player.height > orbTop &&
                    player.y < orbBottom
                ) {
                    if (obs.type === 'yellowOrb') {
                        player.dy = getJumpVelocity(1.04);
                        player.onGround = false;
                    } else if (obs.type === 'pinkOrb') {
                        player.dy = getJumpVelocity(0.78);
                        player.onGround = false;
                    } else {
                        flipGravity();
                        player.dy = gravityDirection * getScaled(2.4);
                    }
                    obs._consumed = true;
                    orbConsumedThisHold = true;
                    jumpBuffer = 0;
                    playJumpSound();
                    break;
                }
            }
        }

        // Hold-jump behavior: while jump key is held, keep buffering a normal jump.
        if (jumpHeld) jumpBuffer = Math.max(jumpBuffer, 10);
        if (autoJumpEnabled && player.onGround) jumpBuffer = Math.max(jumpBuffer, 10);

        if (jumpBuffer > 0) {
            const canAirJump = infiniteJumpsEnabled && jumpPressedThisFrame;
            if (player.onGround || canAirJump) {
                player.dy = getJumpVelocity();
                player.onGround = false;
                playJumpSound();
                jumpBuffer = 0;
            } else {
                jumpBuffer -= dt;
            }
        }

        cameraX += speed * dt;
        score = Math.floor(cameraX / 7);
        document.getElementById('score').textContent = score;

        if (cameraX > levelLength) won = true;

        let died = false;
        for (let obs of obstacles) {
            const sx = obs.worldX - cameraX;
            if (sx < -100 || sx > gameCanvas.width + 100) continue;

            if (obs.type === 'spike') {
                const hb = getSpikeHitbox(obs, sx);
                const overlapX = player.x + player.width > hb.x && player.x < hb.x + hb.w;
                const overlapY = player.y + player.height > hb.y && player.y < hb.y + hb.h;
                if (overlapX && overlapY) {
                    died = true;
                    break;
                }
            } else if (obs.type === 'block') {
                if (!checkCollision(player, obs, sx)) continue;
                if (gravityDirection === 1 && player.y + player.height > obs.y + getScaled(8)) {
                    died = true;
                    break;
                }
                if (gravityDirection === -1 && player.y < obs.y + obs.h - getScaled(8)) {
                    died = true;
                    break;
                }
            }
        }
        if (died && !noclipEnabled) triggerDeath();

        if (noRotationEnabled) {
            player.angle = 0;
        } else if (!player.onGround) {
            player.angle += 7.5 * dt;
        }

        const followBaseY = groundY - player.height;
        const upDeadZone = Math.max(getScaled(56), player.height);
        let targetGameCameraY = 0;
        if (player.y < followBaseY - upDeadZone) {
            targetGameCameraY = player.y - (followBaseY - upDeadZone);
        }
        targetGameCameraY = Math.min(0, targetGameCameraY);
        gameCameraY += (targetGameCameraY - gameCameraY) * 0.12 * dt;

        if (trailEnabled && player.onGround) spawnTrailParticle();
        updateTrail(dt);
        updateParticles(dt);
    }

    if (!gameRunning || paused || gameOver || won) {
        gameCameraY += (0 - gameCameraY) * 0.14 * dt;
        updateTrail(dt);
        if (gameOver) {
            updateParticles(dt);
            updateDeathExplosion(dt);
            deathRestartTimer -= 16.6667 * dt;
            if (deathRestartTimer <= 0) {
                resetGame();
            }
        }
    }

    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawBackground(gameCtx, cameraX);
    drawGround(gameCtx, cameraX, gameCameraY);
    if (showGameGridEnabled) drawGameGrid(gameCtx, cameraX, gameCameraY);

    for (let obs of obstacles) {
        const sx = obs.worldX - cameraX;
        if (sx > -80 && sx < gameCanvas.width + 80) drawObstacle(gameCtx, obs, sx, gameCameraY);
    }

    if (showHitboxesEnabled) {
        gameCtx.save();
        const hazardColor = 'rgba(230, 40, 40, 0.9)';
        const solidColor = 'rgba(40, 110, 220, 0.9)';
        const interactColor = 'rgba(40, 200, 90, 0.9)';
        gameCtx.lineWidth = 2;

        // Player hitbox
        gameCtx.strokeStyle = solidColor;
        gameCtx.strokeRect(player.x, player.y - gameCameraY, player.width, player.height);

        for (let obs of obstacles) {
            const sx = obs.worldX - cameraX;
            if (sx < -80 || sx > gameCanvas.width + 80) continue;
            if (obs.type === 'spike') {
                const hb = getSpikeHitbox(obs, sx);
                gameCtx.strokeStyle = hazardColor;
                gameCtx.strokeRect(hb.x, hb.y - gameCameraY, hb.w, hb.h);
            } else if (obs.type === 'block') {
                gameCtx.strokeStyle = solidColor;
                gameCtx.strokeRect(sx, obs.y - gameCameraY, obs.w, obs.h);
            } else {
                gameCtx.strokeStyle = interactColor;
                gameCtx.strokeRect(sx, obs.y - gameCameraY, obs.w, obs.h);
            }
        }
        gameCtx.restore();
    }

    drawTrail(gameCtx);
    if (playerVisible) drawPlayer(gameCtx, gameCameraY);
    drawParticles(gameCtx, gameCameraY);
    drawDeathExplosion(gameCtx, gameCameraY);

    if (won) {
        gameCtx.fillStyle = 'rgba(0,255,120,0.3)';
        gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        gameCtx.fillStyle = '#00ff99';
        gameCtx.font = 'bold 68px Impact';
        gameCtx.textAlign = 'center';
        gameCtx.fillText('LEVEL COMPLETE!', gameCanvas.width / 2, gameCanvas.height / 2 - 25);
        gameCtx.font = '28px Arial';
        gameCtx.fillStyle = '#fff';
        gameCtx.fillText(`SCORE ${score} — PRESS R TO PLAY AGAIN`, gameCanvas.width / 2, gameCanvas.height / 2 + 55);
    }
    if (paused && !gameOver && !won) {
        gameCtx.fillStyle = 'rgba(0,0,0,0.7)';
        gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        gameCtx.fillStyle = '#00ffff';
        gameCtx.font = 'bold 80px Impact';
        gameCtx.textAlign = 'center';
        gameCtx.fillText('PAUSED', gameCanvas.width / 2, gameCanvas.height / 2 - 10);
        gameCtx.font = '30px Arial';
        gameCtx.fillStyle = '#fff';
        gameCtx.fillText('Click PAUSE to resume', gameCanvas.width / 2, gameCanvas.height / 2 + 60);
    }

    jumpPressedThisFrame = false;
}

// INPUT
function isJumpKeyEvent(e) {
    return e.code === 'Space' || e.code === 'ArrowUp' || e.key.toLowerCase() === 'w';
}

function registerJumpPress() {
    if (!jumpHeld) {
        jumpPressedThisFrame = true;
        jumpBuffer = 10;
        orbConsumedThisHold = false;
    }
    jumpHeld = true;
}

function releaseJumpHold() {
    jumpHeld = false;
    orbConsumedThisHold = false;
}

document.addEventListener('keydown', e => {
    if (!e.repeat) playFireInTheHole();
    if (currentScreen === 'game' && gameRunning) {
        if (e.key.toLowerCase() === 'r') { resetGame(); return; }
        if (e.key === 'Escape') {
            if (testPlayActive) {
                returnToEditorFromTestPlay();
            } else {
                goToMenu();
            }
            return;
        }
        if (!gameOver && !won && isJumpKeyEvent(e)) {
            if (!e.repeat) registerJumpPress();
            e.preventDefault();
        }
    }
    if (currentScreen === 'editor' && editorRunning) {
        const hasSelection = editorPanelMode === 'edit' && selectedIndices.size > 0;
        if (e.key === 'a') editorCameraX = Math.max(0, editorCameraX - 80);
        if (e.key === 'd') editorCameraX += 80;
        if (e.key.toLowerCase() === 'w') editorCameraY = clampEditorCameraY(editorCameraY - 80);
        if (e.key.toLowerCase() === 's') editorCameraY = clampEditorCameraY(editorCameraY + 80);
        if (e.key === '1') setEditorPanelMode('objects');
        if (e.key === '2') setEditorPanelMode('interactable');
        if (e.key === '3') setEditorPanelMode('edit');
        if (e.key === '4') setEditorPanelMode('view');
        if (e.key.toLowerCase() === 'r' && editorPanelMode === 'edit' && betterEditEnabled) {
            window.rotateSelectedObject();
            e.preventDefault();
        }
        if (e.key === 'Backspace' && editorPanelMode === 'edit') {
            window.deleteSelectedObject();
            e.preventDefault();
        }
        if (editorPanelMode === 'edit' && betterEditEnabled) {
            if (e.ctrlKey && e.key.toLowerCase() === 'c') {
                window.copySelectedObject();
                e.preventDefault();
            }
            if (e.ctrlKey && e.key.toLowerCase() === 'v') {
                window.pasteObject();
                e.preventDefault();
            }
        }
        if (editorPanelMode === 'edit' && e.ctrlKey && e.key.toLowerCase() === 'a') {
            selectedIndices.clear();
            for (let i = 0; i < obstacles.length; i++) selectedIndices.add(i);
            selectedObstacleIndex = obstacles.length > 0 ? 0 : -1;
            e.preventDefault();
        }
        if (editorPanelMode === 'edit' && !e.ctrlKey) {
            if (e.key === 'ArrowLeft') { window.moveSelectedObject(-1, 0); e.preventDefault(); }
            if (e.key === 'ArrowRight') { window.moveSelectedObject(1, 0); e.preventDefault(); }
            if (e.key === 'ArrowUp') { window.moveSelectedObject(0, -1); e.preventDefault(); }
            if (e.key === 'ArrowDown') { window.moveSelectedObject(0, 1); e.preventDefault(); }
        }
        if (e.key === 'Escape') exitEditor();
    }
});

document.addEventListener('keyup', e => {
    if (!isJumpKeyEvent(e)) return;
    releaseJumpHold();
});

document.addEventListener('mousedown', e => {
    if (e.target === gameCanvas) return;
    playFireInTheHole();
});

document.addEventListener('touchstart', e => {
    if (e.target === gameCanvas) return;
    playFireInTheHole();
}, { passive: true });

gameCanvas.addEventListener('mousedown', () => {
    playFireInTheHole();
    if (currentScreen !== 'game' || !gameRunning || gameOver || won) return;
    registerJumpPress();
});
gameCanvas.addEventListener('mouseup', () => releaseJumpHold());
gameCanvas.addEventListener('mouseleave', () => releaseJumpHold());
gameCanvas.addEventListener('touchstart', () => {
    playFireInTheHole();
    if (currentScreen !== 'game' || !gameRunning || gameOver || won) return;
    registerJumpPress();
}, { passive: true });
gameCanvas.addEventListener('touchend', () => releaseJumpHold());
gameCanvas.addEventListener('touchcancel', () => releaseJumpHold());

// EDITOR - spikes forced to ground level, blocks free air
function placeOrErase(e) {
    const rect = editorCanvas.getBoundingClientRect();
    const pointer = e.touches ? e.touches[0] : (e.changedTouches ? e.changedTouches[0] : e);
    const rawWorldX = pointer.clientX - rect.left + editorCameraX;
    const rawY = pointer.clientY - rect.top + editorCameraY;

    let wx = Math.floor(rawWorldX / gridSize) * gridSize;
    let wy = Math.floor(rawY / gridSize) * gridSize; // snapped to grid

    // Optional ground snap if near the bottom of canvas
    const groundLine = groundY;
    const blockHeight = gridSize;
    if (wy + blockHeight > groundLine) {
        wy = groundLine - blockHeight;
    }

    if (editorTool === 2) {
        // Erase whichever object the pointer touches, not only exact snapped cell.
        const hitIndex = obstacles.findIndex(o =>
            rawWorldX >= o.worldX &&
            rawWorldX <= o.worldX + o.w &&
            rawY >= o.y &&
            rawY <= o.y + o.h
        );
        if (hitIndex >= 0) {
            obstacles.splice(hitIndex, 1);
            // Rebuild selectedIndices adjusting for removed index
            const newSet = new Set();
            for (const i of selectedIndices) {
                if (i < hitIndex) newSet.add(i);
                else if (i > hitIndex) newSet.add(i - 1);
                // i === hitIndex: dropped
            }
            selectedIndices = newSet;
            selectedObstacleIndex = selectedIndices.size > 0 ? [...selectedIndices][0] : -1;
        }
    } else {
        let type = 'block';
        if (editorTool === 1) type = 'spike';
        else if (editorTool === 3) type = 'yellowOrb';
        else if (editorTool === 4) type = 'yellowPad';
        else if (editorTool === 5) type = 'blueOrb';
        else if (editorTool === 6) type = 'bluePad';
        else if (editorTool === 7) type = 'pinkOrb';
        else if (editorTool === 8) type = 'pinkPad';

        // add block or spike
        obstacles.push({
            type,
            worldX: wx,
            y: wy,
            w: gridSize,
            h: blockHeight,
            rotation: 0
        });
    }
}

function getAllObstacleIndicesAt(worldX, worldY) {
    const result = [];
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        if (worldX >= o.worldX && worldX <= o.worldX + o.w && worldY >= o.y && worldY <= o.y + o.h)
            result.push(i);
    }
    return result;
}

function getObstacleIndexAt(worldX, worldY) {
    const all = getAllObstacleIndicesAt(worldX, worldY);
    return all.length > 0 ? all[0] : -1;
}

let lastClickWorldX = null;
let lastClickWorldY = null;
let lastStackCycleIndex = -1;
let isDragSelecting = false;
let dragSelectStartX = 0;
let dragSelectStartY = 0;
let dragSelectEndX = 0;
let dragSelectEndY = 0;

function selectObstacleAtPointer(e) {
    const rect = editorCanvas.getBoundingClientRect();
    const pointer = e.touches ? e.touches[0] : (e.changedTouches ? e.changedTouches[0] : e);
    const worldX = pointer.clientX - rect.left + editorCameraX;
    const worldY = pointer.clientY - rect.top + editorCameraY;

    const stack = getAllObstacleIndicesAt(worldX, worldY);

    if (e.shiftKey) {
        // Shift+click: toggle top object in/out of selection
        if (stack.length > 0) {
            const idx = stack[0];
            if (selectedIndices.has(idx)) selectedIndices.delete(idx);
            else selectedIndices.add(idx);
        }
        lastClickWorldX = null; // reset cycle on shift click
    } else {
        if (stack.length <= 1) {
            // No stack — normal single select
            selectedIndices.clear();
            if (stack.length === 1) selectedIndices.add(stack[0]);
            lastClickWorldX = null;
            lastStackCycleIndex = -1;
        } else {
            // Stack detected — cycle through on repeated clicks at same spot
            const sameSpot = lastClickWorldX === Math.floor(worldX / gridSize) &&
                lastClickWorldY === Math.floor(worldY / gridSize);
            if (sameSpot) {
                // Advance cycle
                const currentPos = stack.indexOf(lastStackCycleIndex);
                const nextPos = (currentPos + 1) % stack.length;
                lastStackCycleIndex = stack[nextPos];
            } else {
                // New spot — start at top of stack
                lastStackCycleIndex = stack[0];
            }
            lastClickWorldX = Math.floor(worldX / gridSize);
            lastClickWorldY = Math.floor(worldY / gridSize);
            selectedIndices.clear();
            selectedIndices.add(lastStackCycleIndex);
        }
    }

    selectedObstacleIndex = selectedIndices.size > 0 ? [...selectedIndices][0] : -1;
}

window.deleteSelectedObject = function () {
    if (selectedIndices.size === 0) return;
    // Delete in reverse index order so indices stay valid
    const sorted = [...selectedIndices].sort((a, b) => b - a);
    for (const idx of sorted) {
        if (idx >= 0 && idx < obstacles.length) obstacles.splice(idx, 1);
    }
    selectedIndices.clear();
    selectedObstacleIndex = -1;
};

window.rotateSelectedObject = function () {
    if (!betterEditEnabled) return;
    if (selectedIndices.size === 0) return;
    for (const idx of selectedIndices) {
        if (idx < 0 || idx >= obstacles.length) continue;
        const o = obstacles[idx];
        o.rotation = normalizeRotation((o.rotation || 0) + 90);
    }
};

let clipboardObstacle = null;
let clipboardObstacles = [];

window.copySelectedObject = function () {
    if (!betterEditEnabled) return;
    if (selectedIndices.size === 0) return;
    clipboardObstacles = [...selectedIndices]
        .filter(i => i >= 0 && i < obstacles.length)
        .map(i => ({ ...obstacles[i] }));
    // Legacy single compat
    clipboardObstacle = clipboardObstacles[0] || null;
    updateBetterEditButtons();
};

window.pasteObject = function () {
    if (!betterEditEnabled || clipboardObstacles.length === 0) return;
    selectedIndices.clear();
    for (const src of clipboardObstacles) {
        const pasted = { ...src, worldX: src.worldX + gridSize };
        obstacles.push(pasted);
        selectedIndices.add(obstacles.length - 1);
    }
    selectedObstacleIndex = [...selectedIndices][0] ?? -1;
    updateBetterEditButtons();
};

window.moveSelectedObject = function (dx, dy) {
    if (selectedIndices.size === 0) return;
    for (const idx of selectedIndices) {
        if (idx < 0 || idx >= obstacles.length) continue;
        const o = obstacles[idx];
        o.worldX = Math.max(0, o.worldX + dx * gridSize);
        o.y = snapToGrid(Math.min(groundY - o.h, o.y + dy * gridSize));
    }
};

function updateBetterEditButtons() {
    const copyBtn = document.getElementById('copyBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    if (!copyBtn || !pasteBtn) return;
    copyBtn.style.display = betterEditEnabled ? '' : 'none';
    pasteBtn.style.display = betterEditEnabled ? '' : 'none';
}
window.updateBetterEditButtons = updateBetterEditButtons;

function getPointerClientX(e) {
    const pointer = e.touches ? e.touches[0] : (e.changedTouches ? e.changedTouches[0] : e);
    return pointer.clientX;
}

function getPointerClientY(e) {
    const pointer = e.touches ? e.touches[0] : (e.changedTouches ? e.changedTouches[0] : e);
    return pointer.clientY;
}

function beginEditorDrag(e) {
    if (editorPanelMode === 'edit' && e.shiftKey && betterEditEnabled) {
        // Shift+drag: start rectangle selection
        const rect = editorCanvas.getBoundingClientRect();
        const cx = getPointerClientX(e) - rect.left;
        const cy = getPointerClientY(e) - rect.top;
        isDragSelecting = true;
        dragSelectStartX = cx + editorCameraX;
        dragSelectStartY = cy + editorCameraY;
        dragSelectEndX = dragSelectStartX;
        dragSelectEndY = dragSelectStartY;
        editDragMoved = false;
        return;
    }
    if (editorPanelMode === 'view' || editorPanelMode === 'edit') {
        isViewDragging = true;
        lastViewDragX = getPointerClientX(e);
        lastViewDragY = getPointerClientY(e);
        if (editorPanelMode === 'edit') editDragMoved = false;
    } else if (editorPanelMode === 'objects' || editorPanelMode === 'interactable') {
        isMouseDown = true;
        placeOrErase(e);
    }
}

function moveEditorDrag(e) {
    if (isDragSelecting) {
        const rect = editorCanvas.getBoundingClientRect();
        dragSelectEndX = getPointerClientX(e) - rect.left + editorCameraX;
        dragSelectEndY = getPointerClientY(e) - rect.top + editorCameraY;
        editDragMoved = true;
        return;
    }
    if (editorPanelMode === 'view' || editorPanelMode === 'edit') {
        if (!isViewDragging) return;
        const x = getPointerClientX(e);
        const y = getPointerClientY(e);
        const dx = x - lastViewDragX;
        const dy = y - lastViewDragY;
        if (editorPanelMode === 'edit' && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) editDragMoved = true;
        editorCameraX = Math.max(0, editorCameraX - dx);
        editorCameraY = clampEditorCameraY(editorCameraY - dy);
        lastViewDragX = x;
        lastViewDragY = y;
        return;
    }
    if ((editorPanelMode === 'objects' || editorPanelMode === 'interactable') && isMouseDown) placeOrErase(e);
}

function endEditorDrag(e) {
    if (isDragSelecting) {
        isDragSelecting = false;
        const rx1 = Math.min(dragSelectStartX, dragSelectEndX);
        const rx2 = Math.max(dragSelectStartX, dragSelectEndX);
        const ry1 = Math.min(dragSelectStartY, dragSelectEndY);
        const ry2 = Math.max(dragSelectStartY, dragSelectEndY);
        // Add to existing selection — don't clear
        for (let i = 0; i < obstacles.length; i++) {
            const o = obstacles[i];
            if (o.worldX + o.w > rx1 && o.worldX < rx2 && o.y + o.h > ry1 && o.y < ry2) {
                selectedIndices.add(i);
            }
        }
        selectedObstacleIndex = selectedIndices.size > 0 ? [...selectedIndices][0] : -1;
        editDragMoved = false;
        return;
    }
    if (editorPanelMode === 'edit' && !editDragMoved && e) {
        selectObstacleAtPointer(e);
    }
    isMouseDown = false;
    isViewDragging = false;
    editDragMoved = false;
}

editorCanvas.addEventListener('mousedown', e => beginEditorDrag(e));
editorCanvas.addEventListener('mousemove', e => moveEditorDrag(e));
editorCanvas.addEventListener('mouseup', e => endEditorDrag(e));
editorCanvas.addEventListener('mouseleave', () => endEditorDrag());
editorCanvas.addEventListener('touchstart', e => { beginEditorDrag(e); e.preventDefault(); }, { passive: false });
editorCanvas.addEventListener('touchmove', e => { moveEditorDrag(e); e.preventDefault(); }, { passive: false });
editorCanvas.addEventListener('touchend', e => endEditorDrag(e));
editorCanvas.addEventListener('touchcancel', () => endEditorDrag());

window.setTool = t => {
    editorTool = t;
    const editorScreen = document.getElementById('editorScreen');
    const toolButtons = editorScreen.querySelectorAll('.tool-icon-btn[data-tool]');
    toolButtons.forEach(btn => btn.classList.toggle('tool-selected', Number(btn.dataset.tool) === t));
};

window.setEditorPanelMode = function (mode) {
    editorPanelMode = ['objects', 'interactable', 'edit', 'view'].includes(mode) ? mode : 'objects';
    if (editorPanelMode === 'objects' && editorTool > 2) setTool(0);
    if (editorPanelMode === 'interactable' && (editorTool < 3 || editorTool > 10)) setTool(3);
    if (editorPanelMode !== 'edit') { selectedObstacleIndex = -1; selectedIndices.clear(); }
    endEditorDrag();
    const objectsTools = document.getElementById('objectsModeTools');
    const interactableTools = document.getElementById('interactableModeTools');
    const editTools = document.getElementById('editModeTools');
    const viewTools = document.getElementById('viewModeTools');
    const objectsModeBtn = document.getElementById('objectsModeBtn');
    const interactableModeBtn = document.getElementById('interactableModeBtn');
    const editModeBtn = document.getElementById('editModeBtn');
    const viewModeBtn = document.getElementById('viewModeBtn');

    if (objectsTools) objectsTools.classList.toggle('hidden', editorPanelMode !== 'objects');
    if (interactableTools) interactableTools.classList.toggle('hidden', editorPanelMode !== 'interactable');
    if (editTools) editTools.classList.toggle('hidden', editorPanelMode !== 'edit');
    if (viewTools) viewTools.classList.toggle('hidden', editorPanelMode !== 'view');
    if (objectsModeBtn) objectsModeBtn.classList.toggle('active', editorPanelMode === 'objects');
    if (interactableModeBtn) interactableModeBtn.classList.toggle('active', editorPanelMode === 'interactable');
    if (editModeBtn) editModeBtn.classList.toggle('active', editorPanelMode === 'edit');
    if (viewModeBtn) viewModeBtn.classList.toggle('active', editorPanelMode === 'view');
};

function sanitizeLevelObstacles(value) {
    if (!Array.isArray(value)) return null;
    const allowedTypes = new Set(['block', 'spike', 'yellowOrb', 'yellowPad', 'blueOrb', 'bluePad', 'pinkOrb', 'pinkPad']);

    const cleaned = [];
    for (const o of value) {
        if (!o || !allowedTypes.has(o.type)) continue;
        const worldX = Number(o.worldX);
        const y = Number(o.y);
        const w = Number(o.w);
        const h = Number(o.h);
        if (!Number.isFinite(worldX) || !Number.isFinite(y) || !Number.isFinite(w) || !Number.isFinite(h)) continue;
        cleaned.push({ type: o.type, worldX, y, w, h, rotation: normalizeRotation(o.rotation) });
    }
    return cleaned.length > 0 ? cleaned : [];
}

function encodeLevelCode() {
    const payload = { v: 1, obstacles };
    const json = JSON.stringify(payload);
    return btoa(unescape(encodeURIComponent(json)));
}

function decodeLevelCode(code) {
    const json = decodeURIComponent(escape(atob(code.trim())));
    const payload = JSON.parse(json);
    if (!payload || payload.v !== 1) throw new Error('Unsupported level code version.');
    const parsed = sanitizeLevelObstacles(payload.obstacles);
    if (!parsed) throw new Error('Invalid level data.');
    return parsed;
}

function getStoredLevel() {
    try {
        const raw = localStorage.getItem('gdLevel');
        if (!raw) return null;
        const parsed = sanitizeLevelObstacles(JSON.parse(raw));
        return parsed || null;
    } catch {
        return null;
    }
}

window.saveLevel = () => {
    try {
        const code = encodeLevelCode();
        localStorage.setItem('gdLevelCode', code);
        localStorage.setItem('gdLevel', JSON.stringify(obstacles));
        window.prompt('Copy your level code:', code);
    } catch {
        alert('Failed to generate level code.');
    }
};

window.loadLevel = () => {
    const lastCode = localStorage.getItem('gdLevelCode') || '';
    const code = window.prompt('Paste level code:', lastCode);
    if (code === null) return;

    try {
        const loaded = decodeLevelCode(code);
        obstacles = loaded;
        normalizeObstaclesToGrid();
        localStorage.setItem('gdLevelCode', code.trim());
        localStorage.setItem('gdLevel', JSON.stringify(obstacles));
        alert('Level loaded from code.');
    } catch {
        alert('Invalid level code.');
    }
};

window.clearLevel = () => {
    if (!window.confirm('Clear all objects from this level?')) return;
    obstacles = [];
    selectedObstacleIndex = -1;
    selectedIndices.clear();
    localStorage.setItem('gdLevel', JSON.stringify(obstacles));
    localStorage.removeItem('gdLevelCode');
};

window.testPlay = () => {
    levelLength = Math.max(2500, Math.max(...obstacles.map(o => o.worldX)) + 800 || 3000);
    testPlayActive = true;
    startGameWithCurrentLevel();
};

// Screens
window.startCustomLevel = function () {
    testPlayActive = false;
    obstacles = getStoredLevel() || getDefaultLevel();
    normalizeObstaclesToGrid();
    levelLength = Math.max(2500, Math.max(...obstacles.map(o => o.worldX)) + 800 || 4000);
    document.getElementById('levelSelectScreen').classList.add('hidden');
    document.getElementById('menuScreen').classList.add('hidden');
    stopMenuAmbient();
    document.getElementById('gameScreen').classList.remove('hidden');
    currentScreen = 'game';
    bgMusic.currentTime = 0; bgMusic.play().catch(() => { });
    resetGame();
    gameRunning = true;
    requestAnimationFrame(gameLoop);
};

function startGameWithCurrentLevel() {
    document.getElementById('editorScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    currentScreen = 'game';
    bgMusic.play().catch(() => { });
    resetGame();
    gameRunning = true;
    requestAnimationFrame(gameLoop);
}

function returnToEditorFromTestPlay() {
    gameRunning = false;
    paused = false;
    gameOver = false;
    won = false;
    jumpBuffer = 0;
    jumpPressedThisFrame = false;
    jumpHeld = false;
    orbConsumedThisHold = false;
    gravityDirection = 1;
    padTriggerCooldown = 0;
    bgMusic.pause();
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('editorScreen').classList.remove('hidden');
    currentScreen = 'editor';
    editorRunning = true;
    testPlayActive = false;
    setEditorPanelMode('view');
    requestAnimationFrame(editorLoop);
}

function resetGame() {
    speedhackFrameCounter = 0;
    speedhackAccumulator = 0;
    lastFrameTime = 0;
    cameraX = 0;
    gameCameraY = 0;
    player.x = getPlayerStartX();
    player.y = groundY - player.height;
    player.dy = 0; player.angle = 0; player.onGround = true;
    playerVisible = true;
    score = 0; gameOver = false; won = false; particles = []; trailParticles = [];
    deathRestartTimer = 0;
    deathExplosion = null;
    deathFlash = 0;
    jumpBuffer = 0;
    jumpPressedThisFrame = false;
    jumpHeld = false;
    orbConsumedThisHold = false;
    for (const o of obstacles) delete o._consumed;
    gravityDirection = 1;
    padTriggerCooldown = 0;
    document.getElementById('score').textContent = '0';
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => { });
}

window.showEditor = function () {
    if (!levelEditorEnabled) return;
    document.getElementById('menuScreen').classList.add('hidden');
    stopMenuAmbient();
    document.getElementById('editorScreen').classList.remove('hidden');
    currentScreen = 'editor';
    if (obstacles.length === 0) obstacles = getStoredLevel() || getDefaultLevel();
    normalizeObstaclesToGrid();
    editorCameraX = 0;
    editorCameraY = 0;
    setEditorPanelMode('objects');
    editorRunning = true;
    updateBetterEditButtons();
    requestAnimationFrame(editorLoop);
};

window.exitEditor = function () {
    editorRunning = false;
    document.getElementById('editorScreen').classList.add('hidden');
    document.getElementById('menuScreen').classList.remove('hidden');
    currentScreen = 'menu';
    bgMusic.pause();
    startMenuAmbient();
};

function applySpeedhack(value) {
    const parsed = parseFloat(value);
    if (!isFinite(parsed) || parsed <= 0) return;
    speedhackMultiplier = parsed;
    speedhackAccumulator = 0;
    const label = document.getElementById('speedhackLabel');
    if (label) label.textContent = speedhackMultiplier + 'x';
    const slider = document.getElementById('speedhackSlider');
    if (slider) slider.value = Math.min(3, Math.max(0.1, speedhackMultiplier));
    const input = document.getElementById('speedhackInput');
    if (input && document.activeElement !== input) input.value = speedhackMultiplier;
}

window.setSpeedhack = function (value) {
    applySpeedhack(value);
};

window.setSpeedhackFromInput = function (value) {
    applySpeedhack(value);
};

window.pauseGame = function () {
    paused = !paused;
    if (paused) bgMusic.pause();
    else bgMusic.play().catch(() => { });
};

function goToMenu() {
    gameRunning = editorRunning = false;
    testPlayActive = false;
    jumpPressedThisFrame = false;
    jumpHeld = false;
    orbConsumedThisHold = false;
    gravityDirection = 1;
    padTriggerCooldown = 0;
    bgMusic.pause();
    // Hide every possible screen
    [
        'gameScreen', 'editorScreen', 'levelSelectScreen',
        'modsScreen', 'cheatsPasscodeScreen', 'cheatsScreen',
        'extrasScreen', 'iconSelectorScreen'
    ].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    document.getElementById('menuScreen').classList.remove('hidden');
    currentScreen = 'menu';
    startMenuAmbient();
}

let lastFrameTime = 0;

function gameLoop(timestamp) {
    const rawDt = lastFrameTime ? (timestamp - lastFrameTime) / 16.6667 : 1;
    lastFrameTime = timestamp;
    // Clamp dt to avoid huge jumps after tab switches or lag spikes
    const dt = Math.min(rawDt, 4) * speedhackMultiplier;
    gameUpdate(dt);
    if (gameRunning) requestAnimationFrame(gameLoop);
}

function editorUpdate() {
    if (!editorRunning) return;
    editorCtx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
    drawBackground(editorCtx, editorCameraX);
    drawGround(editorCtx, editorCameraX, editorCameraY);

    editorCtx.strokeStyle = 'rgba(255,255,255,0.07)';
    for (let x = 0; x < editorCanvas.width; x += gridSize) {
        let wx = Math.floor((x + editorCameraX) / gridSize) * gridSize - editorCameraX;
        editorCtx.beginPath(); editorCtx.moveTo(wx, 0); editorCtx.lineTo(wx, editorCanvas.height); editorCtx.stroke();
    }
    for (let y = 0; y < editorCanvas.height; y += gridSize) {
        let wy = Math.floor((y + editorCameraY) / gridSize) * gridSize - editorCameraY;
        editorCtx.beginPath(); editorCtx.moveTo(0, wy); editorCtx.lineTo(editorCanvas.width, wy); editorCtx.stroke();
    }

    for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        let sx = obs.worldX - editorCameraX;
        if (sx <= -100 || sx >= editorCanvas.width + 100) continue;
        drawObstacle(editorCtx, obs, sx, editorCameraY);
        if (editorPanelMode === 'edit' && selectedIndices.has(i)) {
            const sy = obs.y - editorCameraY;
            editorCtx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            editorCtx.fillRect(sx, sy, obs.w, obs.h);
            editorCtx.strokeStyle = selectedIndices.size > 1 ? '#ff00ff' : '#00ffff';
            editorCtx.lineWidth = 3;
            editorCtx.strokeRect(sx + 1, sy + 1, Math.max(1, obs.w - 2), Math.max(1, obs.h - 2));
        }
    }

    // Draw drag-select rectangle
    if (isDragSelecting) {
        const rx = Math.min(dragSelectStartX, dragSelectEndX) - editorCameraX;
        const ry = Math.min(dragSelectStartY, dragSelectEndY) - editorCameraY;
        const rw = Math.abs(dragSelectEndX - dragSelectStartX);
        const rh = Math.abs(dragSelectEndY - dragSelectStartY);
        editorCtx.save();
        editorCtx.strokeStyle = '#ff00ff';
        editorCtx.lineWidth = 2;
        editorCtx.setLineDash([6, 3]);
        editorCtx.strokeRect(rx, ry, rw, rh);
        editorCtx.fillStyle = 'rgba(255, 0, 255, 0.08)';
        editorCtx.fillRect(rx, ry, rw, rh);
        editorCtx.restore();
    }
}

function editorLoop() { editorUpdate(); if (editorRunning) requestAnimationFrame(editorLoop); }

resizeCanvases();
window.addEventListener('resize', resizeCanvases);
initNyanCatAssets();
document.getElementById('menuScreen').classList.remove('hidden');
updateModsUI();
updateBetterEditButtons();
setTool(0);
setEditorPanelMode('objects');
startMenuAmbient();

document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    switch (currentScreen) {
        case 'levelselect':     hideLevelSelect();      break;
        case 'iconselector':    hideIconSelector();     break;
        case 'mods':            hideMods();             break;
        case 'cheatspasscode':  hideCheatsPasscode();   break;
        case 'cheats':          hideCheats();           break;
        case 'extras':          hideExtras();           break;
    }
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopMenuAmbient();
        return;
    }
    if (currentScreen === 'menu') {
        clearMenuAmbientIcons();
        startMenuAmbient();
    }
});

console.log('%cGeometry Dash – Base adjusted like real GD (ground higher, spikes on ground) + MODS button ready!', 'color:#ff00ff;font-size:16px');
