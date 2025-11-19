// Game State
let sun = 50;
let frame = 0;
let gameOver = false;
let score = 0;
let selectedPlant = null;
let gameActive = false;
let config = { ...DEFAULT_CONFIG };

// Arrays to hold game objects
const grid = [];
const plants = [];
const zombies = [];
const projectiles = [];
const suns = [];

// Initialize Grid
function initGrid() {
    grid.length = 0; // Clear existing
    for (let y = 0; y < GRID_ROWS; y++) {
        for (let x = 0; x < GRID_COLS; x++) {
            grid.push(new Cell(x * CELL_SIZE, y * CELL_SIZE + TOP_OFFSET));
        }
    }
}

// Initialize Settings UI
function initSettingsUI() {
    const plantContainer = document.getElementById('plant-options');
    const zombieContainer = document.getElementById('zombie-options');

    DEFAULT_CONFIG.plants.forEach(p => {
        const label = document.createElement('label');
        label.style.display = 'inline-block';
        label.style.marginRight = '10px';
        label.innerHTML = `<input type="checkbox" value="${p}" checked> ${p}`;
        plantContainer.appendChild(label);
    });

    DEFAULT_CONFIG.zombies.forEach(z => {
        const label = document.createElement('label');
        label.style.display = 'inline-block';
        label.style.marginRight = '10px';
        label.innerHTML = `<input type="checkbox" value="${z}" checked> ${z}`;
        zombieContainer.appendChild(label);
    });
}

function startGameWithSettings() {
    const sunInput = document.getElementById('start-sun-input');
    config.startSun = parseInt(sunInput.value) || 50;

    const plantChecks = document.querySelectorAll('#plant-options input:checked');
    config.plants = Array.from(plantChecks).map(c => c.value);

    const zombieChecks = document.querySelectorAll('#zombie-options input:checked');
    config.zombies = Array.from(zombieChecks).map(c => c.value);

    const muteCheck = document.getElementById('mute-toggle');
    if (muteCheck.checked) {
        audioController.toggleMute();
    } else {
        // Ensure audio context is resumed on user interaction
        if (audioController.ctx.state === 'suspended') {
            audioController.ctx.resume();
        }
        audioController.playBGM();
    }

    document.getElementById('settings-modal').style.display = 'none';
    document.getElementById('ui-layer').style.display = 'flex';

    initGame();
}

function initGame() {
    sun = config.startSun;
    frame = 0;
    gameOver = false;
    score = 0;
    plants.length = 0;
    zombies.length = 0;
    projectiles.length = 0;
    suns.length = 0;

    initGrid();
    updateSunDisplay();
    renderPlantSelection();
    gameActive = true;
    animate();
}

function renderPlantSelection() {
    const container = document.getElementById('plant-selection');
    container.innerHTML = '';

    config.plants.forEach(type => {
        const div = document.createElement('div');
        div.className = 'plant-card';
        div.onclick = () => selectPlant(type);

        const cost = getPlantCost(type);

        // Create icon from SVG
        const img = document.createElement('img');
        img.src = ASSETS[type];
        img.className = 'card-img';
        img.style.pointerEvents = 'none'; // Let click pass to card

        div.innerHTML = `<div class="card-cost">${cost}</div>`;
        div.appendChild(img);

        container.appendChild(div);
    });
}

// Input Handling
canvas.addEventListener('click', function (e) {
    if (!gameActive) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check for sun clicks
    for (let i = 0; i < suns.length; i++) {
        if (suns[i].clicked(x, y)) {
            sun += suns[i].amount;
            updateSunDisplay();
            audioController.playSun();
            suns.splice(i, 1);
            i--;
            return; // Prioritize sun clicking
        }
    }

    // Grid interaction
    if (selectedPlant) {
        // Find clicked cell
        for (let cell of grid) {
            if (cell.mouseCollision(x, y)) {
                if (!cell.plant) {
                    // Check cost
                    let cost = getPlantCost(selectedPlant);
                    if (sun >= cost) {
                        sun -= cost;
                        updateSunDisplay();
                        createPlant(selectedPlant, cell.x, cell.y);
                        cell.plant = true; // Mark cell as occupied
                        selectedPlant = null; // Deselect after placement
                    }
                }
            }
        }
    }
});

function createPlant(type, x, y) {
    switch (type) {
        case 'peashooter': plants.push(new Peashooter(x, y)); break;
        case 'sunflower': plants.push(new Sunflower(x, y)); break;
        case 'wallnut': plants.push(new WallNut(x, y)); break;
        case 'cherrybomb': plants.push(new CherryBomb(x, y)); break;
        case 'snowpea': plants.push(new SnowPea(x, y)); break;
        case 'potatomine': plants.push(new PotatoMine(x, y)); break;
        case 'chomper': plants.push(new Chomper(x, y)); break;
        case 'repeater': plants.push(new Repeater(x, y)); break;
    }
}

function selectPlant(type) {
    selectedPlant = type;
    console.log('Selected plant:', type);
}

function getPlantCost(type) {
    if (type === 'peashooter') return 100;
    if (type === 'sunflower') return 50;
    if (type === 'wallnut') return 50;
    if (type === 'cherrybomb') return 150;
    if (type === 'snowpea') return 175;
    if (type === 'potatomine') return 25;
    if (type === 'chomper') return 150;
    if (type === 'repeater') return 200;
    return 0;
}

function updateSunDisplay() {
    document.getElementById('sun-amount').innerText = sun;
}

// Game Loop
function animate() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid
    for (let cell of grid) {
        cell.draw();
    }

    // Manage Plants
    for (let i = 0; i < plants.length; i++) {
        plants[i].update();
        plants[i].draw();

        // Check for collision with zombies (simple check for now)
        for (let j = 0; j < zombies.length; j++) {
            if (plants[i] && zombies[j] && collision(plants[i], zombies[j])) {
                plants[i].health -= 0.2;
                zombies[j].movement = 0; // Stop moving to eat
            } else if (zombies[j]) {
                // Only reset movement if not eating ANY plant
                // But for simplicity, if we are not colliding with THIS plant, we might be colliding with another.
                // We need a better state for zombies.
                // For now, let's just say if they are not colliding with the plant they are eating, they move.
                // But we iterate plants first.
                // Let's handle zombie movement in handleZombies instead.
            }

            if (plants[i] && plants[i].health <= 0) {
                // Find the cell this plant was on and free it
                const cellIndex = grid.findIndex(c => c.x === plants[i].x && c.y === plants[i].y);
                if (cellIndex !== -1) grid[cellIndex].plant = false;

                plants.splice(i, 1);
                i--;
            }
        }
    }

    // Manage Zombies
    handleZombies();

    // Manage Projectiles
    handleProjectiles();

    // Manage Sun
    handleSun();

    // UI Overlay for selection
    if (selectedPlant) {
        // Could draw a ghost image under cursor here
    }

    frame++;
    if (!gameOver) requestAnimationFrame(animate);
}

// Start Game
initSettingsUI();
// initGrid(); // Called in initGame
// animate(); // Called in initGame

// Helper for collision
function collision(first, second) {
    if (!(first.x > second.x + second.width ||
        first.x + first.width < second.x ||
        first.y > second.y + second.height ||
        first.y + first.height < second.y
    )
    ) {
        return true;
    }
    return false;
}

function handleZombies() {
    for (let i = 0; i < zombies.length; i++) {
        zombies[i].update();
        zombies[i].draw();

        if (zombies[i].x < 0) {
            gameOver = true;
            ctx.fillStyle = 'black';
            ctx.font = '60px Arial';
            ctx.fillText('GAME OVER', 300, 330);
        }

        if (zombies[i].health <= 0) {
            score += 10;
            zombies.splice(i, 1);
            i--;
            continue;
        }

        // Check if zombie is eating
        let eating = false;
        for (let p of plants) {
            if (collision(p, zombies[i])) {
                eating = true;
                zombies[i].movement = 0;
                break;
            }
        }
        if (!eating) {
            zombies[i].movement = zombies[i].speed;
        }
    }

    // Spawn zombies
    if (frame % 400 === 0 && frame > 0) {
        // Pick a random row
        let row = Math.floor(Math.random() * GRID_ROWS);

        // Pick a random type from config
        if (config.zombies.length > 0) {
            const type = config.zombies[Math.floor(Math.random() * config.zombies.length)];
            zombies.push(new Zombie(row * CELL_SIZE + TOP_OFFSET, type));
        }
    }
}

function handleProjectiles() {
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].update();
        projectiles[i].draw();

        for (let j = 0; j < zombies.length; j++) {
            if (zombies[j] && collision(projectiles[i], zombies[j])) {
                zombies[j].health -= projectiles[i].power;
                audioController.playHit();
                if (projectiles[i].isFrozen) {
                    zombies[j].frozenTimer = 100; // Slow down for 100 frames
                }
                projectiles.splice(i, 1);
                i--;
                break; // Projectile hits one zombie
            }
        }

        if (projectiles[i] && projectiles[i].x > canvas.width) {
            projectiles.splice(i, 1);
            i--;
        }
    }
}

function handleSun() {
    // Random falling sun
    if (frame % 500 === 0) {
        let x = Math.random() * (canvas.width - 50);
        let y = Math.random() * (canvas.height - TOP_OFFSET) + TOP_OFFSET;
        suns.push(new Sun(x, y, 25));
    }

    for (let i = 0; i < suns.length; i++) {
        suns[i].draw();
    }
}
