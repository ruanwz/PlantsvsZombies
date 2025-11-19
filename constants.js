const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Game Constants
const CELL_SIZE = 100;
const GRID_ROWS = 5;
const GRID_COLS = 9;
const TOP_OFFSET = 100; // Space for UI
// The canvas is 900x600. The UI is an overlay.
// If the canvas takes up the whole game-container, then y=0 is the top.
// But we want the lawn to start below the UI?
// The UI is position:absolute over the canvas.
// If we want the game to play "under" the UI, that's fine, but maybe we want a top margin.
// Let's keep TOP_OFFSET but maybe adjust it.
// In style.css, #ui-layer is 80px height.
// So TOP_OFFSET should be roughly 80 or 100.
// Let's stick with 100 to be safe and have some "grass" above the first row if needed, or just start grid at 100.
// Actually, 5 rows * 100 = 500. Canvas is 600. So 100 offset is perfect.

// Global Game State Variables
const DEFAULT_CONFIG = {
    startSun: 50,
    plants: ['peashooter', 'sunflower', 'wallnut', 'cherrybomb', 'snowpea', 'potatomine', 'chomper', 'repeater'],
    zombies: ['normal', 'conehead', 'buckethead', 'flagzombie', 'newspaperzombie']
};

