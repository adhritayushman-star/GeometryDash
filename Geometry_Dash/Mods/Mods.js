// Mods.js - UI/state handlers for mods, cube groups, and menu-level mod screens.

function updateLevelEditorVisibility() {
    const editorBtn = document.getElementById('levelEditorMenuBtn');
    if (!editorBtn) return;
    editorBtn.style.display = levelEditorEnabled ? '' : 'none';
}

function updateModsUI() {
    // BetterEdit is always on
    if (typeof betterEditEnabled !== 'undefined') betterEditEnabled = true;
    if (typeof updateBetterEditButtons === 'function') updateBetterEditButtons();

    applyToggleVisual(document.getElementById('gdColonToggleBtn'), gdColonCubeEnabled);
    applyToggleVisual(document.getElementById('vortroxToggleBtn'), vortroxCubeEnabled);
    applyToggleVisual(document.getElementById('nexusToggleBtn'), nexusCubeEnabled);
    applyToggleVisual(document.getElementById('gdIconToggleBtn'), gdIconCubeEnabled);
    applyToggleVisual(document.getElementById('robTopToggleBtn'), robTopCubeEnabled);
    applyToggleVisual(document.getElementById('rubRubToggleBtn'), rubRubCubeEnabled);
    applyToggleVisual(document.getElementById('tricipitalToggleBtn'), tricipitalCubeEnabled);
    applyToggleVisual(document.getElementById('avatarAangToggleBtn'), avatarAangCubeEnabled);
    applyToggleVisual(document.getElementById('boomlingsToggleBtn'), boomlingsCubeEnabled);
    applyToggleVisual(document.getElementById('sansToggleBtn'), sansCubeEnabled);
    applyToggleVisual(document.getElementById('batmanToggleBtn'), batmanCubeEnabled);
    applyToggleVisual(document.getElementById('creeperToggleBtn'), creeperCubeEnabled);
    applyToggleVisual(document.getElementById('superMeatBoyToggleBtn'), superMeatBoyCubeEnabled);
    applyToggleVisual(document.getElementById('noclipToggleBtn'), noclipEnabled);
    applyToggleVisual(document.getElementById('showHitboxesToggleBtn'), showHitboxesEnabled);
    applyToggleVisual(document.getElementById('infiniteJumpsToggleBtn'), infiniteJumpsEnabled);
    applyToggleVisual(document.getElementById('trailToggleBtn'), trailEnabled);
    applyToggleVisual(document.getElementById('rgbCubeToggleBtn'), rgbCubeEnabled);
    applyToggleVisual(document.getElementById('fireInTheHoleToggleBtn'), fireInTheHoleEnabled);
}

function disableAllModdedCubes() {
    gdColonCubeEnabled = false;
    vortroxCubeEnabled = false;
    nexusCubeEnabled = false;
    gdIconCubeEnabled = false;
    robTopCubeEnabled = false;
    rubRubCubeEnabled = false;
    tricipitalCubeEnabled = false;
    avatarAangCubeEnabled = false;
    boomlingsCubeEnabled = false;
    sansCubeEnabled = false;
    batmanCubeEnabled = false;
    creeperCubeEnabled = false;
    superMeatBoyCubeEnabled = false;
}

window.toggleGdColon = function () {
    const next = !gdColonCubeEnabled;
    disableAllModdedCubes();
    gdColonCubeEnabled = next;
    updateModsUI();
};

window.toggleVortrox = function () {
    const next = !vortroxCubeEnabled;
    disableAllModdedCubes();
    vortroxCubeEnabled = next;
    updateModsUI();
};

window.toggleNexus = function () {
    const next = !nexusCubeEnabled;
    disableAllModdedCubes();
    nexusCubeEnabled = next;
    updateModsUI();
};

window.toggleGdIcon = function () {
    const next = !gdIconCubeEnabled;
    disableAllModdedCubes();
    gdIconCubeEnabled = next;
    updateModsUI();
};

window.toggleRobTop = function () {
    const next = !robTopCubeEnabled;
    disableAllModdedCubes();
    robTopCubeEnabled = next;
    updateModsUI();
};

window.toggleRubRub = function () {
    const next = !rubRubCubeEnabled;
    disableAllModdedCubes();
    rubRubCubeEnabled = next;
    updateModsUI();
};

window.toggleTricipital = function () {
    const next = !tricipitalCubeEnabled;
    disableAllModdedCubes();
    tricipitalCubeEnabled = next;
    updateModsUI();
};

window.toggleAvatarAang = function () {
    const next = !avatarAangCubeEnabled;
    disableAllModdedCubes();
    avatarAangCubeEnabled = next;
    updateModsUI();
};

window.toggleBoomlings = function () {
    const next = !boomlingsCubeEnabled;
    disableAllModdedCubes();
    boomlingsCubeEnabled = next;
    updateModsUI();
};

window.toggleSans = function () {
    const next = !sansCubeEnabled;
    disableAllModdedCubes();
    sansCubeEnabled = next;
    updateModsUI();
};

window.toggleBatman = function () {
    const next = !batmanCubeEnabled;
    disableAllModdedCubes();
    batmanCubeEnabled = next;
    updateModsUI();
};

window.toggleCreeper = function () {
    const next = !creeperCubeEnabled;
    disableAllModdedCubes();
    creeperCubeEnabled = next;
    updateModsUI();
};

window.toggleSuperMeatBoy = function () {
    const next = !superMeatBoyCubeEnabled;
    disableAllModdedCubes();
    superMeatBoyCubeEnabled = next;
    updateModsUI();
};

window.toggleNoclip = function () {
    noclipEnabled = !noclipEnabled;
    updateModsUI();
};

window.toggleShowHitboxes = function () {
    showHitboxesEnabled = !showHitboxesEnabled;
    updateModsUI();
};

window.toggleInfiniteJumps = function () {
    infiniteJumpsEnabled = !infiniteJumpsEnabled;
    updateModsUI();
};

window.showLevelSelect = function () {
    document.getElementById('menuScreen').classList.add('hidden');
    stopMenuAmbient();
    document.getElementById('levelSelectScreen').classList.remove('hidden');
    currentScreen = 'levelselect';
};

window.hideLevelSelect = function () {
    document.getElementById('levelSelectScreen').classList.add('hidden');
    document.getElementById('menuScreen').classList.remove('hidden');
    currentScreen = 'menu';
    startMenuAmbient();
};

window.toggleTrail = function () {
    trailEnabled = !trailEnabled;
    if (!trailEnabled) { trailParticles = []; previewTrailDots = []; }
    updateStylesUI();
    updateModsUI();
};

window.toggleRgbCube = function () {
    rgbCubeEnabled = !rgbCubeEnabled;
    updateStylesUI();
    updateModsUI();
};

window.toggleFireInTheHole = function () {
    fireInTheHoleEnabled = !fireInTheHoleEnabled;
    updateModsUI();
};

// ─── ICON SELECTOR ────────────────────────────────────────────────────────────

const CUBE_SKINS = [
    { name: 'CUBE 01', key: 'cube01' },
    { name: 'CUBE 02', key: 'cube02' },
    { name: 'CUBE 03', key: 'cube03' },
    { name: 'CUBE 04', key: 'cube04' },
    { name: 'CUBE 05', key: 'cube05' },
    { name: 'CUBE 06', key: 'cube06' },
    { name: 'CUBE 07', key: 'cube07' },
    { name: 'CUBE 08', key: 'cube08' },
    { name: 'CUBE 09', key: 'cube09' },
    { name: 'CUBE 10', key: 'cube10' },
    { name: 'CUBE 11', key: 'cube11' },
    { name: 'CUBE 12', key: 'cube12' },
    { name: 'CUBE 13', key: 'cube13' },
    { name: 'CUBE 14', key: 'cube14' },
    { name: 'CUBE 15', key: 'cube15' },
    { name: 'CUBE 16', key: 'cube16' },
];
window.CUBE_SKINS = CUBE_SKINS;

const DEFAULT_ICON_STATE = { primary: '#FFD200', secondary: '#2FD2FF', skinIndex: 0 };
const iconState = window.iconState || { ...DEFAULT_ICON_STATE };
window.iconState = iconState;

function sanitizeHexColor(value, fallback) {
    if (typeof value !== 'string') return fallback;
    const raw = value.trim().replace('#', '');
    if (/^[0-9a-fA-F]{3}$/.test(raw)) {
        return `#${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`.toUpperCase();
    }
    if (/^[0-9a-fA-F]{6}$/.test(raw)) {
        return `#${raw}`.toUpperCase();
    }
    return fallback;
}

function clampSkinIndex(value) {
    const idx = Number(value);
    if (!Number.isFinite(idx)) return 0;
    return Math.max(0, Math.min(CUBE_SKINS.length - 1, Math.round(idx)));
}

function loadIconState() {
    try {
        const raw = localStorage.getItem('gdIconState');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        iconState.primary = sanitizeHexColor(parsed.primary, iconState.primary);
        iconState.secondary = sanitizeHexColor(parsed.secondary, iconState.secondary);
        iconState.skinIndex = clampSkinIndex(parsed.skinIndex);
    } catch { }
}

function saveIconState() {
    try {
        localStorage.setItem('gdIconState', JSON.stringify({
            primary: iconState.primary,
            secondary: iconState.secondary,
            skinIndex: iconState.skinIndex
        }));
    } catch { }
}

loadIconState();

function hexToRgb(hex) {
    const clean = sanitizeHexColor(hex, '#000000').slice(1);
    return {
        r: parseInt(clean.slice(0, 2), 16),
        g: parseInt(clean.slice(2, 4), 16),
        b: parseInt(clean.slice(4, 6), 16)
    };
}

const colorParserCanvas = document.createElement('canvas');
const colorParserCtx = colorParserCanvas.getContext('2d');

function cssColorToRgb(value, fallback = '#000000') {
    if (typeof value !== 'string') return hexToRgb(fallback);
    const hex = sanitizeHexColor(value, '');
    if (hex) return hexToRgb(hex);
    if (!colorParserCtx) return hexToRgb(fallback);

    colorParserCtx.fillStyle = '#000000';
    colorParserCtx.fillStyle = value;
    const resolved = colorParserCtx.fillStyle;
    const resolvedHex = sanitizeHexColor(resolved, '');
    if (resolvedHex) return hexToRgb(resolvedHex);

    const rgbMatch = resolved.match(/rgba?\(([^)]+)\)/i);
    if (rgbMatch) {
        const parts = rgbMatch[1].split(',').map(p => Number.parseFloat(p.trim()));
        if (parts.length >= 3 && parts.every(n => Number.isFinite(n))) {
            return {
                r: Math.max(0, Math.min(255, Math.round(parts[0]))),
                g: Math.max(0, Math.min(255, Math.round(parts[1]))),
                b: Math.max(0, Math.min(255, Math.round(parts[2])))
            };
        }
    }
    return hexToRgb(fallback);
}

function adjustColor(hex, amount) {
    const rgb = cssColorToRgb(hex);
    const amt = Math.max(-1, Math.min(1, amount));
    const target = amt < 0 ? 0 : 255;
    const factor = Math.abs(amt);
    const r = Math.round((target - rgb.r) * factor + rgb.r);
    const g = Math.round((target - rgb.g) * factor + rgb.g);
    const b = Math.round((target - rgb.b) * factor + rgb.b);
    return `rgb(${r}, ${g}, ${b})`;
}

function getBaseCubeColors() {
    return {
        primary: iconState.primary,
        secondary: iconState.secondary
    };
}
window.getBaseCubeColors = getBaseCubeColors;

function getCubeColors(hueOverride) {
    const rgbEnabled = typeof rgbCubeEnabled !== 'undefined' && rgbCubeEnabled;
    if (rgbEnabled) {
        const hue = typeof hueOverride === 'number' ? hueOverride : (Date.now() / 8) % 360;
        return {
            primary: `hsl(${hue}, 90%, 56%)`,
            secondary: `hsl(${(hue + 38) % 360}, 90%, 40%)`
        };
    }
    return getBaseCubeColors();
}
window.getCubeColors = getCubeColors;

const OFFICIAL_ICON_BASE_PATHS = [
    '../Mods/OfficialIcons/',
    '../Mods/Cubes/Official/',
    '../Mods/Cubes/Official Icons/',
    '../Mods/Cubes/',
    './Mods/OfficialIcons/'
];

const officialIconImages = new Map();
const officialIconLoadState = new Map(); // 0: unknown, 1: loading, 2: loaded, -1: failed
const officialIconBounds = new WeakMap();

function getSkinKey(index) {
    const skin = CUBE_SKINS[clampSkinIndex(index)];
    return skin?.key || `cube${String(index + 1).padStart(2, '0')}`;
}

function getOfficialIconCandidates(index) {
    const n = index + 1;
    const n2 = String(n).padStart(2, '0');
    const key = getSkinKey(index);
    const fileNames = [
        `${key}.png`,
        `${key}.webp`,
        `cube${n2}.png`,
        `cube${n2}.webp`,
        `cube_${n2}.png`,
        `cube_${n2}.webp`,
        `cube-${n2}.png`,
        `cube-${n2}.webp`,
        `${n2}.png`,
        `${n2}.webp`,
        `${n}.png`,
        `${n}.webp`
    ];

    const out = [];
    OFFICIAL_ICON_BASE_PATHS.forEach(base => {
        fileNames.forEach(file => out.push(`${base}${file}`));
    });
    return out;
}

function requestOfficialIcon(index) {
    const idx = clampSkinIndex(index);
    const state = officialIconLoadState.get(idx) || 0;
    if (state === 1 || state === 2 || state === -1) return;
    officialIconLoadState.set(idx, 1);

    const candidates = getOfficialIconCandidates(idx);
    if (!candidates.length) {
        officialIconLoadState.set(idx, -1);
        return;
    }

    const img = new Image();
    let pointer = 0;
    img.onload = () => {
        officialIconImages.set(idx, img);
        officialIconLoadState.set(idx, 2);
        refreshIconGrid();
    };
    img.onerror = () => {
        pointer += 1;
        if (pointer >= candidates.length) {
            officialIconLoadState.set(idx, -1);
            return;
        }
        img.src = candidates[pointer];
    };
    img.src = candidates[pointer];
}

function getOpaqueBounds(image) {
    if (officialIconBounds.has(image)) return officialIconBounds.get(image);
    let bounds = { x: 0, y: 0, w: image.width || 1, h: image.height || 1 };
    try {
        const probe = document.createElement('canvas');
        probe.width = image.width;
        probe.height = image.height;
        const pctx = probe.getContext('2d');
        pctx.clearRect(0, 0, probe.width, probe.height);
        pctx.drawImage(image, 0, 0);
        const data = pctx.getImageData(0, 0, probe.width, probe.height).data;
        let minX = probe.width;
        let minY = probe.height;
        let maxX = -1;
        let maxY = -1;
        for (let y = 0; y < probe.height; y++) {
            for (let x = 0; x < probe.width; x++) {
                if (data[(y * probe.width + x) * 4 + 3] > 10) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }
        if (maxX >= minX && maxY >= minY) {
            bounds = {
                x: minX,
                y: minY,
                w: maxX - minX + 1,
                h: maxY - minY + 1
            };
        }
    } catch { }
    officialIconBounds.set(image, bounds);
    return bounds;
}

function renderOfficialIconIfAvailable(ctx, size, skinIndex) {
    const idx = clampSkinIndex(skinIndex);
    const state = officialIconLoadState.get(idx) || 0;
    if (state === 0) {
        requestOfficialIcon(idx);
        return false;
    }
    if (state !== 2) return false;

    const image = officialIconImages.get(idx);
    if (!image) return false;
    const b = getOpaqueBounds(image);
    const content = size * 0.82;
    const scale = content / Math.max(b.w, b.h);
    const drawW = Math.max(1, Math.round(b.w * scale));
    const drawH = Math.max(1, Math.round(b.h * scale));
    const dx = Math.round((size - drawW) / 2);
    const dy = Math.round((size - drawH) / 2);
    ctx.drawImage(image, b.x, b.y, b.w, b.h, dx, dy, drawW, drawH);
    return true;
}

const ICON_PIXEL_GRID = 16;
const ICON_TEMPLATES = [
    { secondary: [[3, 3, 3, 3], [10, 3, 3, 3], [3, 10, 10, 2], [4, 11, 8, 2]], primary: [[6, 10, 4, 1]] },
    { secondary: [[2, 2, 5, 2], [3, 4, 4, 1], [9, 2, 5, 2], [9, 4, 4, 1], [4, 6, 3, 2], [9, 6, 3, 2], [3, 12, 3, 1], [5, 11, 6, 1], [10, 12, 3, 1]] },
    { secondary: [[2, 4, 12, 3], [3, 8, 10, 1], [5, 11, 6, 2]], primary: [[5, 5, 2, 1], [9, 5, 2, 1]] },
    { secondary: [[3, 3, 3, 3], [10, 3, 3, 3], [2, 9, 12, 4], [3, 13, 1, 1], [6, 13, 1, 1], [9, 13, 1, 1], [12, 13, 1, 1]], primary: [[3, 10, 1, 2], [6, 10, 1, 2], [9, 10, 1, 2], [12, 10, 1, 2]] },
    { secondary: [[7, 2, 2, 2], [6, 4, 4, 2], [5, 6, 6, 2], [4, 8, 8, 2], [5, 10, 6, 2], [6, 12, 4, 2], [2, 5, 2, 2], [12, 5, 2, 2]], primary: [[7, 7, 2, 2]] },
    { secondary: [[7, 2, 2, 12], [2, 7, 12, 2], [3, 3, 3, 3], [10, 3, 3, 3], [5, 12, 6, 2]], primary: [[7, 7, 2, 2]] },
    { secondary: [[2, 2, 4, 2], [2, 2, 2, 4], [10, 2, 4, 2], [12, 2, 2, 4], [2, 12, 4, 2], [2, 10, 2, 4], [10, 12, 4, 2], [12, 10, 2, 4], [4, 5, 3, 3], [9, 5, 3, 3], [4, 11, 8, 2]] },
    { secondary: [[2, 2, 12, 2], [2, 6, 12, 2], [2, 10, 12, 2], [2, 14, 12, 1], [3, 3, 3, 3], [10, 3, 3, 3]], primary: [[7, 2, 2, 2], [5, 6, 2, 2], [9, 10, 2, 2]] },
    { secondary: [[3, 3, 4, 3], [9, 3, 4, 3], [2, 8, 12, 2], [3, 10, 10, 2], [5, 12, 6, 2], [4, 14, 2, 1], [7, 14, 2, 1], [10, 14, 2, 1]], primary: [[5, 4, 1, 1], [10, 4, 1, 1]] },
    { secondary: [[2, 2, 7, 2], [7, 4, 5, 2], [6, 6, 5, 2], [5, 8, 5, 2], [4, 10, 5, 2], [3, 12, 7, 2], [3, 3, 3, 3], [10, 3, 3, 3]] },
    { secondary: [[3, 1, 3, 3], [7, 0, 2, 4], [10, 1, 3, 3], [4, 5, 3, 3], [9, 5, 3, 3], [3, 11, 10, 2], [4, 13, 8, 2]], primary: [[7, 12, 2, 1]] },
    { secondary: [[2, 2, 12, 2], [2, 12, 12, 2], [2, 2, 2, 12], [12, 2, 2, 12], [7, 2, 2, 12], [3, 5, 3, 3], [10, 5, 3, 3], [4, 11, 3, 1], [9, 11, 3, 1]], primary: [[7, 5, 2, 2], [7, 10, 2, 2]] },
    { secondary: [[3, 3, 10, 2], [3, 11, 10, 2], [3, 3, 2, 10], [11, 3, 2, 10], [4, 5, 3, 3], [9, 5, 3, 3], [6, 10, 4, 1]], primary: [[6, 6, 4, 3]] },
    { secondary: [[2, 12, 12, 2], [3, 10, 10, 2], [4, 8, 8, 2], [5, 6, 6, 2], [6, 3, 4, 3], [3, 3, 3, 3], [10, 3, 3, 3]], primary: [[7, 4, 2, 2]] },
    { secondary: [[2, 2, 12, 2], [2, 12, 12, 2], [2, 2, 2, 12], [12, 2, 2, 12], [4, 5, 3, 3], [9, 5, 3, 3], [3, 10, 10, 2], [3, 12, 1, 2], [5, 12, 1, 2], [7, 12, 1, 2], [9, 12, 1, 2], [11, 12, 1, 2]], primary: [[6, 10, 4, 1]] },
    { secondary: [[7, 2, 2, 3], [5, 5, 2, 2], [9, 5, 2, 2], [3, 7, 2, 2], [11, 7, 2, 2], [5, 9, 2, 2], [9, 9, 2, 2], [7, 12, 2, 2], [3, 3, 3, 3], [10, 3, 3, 3]], primary: [[7, 7, 2, 2]] }
];

function drawTemplateRects(ctx, x, y, unit, rects, color) {
    if (!Array.isArray(rects) || !rects.length) return;
    ctx.fillStyle = color;
    rects.forEach(rect => {
        const [rx, ry, rw, rh] = rect;
        const px = Math.round(x + rx * unit);
        const py = Math.round(y + ry * unit);
        const pw = Math.max(1, Math.round(rw * unit));
        const ph = Math.max(1, Math.round(rh * unit));
        ctx.fillRect(px, py, pw, ph);
    });
}

function renderCubePattern(ctx, size, border, skinIndex, primary, secondary) {
    const inner = size - border * 2;
    const x = border;
    const y = border;
    const idx = ((skinIndex % ICON_TEMPLATES.length) + ICON_TEMPLATES.length) % ICON_TEMPLATES.length;
    const template = ICON_TEMPLATES[idx] || ICON_TEMPLATES[0];
    const unit = inner / ICON_PIXEL_GRID;

    drawTemplateRects(ctx, x, y, unit, template.secondary, secondary);
    drawTemplateRects(ctx, x, y, unit, template.primary, primary);
}

function renderCubeSkin(ctx, size, skinIndex, primary, secondary, options = {}) {
    const x = options.x || 0;
    const y = options.y || 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.imageSmoothingEnabled = false;

    const s = size;
    if (renderOfficialIconIfAvailable(ctx, s, skinIndex)) {
        ctx.restore();
        return;
    }

    const border = Math.max(2, Math.round(s * 0.1));
    const inner = s - border * 2;
    const frame = Math.max(1, Math.round(s * 0.03));
    const corner = Math.max(1, Math.round(inner * 0.14));
    const cut = Math.max(1, Math.round(corner * 0.45));

    // Strictly flat 2D: only primary + secondary, no gradients or shadows.
    ctx.fillStyle = secondary;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = primary;
    ctx.fillRect(border, border, inner, inner);

    // GD-like flat frame.
    ctx.fillStyle = secondary;
    ctx.fillRect(border, border, inner, frame);
    ctx.fillRect(border, border + inner - frame, inner, frame);
    ctx.fillRect(border, border, frame, inner);
    ctx.fillRect(border + inner - frame, border, frame, inner);

    // Corner chunks to keep icons punchy and readable at small sizes.
    ctx.fillRect(border, border, corner, corner);
    ctx.fillRect(border + inner - corner, border, corner, corner);
    ctx.fillRect(border, border + inner - corner, corner, corner);
    ctx.fillRect(border + inner - corner, border + inner - corner, corner, corner);

    // Carve the corner chunks slightly so the shape stays cleaner and less bulky.
    ctx.fillStyle = primary;
    ctx.fillRect(border + frame, border + frame, cut, cut);
    ctx.fillRect(border + inner - frame - cut, border + frame, cut, cut);
    ctx.fillRect(border + frame, border + inner - frame - cut, cut, cut);
    ctx.fillRect(border + inner - frame - cut, border + inner - frame - cut, cut, cut);

    renderCubePattern(ctx, s, border, skinIndex, primary, secondary);
    ctx.restore();
}
window.renderCubeSkin = renderCubeSkin;

function renderCubeToCanvas(canvas, skinIndex, primary, secondary) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const style = window.getComputedStyle(canvas);
    const styledW = parseFloat(style.width) || 0;
    const styledH = parseFloat(style.height) || 0;
    const fallback = Number(canvas.dataset.size) || 72;
    const size = Math.max(1, Math.round(rect.width || rect.height || styledW || styledH || fallback));
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(size * dpr);
    const h = Math.round(size * dpr);
    if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    try {
        renderCubeSkin(ctx, size, skinIndex, primary, secondary);
    } catch {
        ctx.fillStyle = primary || '#FFD200';
        ctx.fillRect(0, 0, size, size);
        ctx.strokeStyle = secondary || '#2FD2FF';
        ctx.lineWidth = Math.max(2, Math.round(size * 0.08));
        ctx.strokeRect(1, 1, size - 2, size - 2);
    }
}

function buildIconGrid() {
    const iconGrid = document.getElementById('iconGrid');
    if (!iconGrid || iconGrid.dataset.built) return;
    iconGrid.dataset.built = 'true';
    iconGrid.innerHTML = '';
    CUBE_SKINS.forEach((skin, index) => {
        const btn = document.createElement('button');
        btn.className = 'icon-tile';
        btn.type = 'button';
        btn.dataset.skin = index;
        btn.addEventListener('click', () => window.selectCubeSkin(index));
        const canvas = document.createElement('canvas');
        canvas.className = 'icon-skin-canvas';
        canvas.dataset.size = '72';
        btn.appendChild(canvas);
        const label = document.createElement('span');
        label.textContent = skin.name;
        btn.appendChild(label);
        iconGrid.appendChild(btn);
    });
}

function renderIconGrid() {
    const colors = getBaseCubeColors();
    document.querySelectorAll('.icon-tile .icon-skin-canvas').forEach((canvas, idx) => {
        renderCubeToCanvas(canvas, idx, colors.primary, colors.secondary);
    });
}

function refreshIconGrid() {
    renderIconGrid();
    requestAnimationFrame(() => renderIconGrid());
    setTimeout(() => renderIconGrid(), 80);
}

function updateIconColorInputs() {
    const primaryInput = document.getElementById('iconPrimaryColor');
    const secondaryInput = document.getElementById('iconSecondaryColor');
    if (primaryInput) primaryInput.value = iconState.primary;
    if (secondaryInput) secondaryInput.value = iconState.secondary;
}

function updateIconSelectorUI() {
    document.querySelectorAll('.icon-tile').forEach(tile => {
        tile.classList.toggle('selected', Number(tile.dataset.skin) === iconState.skinIndex);
    });
    const previewName = document.getElementById('iconSelectorPreviewName');
    if (previewName) previewName.textContent = CUBE_SKINS[iconState.skinIndex]?.name || 'ICON';
}

function initIconSelectorControls() {
    buildIconGrid();
    updateIconColorInputs();
    refreshIconGrid();
    const primaryInput = document.getElementById('iconPrimaryColor');
    const secondaryInput = document.getElementById('iconSecondaryColor');
    if (primaryInput && !primaryInput.dataset.bound) {
        primaryInput.dataset.bound = 'true';
        primaryInput.addEventListener('input', (e) => {
            iconState.primary = sanitizeHexColor(e.target.value, iconState.primary);
            saveIconState();
            refreshIconGrid();
            updateIconSelectorUI();
        });
    }
    if (secondaryInput && !secondaryInput.dataset.bound) {
        secondaryInput.dataset.bound = 'true';
        secondaryInput.addEventListener('input', (e) => {
            iconState.secondary = sanitizeHexColor(e.target.value, iconState.secondary);
            saveIconState();
            refreshIconGrid();
            updateIconSelectorUI();
        });
    }
    if (!window._iconGridResizeBound) {
        window._iconGridResizeBound = true;
        window.addEventListener('resize', () => {
            const screen = document.getElementById('iconSelectorScreen');
            if (screen && !screen.classList.contains('hidden')) refreshIconGrid();
        });
    }
}

window.selectCubeSkin = function (index) {
    iconState.skinIndex = clampSkinIndex(index);
    saveIconState();
    refreshIconGrid();
    updateIconSelectorUI();
};

// ── Live Preview Engine ───────────────────────────────────────────────────────
let previewAnimFrame = null;
let previewRgbHue = 0;
let previewTrailDots = [];
let previewDotTimer = 0;
let previewLastTs = 0;
const PREVIEW_SIZE = 120;

function startPreviewLoop() {
    if (previewAnimFrame) return;
    previewLastTs = performance.now();
    function loop(ts) {
        const dt = Math.min((ts - previewLastTs) / 16.667, 4);
        previewLastTs = ts;
        renderIconPreview(dt);
        previewAnimFrame = requestAnimationFrame(loop);
    }
    previewAnimFrame = requestAnimationFrame(loop);
}

function stopPreviewLoop() {
    if (previewAnimFrame) { cancelAnimationFrame(previewAnimFrame); previewAnimFrame = null; }
    previewTrailDots = [];
    previewDotTimer = 0;
}

function renderIconPreview(dt) {
    const canvas = document.getElementById('iconPreviewCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = PREVIEW_SIZE, H = PREVIEW_SIZE;
    canvas.width = W; canvas.height = H;

    const cubeSize = 64;
    const cx = W / 2;
    const cy = H / 2;

    if (typeof rgbCubeEnabled !== 'undefined' && rgbCubeEnabled) {
        previewRgbHue = (previewRgbHue + 1.2 * dt) % 360;
    }
    const colors = getCubeColors(previewRgbHue);

    // Background — always draw this
    ctx.fillStyle = '#10001f';
    ctx.beginPath();
    roundRect(ctx, 0, 0, W, H, 14);
    ctx.fill();

    // Trail preview
    if (trailEnabled) {
        previewDotTimer += dt;
        if (previewDotTimer >= 2) {
            previewDotTimer = 0;
            const size = cubeSize * 0.24;
            const jitter = cubeSize * 0.08;
            const spawnX = (cx - cubeSize / 2) + cubeSize * 0.15 + (Math.random() * jitter - jitter / 2);
            const cubeBottomY = cy + cubeSize / 2;
            const baseY = cubeBottomY - size * 0.05 + (Math.random() * jitter - jitter / 2);
            previewTrailDots.push({ x: spawnX, baseY, size, life: 18 });
        }
        previewTrailDots = previewTrailDots.filter(d => d.life > 0);
        previewTrailDots.forEach(d => {
            d.life -= 0.9 * dt;
            d.size = Math.max(1, d.size * (1 - 0.04 * dt));
            d.x -= 2.0 * dt;
            const alpha = Math.max(0, d.life / 18);
            const drawY = d.baseY - d.size;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = (typeof rgbCubeEnabled !== 'undefined' && rgbCubeEnabled)
                ? `hsl(${(previewRgbHue + 60) % 360}, 100%, 65%)`
                : adjustColor(colors.secondary, 0.2);
            ctx.fillRect(d.x, drawY, d.size, d.size);
        });
        ctx.globalAlpha = 1;
    } else {
        previewTrailDots = [];
        previewDotTimer = 0;
    }

    try {
        renderCubeSkin(ctx, cubeSize, iconState.skinIndex, colors.primary, colors.secondary, {
            x: cx - cubeSize / 2,
            y: cy - cubeSize / 2
        });
    } catch {
        ctx.fillStyle = colors.primary || '#FFD200';
        ctx.fillRect(cx - cubeSize / 2, cy - cubeSize / 2, cubeSize, cubeSize);
        ctx.strokeStyle = colors.secondary || '#2FD2FF';
        ctx.lineWidth = 4;
        ctx.strokeRect(cx - cubeSize / 2 + 1, cy - cubeSize / 2 + 1, cubeSize - 2, cubeSize - 2);
    }

    // Flat border (no glow/shadow)
    ctx.save();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    roundRect(ctx, 1.5, 1.5, W - 3, H - 3, 13);
    ctx.stroke();
    ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function updateStylesUI() {
    const trailCard = document.getElementById('styleCard-trail');
    const rgbCard   = document.getElementById('styleCard-rgb');
    const trailBadge = document.getElementById('trailToggleBtn');
    const rgbBadge   = document.getElementById('rgbCubeToggleBtn');

    if (trailCard)  trailCard.classList.toggle('active', trailEnabled);
    if (rgbCard)    rgbCard.classList.toggle('active', rgbCubeEnabled);
    if (trailBadge) trailBadge.textContent = trailEnabled   ? 'ON' : 'OFF';
    if (rgbBadge)   rgbBadge.textContent   = rgbCubeEnabled ? 'ON' : 'OFF';
}

let activeIconTab = 'icons';

window.showIconSelector = function () {
    document.getElementById('menuScreen').classList.add('hidden');
    stopMenuAmbient();
    document.getElementById('iconSelectorScreen').classList.remove('hidden');
    currentScreen = 'iconselector';
    initIconSelectorControls();
    setIconTab(activeIconTab);
    updateIconSelectorUI();
    updateStylesUI();
    startPreviewLoop();
};

window.hideIconSelector = function () {
    stopPreviewLoop();
    document.getElementById('iconSelectorScreen').classList.add('hidden');
    document.getElementById('menuScreen').classList.remove('hidden');
    currentScreen = 'menu';
    startMenuAmbient();
};

window.setIconTab = function (tab) {
    activeIconTab = tab;
    document.querySelectorAll('.icon-tab').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('iconTab-' + tab);
    if (activeBtn) activeBtn.classList.add('active');
    document.querySelectorAll('.icon-panel').forEach(panel => panel.classList.add('hidden'));
    const activePanel = document.getElementById('iconPanel-' + tab);
    if (activePanel) activePanel.classList.remove('hidden');
    if (tab === 'styles') updateStylesUI();
    if (tab === 'icons') refreshIconGrid();
};

const CHEATS_PASSCODE = 'Qualixar';

window.showCheats = function () {
    document.getElementById('modsScreen').classList.add('hidden');
    // If already unlocked this session, go straight to cheats
    if (window.cheatsUnlocked) {
        document.getElementById('cheatsScreen').classList.remove('hidden');
        currentScreen = 'cheats';
        updateModsUI();
    } else {
        document.getElementById('cheatsPasscodeScreen').classList.remove('hidden');
        currentScreen = 'cheatspasscode';
        const input = document.getElementById('passcodeInput');
        if (input) { input.value = ''; input.classList.remove('error'); }
        document.getElementById('passcodeError').classList.add('hidden');
        setTimeout(() => { if (input) input.focus(); }, 100);
    }
};

window.hideCheatsPasscode = function () {
    document.getElementById('cheatsPasscodeScreen').classList.add('hidden');
    document.getElementById('modsScreen').classList.remove('hidden');
    currentScreen = 'mods';
};

window.checkPasscode = function (value) {
    const input = document.getElementById('passcodeInput');
    const error = document.getElementById('passcodeError');
    input.classList.remove('error');
    if (value === CHEATS_PASSCODE) {
        window.cheatsUnlocked = true;
        document.getElementById('cheatsPasscodeScreen').classList.add('hidden');
        document.getElementById('cheatsScreen').classList.remove('hidden');
        currentScreen = 'cheats';
        updateModsUI();
    } else if (value.length >= CHEATS_PASSCODE.length) {
        input.classList.add('error');
        error.classList.remove('hidden');
        setTimeout(() => input.classList.remove('error'), 400);
    } else {
        error.classList.add('hidden');
    }
};

window.hideCheats = function () {
    document.getElementById('cheatsScreen').classList.add('hidden');
    document.getElementById('modsScreen').classList.remove('hidden');
    currentScreen = 'mods';
    updateModsUI();
};

window.showExtras = function () {
    document.getElementById('modsScreen').classList.add('hidden');
    document.getElementById('extrasScreen').classList.remove('hidden');
    currentScreen = 'extras';
    updateModsUI();
};

window.hideExtras = function () {
    document.getElementById('extrasScreen').classList.add('hidden');
    document.getElementById('modsScreen').classList.remove('hidden');
    currentScreen = 'mods';
    updateModsUI();
};

window.showMods = () => {
    updateModsUI();
    stopMenuAmbient();
    document.getElementById('menuScreen').classList.add('hidden');
    document.getElementById('modsScreen').classList.remove('hidden');
    currentScreen = 'mods';
};

window.hideMods = () => {
    document.getElementById('modsScreen').classList.add('hidden');
    document.getElementById('menuScreen').classList.remove('hidden');
    currentScreen = 'menu';
    startMenuAmbient();
};
