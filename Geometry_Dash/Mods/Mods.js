// Mods.js - UI/state handlers for mods, cube groups, and menu-level mod screens.

function updateLevelEditorVisibility() {
    const editorBtn = document.getElementById('levelEditorMenuBtn');
    if (!editorBtn) return;
    editorBtn.style.display = levelEditorEnabled ? '' : 'none';
}

function updateModsUI() {
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
    applyToggleVisual(document.getElementById('autoJumpToggleBtn'), autoJumpEnabled);
    applyToggleVisual(document.getElementById('lowGravityToggleBtn'), lowGravityEnabled);
    applyToggleVisual(document.getElementById('noRotationToggleBtn'), noRotationEnabled);
    applyToggleVisual(document.getElementById('trailToggleBtn'), trailEnabled);
    applyToggleVisual(document.getElementById('rgbCubeToggleBtn'), rgbCubeEnabled);
    applyToggleVisual(document.getElementById('betterEditToggleBtn'), betterEditEnabled);
    applyToggleVisual(document.getElementById('fireInTheHoleToggleBtn'), fireInTheHoleEnabled);
    applyToggleVisual(document.getElementById('rainbowStarsToggleBtn'), rainbowStarsEnabled);
    applyToggleVisual(document.getElementById('rainbowGroundToggleBtn'), rainbowGroundEnabled);
    applyToggleVisual(document.getElementById('showGameGridToggleBtn'), showGameGridEnabled);
    applyToggleVisual(document.getElementById('playerGlowToggleBtn'), playerGlowEnabled);
    applyToggleVisual(document.getElementById('groundPulseToggleBtn'), groundPulseEnabled);
    applyToggleVisual(document.getElementById('starTwinkleToggleBtn'), starTwinkleBoostEnabled);
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

window.toggleAutoJump = function () {
    autoJumpEnabled = !autoJumpEnabled;
    updateModsUI();
};

window.toggleLowGravity = function () {
    lowGravityEnabled = !lowGravityEnabled;
    updateModsUI();
};

window.toggleNoRotation = function () {
    noRotationEnabled = !noRotationEnabled;
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
    if (!trailEnabled) trailParticles = [];
    updateModsUI();
};

window.toggleRgbCube = function () {
    rgbCubeEnabled = !rgbCubeEnabled;
    updateModsUI();
};

window.toggleBetterEdit = function () {
    betterEditEnabled = !betterEditEnabled;
    if (typeof updateBetterEditButtons === 'function') updateBetterEditButtons();
    updateModsUI();
};

window.toggleFireInTheHole = function () {
    fireInTheHoleEnabled = !fireInTheHoleEnabled;
    updateModsUI();
};

window.toggleRainbowStars = function () {
    rainbowStarsEnabled = !rainbowStarsEnabled;
    updateModsUI();
};

window.toggleRainbowGround = function () {
    rainbowGroundEnabled = !rainbowGroundEnabled;
    updateModsUI();
};

window.toggleShowGameGrid = function () {
    showGameGridEnabled = !showGameGridEnabled;
    updateModsUI();
};

window.togglePlayerGlow = function () {
    playerGlowEnabled = !playerGlowEnabled;
    updateModsUI();
};

window.toggleGroundPulse = function () {
    groundPulseEnabled = !groundPulseEnabled;
    updateModsUI();
};

window.toggleStarTwinkle = function () {
    starTwinkleBoostEnabled = !starTwinkleBoostEnabled;
    updateModsUI();
};

window.showCubes = function () {
    document.getElementById('modsScreen').classList.add('hidden');
    document.getElementById('cubesScreen').classList.remove('hidden');
    currentScreen = 'cubes';
    updateModsUI();
};

window.hideCubes = function () {
    document.getElementById('cubesScreen').classList.add('hidden');
    document.getElementById('normalCubesScreen').classList.add('hidden');
    document.getElementById('robTopCubesScreen').classList.add('hidden');
    document.getElementById('gameCubesScreen').classList.add('hidden');
    document.getElementById('modsScreen').classList.remove('hidden');
    currentScreen = 'mods';
    updateModsUI();
};

window.showNormalCubes = function () {
    document.getElementById('cubesScreen').classList.add('hidden');
    document.getElementById('normalCubesScreen').classList.remove('hidden');
    currentScreen = 'normalcubes';
    updateModsUI();
};

window.hideNormalCubes = function () {
    document.getElementById('normalCubesScreen').classList.add('hidden');
    document.getElementById('cubesScreen').classList.remove('hidden');
    currentScreen = 'cubes';
    updateModsUI();
};

window.showRobTopCubes = function () {
    document.getElementById('cubesScreen').classList.add('hidden');
    document.getElementById('robTopCubesScreen').classList.remove('hidden');
    currentScreen = 'robtopcubes';
    updateModsUI();
};

window.hideRobTopCubes = function () {
    document.getElementById('robTopCubesScreen').classList.add('hidden');
    document.getElementById('cubesScreen').classList.remove('hidden');
    currentScreen = 'cubes';
    updateModsUI();
};

window.showGameCubes = function () {
    document.getElementById('cubesScreen').classList.add('hidden');
    document.getElementById('gameCubesScreen').classList.remove('hidden');
    currentScreen = 'gamecubes';
    updateModsUI();
};

window.hideGameCubes = function () {
    document.getElementById('gameCubesScreen').classList.add('hidden');
    document.getElementById('cubesScreen').classList.remove('hidden');
    currentScreen = 'cubes';
    updateModsUI();
};

window.showCubeStyles = function () {
    document.getElementById('modsScreen').classList.add('hidden');
    document.getElementById('cubeStylesScreen').classList.remove('hidden');
    currentScreen = 'cubestyles';
    updateModsUI();
};

window.hideCubeStyles = function () {
    document.getElementById('cubeStylesScreen').classList.add('hidden');
    document.getElementById('modsScreen').classList.remove('hidden');
    currentScreen = 'mods';
    updateModsUI();
};

window.showCheats = function () {
    document.getElementById('modsScreen').classList.add('hidden');
    document.getElementById('cheatsScreen').classList.remove('hidden');
    currentScreen = 'cheats';
    updateModsUI();
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
