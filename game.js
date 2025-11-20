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
const particles = [];
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
        label.style.display = 'inline-flex';
        label.style.alignItems = 'center';
        label.style.marginRight = '15px';
        label.style.cursor = 'pointer';

        const img = document.createElement('img');
        img.src = ASSETS[p];
        img.style.width = '30px';
        img.style.height = '30px';
        img.style.marginRight = '5px';
        img.style.verticalAlign = 'middle';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = p;
        checkbox.checked = true;
        checkbox.style.marginRight = '5px';

        label.appendChild(checkbox);
        label.appendChild(img);
        label.appendChild(document.createTextNode(p));

        plantContainer.appendChild(label);
    });

    DEFAULT_CONFIG.zombies.forEach(z => {
        const label = document.createElement('label');
        label.style.display = 'inline-flex';
        label.style.alignItems = 'center';
        label.style.marginRight = '15px';
        label.style.cursor = 'pointer';

        const img = document.createElement('img');
        img.src = ASSETS[z];
        img.style.width = '30px';
        img.style.height = '45px'; // Taller for zombies
        img.style.marginRight = '5px';
        img.style.verticalAlign = 'middle';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = z;
        checkbox.checked = true;
        checkbox.style.marginRight = '5px';

        label.appendChild(checkbox);
        label.appendChild(img);
        label.appendChild(document.createTextNode(z));

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

    canvas.width = 900;
    canvas.height = 700;
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
        case 'jalapeno': plants.push(new Jalapeno(x, y)); break;
        case 'squash': plants.push(new Squash(x, y)); break;
        case 'spikeweed': plants.push(new Spikeweed(x, y)); break;
        case 'threepeater': plants.push(new Threepeater(x, y)); break;
        case 'torchwood': plants.push(new Torchwood(x, y)); break;
        case 'tallnut': plants.push(new TallNut(x, y)); break;
        case 'puffshroom': plants.push(new PuffShroom(x, y)); break;
        case 'sunshroom': plants.push(new SunShroom(x, y)); break;
        case 'fumeshroom': plants.push(new FumeShroom(x, y)); break;
        case 'hypnoshroom': plants.push(new HypnoShroom(x, y)); break;
        case 'scaredyshroom': plants.push(new ScaredyShroom(x, y)); break;
        case 'iceshroom': plants.push(new IceShroom(x, y)); break;
        case 'doomshroom': plants.push(new DoomShroom(x, y)); break;
        case 'splitpea': plants.push(new SplitPea(x, y)); break;
        case 'starfruit': plants.push(new Starfruit(x, y)); break;
        case 'magnetshroom': plants.push(new MagnetShroom(x, y)); break;
        case 'cabbagepult': plants.push(new CabbagePult(x, y)); break;
        case 'melonpult': plants.push(new MelonPult(x, y)); break;
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
    if (type === 'jalapeno') return 125;
    if (type === 'squash') return 50;
    if (type === 'spikeweed') return 100;
    if (type === 'threepeater') return 325;
    if (type === 'torchwood') return 175;
    if (type === 'tallnut') return 125;
    if (type === 'puffshroom') return 0;
    if (type === 'sunshroom') return 25;
    if (type === 'fumeshroom') return 75;
    if (type === 'hypnoshroom') return 75;
    if (type === 'scaredyshroom') return 25;
    if (type === 'iceshroom') return 75;
    if (type === 'doomshroom') return 125;
    if (type === 'splitpea') return 125;
    if (type === 'starfruit') return 125;
    if (type === 'magnetshroom') return 100;
    if (type === 'cabbagepult') return 100;
    if (type === 'melonpult') return 300;
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
                if (!(plants[i] instanceof Spikeweed)) {
                    plants[i].health -= 0.2;
                    zombies[j].movement = 0; // Stop moving to eat
                }
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

    // Handle particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }

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
            let type = config.zombies[Math.floor(Math.random() * config.zombies.length)];
            let zombie;
            const zombieY = row * CELL_SIZE + TOP_OFFSET;
            if (type === 'conehead') {
                zombie = new ConeHeadZombie(zombieY);
            } else if (type === 'buckethead') {
                zombie = new BucketHeadZombie(zombieY);
            } else if (type === 'newspaper') {
                zombie = new NewspaperZombie(zombieY);
            } else if (type === 'balloon') {
                zombie = new BalloonZombie(zombieY);
            } else if (type === 'allstar') {
                zombie = new AllStarZombie(zombieY);
            } else if (type === 'miner') {
                zombie = new MinerZombie(zombieY);
            } else {
                zombie = new Zombie(zombieY);
            }
            zombies.push(zombie);
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
