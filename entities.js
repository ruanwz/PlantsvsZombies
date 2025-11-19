class Plant {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CELL_SIZE - 10;
        this.height = CELL_SIZE - 10;
        this.health = 100;
        this.maxHealth = 100;
        this.timer = 0;
    }

    draw() {
        // Base draw
    }

    drawHealthBar() {
        if (this.health < this.maxHealth) {
            const percent = Math.max(0, this.health / this.maxHealth);
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y - 10, this.width, 5);
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y - 10, this.width * percent, 5);
        }
    }

    update() {
        // Base update
    }
}

class Peashooter extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.shootTimer = 0;
    }

    draw() {
        if (loadedImages.peashooter) {
            ctx.drawImage(loadedImages.peashooter, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(this.x + 10, this.y + 10, this.width, this.height);
        }
        this.drawHealthBar();
    }

    update() {
        this.shootTimer++;
        if (this.shootTimer >= 100) {
            projectiles.push(new Projectile(this.x + 70, this.y + 30));
            audioController.playShoot();
            this.shootTimer = 0;
        }
    }
}

class Sunflower extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 80;
        this.maxHealth = 80;
        this.sunTimer = 0;
    }

    draw() {
        if (loadedImages.sunflower) {
            ctx.drawImage(loadedImages.sunflower, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(this.x + 10, this.y + 10, this.width, this.height);
        }
        this.drawHealthBar();
    }

    update() {
        this.sunTimer++;
        if (this.sunTimer >= 300) {
            suns.push(new Sun(this.x + 20, this.y + 20, 25));
            this.sunTimer = 0;
        }
    }
}

class WallNut extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 400; // High health
        this.maxHealth = 400;
    }

    draw() {
        if (loadedImages.wallnut) {
            ctx.drawImage(loadedImages.wallnut, this.x, this.y, this.width, this.height);
        }
        this.drawHealthBar();
    }
}

class CherryBomb extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.maxHealth = 100;
        this.timer = 0;
    }

    draw() {
        if (loadedImages.cherrybomb) {
            ctx.drawImage(loadedImages.cherrybomb, this.x, this.y, this.width, this.height);
        }
        this.drawHealthBar();
    }

    update() {
        this.timer++;
        if (this.timer > 50) { // Explode after short delay
            // Damage all zombies in 3x3 area
            // Center is this.x, this.y
            // Range is roughly 1.5 * CELL_SIZE radius
            const range = 1.5 * CELL_SIZE;
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;

            for (let i = 0; i < zombies.length; i++) {
                const z = zombies[i];
                const zCenterX = z.x + z.width / 2;
                const zCenterY = z.y + z.height / 2;
                const dist = Math.sqrt((centerX - zCenterX) ** 2 + (centerY - zCenterY) ** 2);

                if (dist < range) {
                    z.health -= 500; // Massive damage
                }
            }
            audioController.playExplosion();
            this.health = 0; // Kill self
        }
    }
}

class SnowPea extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.shootTimer = 0;
    }

    draw() {
        if (loadedImages.snowpea) {
            ctx.drawImage(loadedImages.snowpea, this.x, this.y, this.width, this.height);
        }
        this.drawHealthBar();
    }

    update() {
        this.shootTimer++;
        if (this.shootTimer >= 100) {
            projectiles.push(new Projectile(this.x + 70, this.y + 30, true)); // true for frozen
            audioController.playShoot();
            this.shootTimer = 0;
        }
    }
}

class Repeater extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.shootTimer = 0;
    }

    draw() {
        if (loadedImages.repeater) {
            ctx.drawImage(loadedImages.repeater, this.x, this.y, this.width, this.height);
        }
        this.drawHealthBar();
    }

    update() {
        this.shootTimer++;
        if (this.shootTimer >= 100) {
            // Shoot twice
            projectiles.push(new Projectile(this.x + 70, this.y + 30));
            setTimeout(() => {
                projectiles.push(new Projectile(this.x + 70, this.y + 30));
            }, 200); // 200ms delay for second shot
            audioController.playShoot();
            this.shootTimer = 0;
        }
    }
}

class PotatoMine extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.maxHealth = 100;
        this.armTimer = 0;
        this.armed = false;
    }

    draw() {
        if (loadedImages.potatomine) {
            ctx.save();
            if (!this.armed) ctx.globalAlpha = 0.5;
            ctx.drawImage(loadedImages.potatomine, this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        this.drawHealthBar();
    }

    update() {
        if (!this.armed) {
            this.armTimer++;
            if (this.armTimer > 500) { // Takes time to arm
                this.armed = true;
            }
        } else {
            // Check for collision with zombies
            for (let i = 0; i < zombies.length; i++) {
                if (collision(this, zombies[i])) {
                    zombies[i].health -= 1000; // Massive damage
                    audioController.playExplosion();
                    this.health = 0; // Kill self
                    break;
                }
            }
        }
    }
}

class Chomper extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.maxHealth = 100;
        this.state = 'idle'; // idle, chewing
        this.chewTimer = 0;
    }

    draw() {
        if (loadedImages.chomper) {
            ctx.drawImage(loadedImages.chomper, this.x, this.y, this.width, this.height);
        }
        this.drawHealthBar();
    }

    update() {
        if (this.state === 'chewing') {
            this.chewTimer++;
            if (this.chewTimer > 1000) { // Long chew time
                this.state = 'idle';
                this.chewTimer = 0;
            }
        } else {
            // Look for zombie in front
            for (let i = 0; i < zombies.length; i++) {
                const z = zombies[i];
                // Check if zombie is close in front (same row, within 1.5 cells)
                if (z.y === this.y && z.x > this.x && z.x < this.x + 1.5 * CELL_SIZE) {
                    z.health = 0; // Instakill
                    this.state = 'chewing';
                    // Play chomp sound (reuse hit for now or add new)
                    audioController.playHit();
                    break;
                }
            }
        }
    }
}

class Zombie {
    constructor(verticalPosition, type = 'normal') {
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = CELL_SIZE - 10;
        this.height = CELL_SIZE - 10;
        this.speed = Math.random() * 0.2 + 0.4;
        this.movement = this.speed;
        this.type = type;
        this.frozenTimer = 0;

        if (type === 'conehead') {
            this.health = 200;
            this.maxHealth = 200;
        } else if (type === 'buckethead') {
            this.health = 300;
            this.maxHealth = 300;
        } else if (type === 'flagzombie') {
            this.health = 150;
            this.maxHealth = 150;
            this.speed *= 1.2; // Faster
        } else if (type === 'newspaperzombie') {
            this.health = 150; // 50 body + 100 newspaper
            this.maxHealth = 150;
            this.hasNewspaper = true;
        } else {
            this.health = 100;
            this.maxHealth = 100;
        }
        this.movement = this.speed;
    }

    update() {
        let currentSpeed = this.movement;
        if (this.frozenTimer > 0) {
            currentSpeed *= 0.5;
            this.frozenTimer--;
        }

        if (this.type === 'newspaperzombie' && this.hasNewspaper && this.health < 50) {
            this.hasNewspaper = false;
            this.movement *= 2; // Enrage
            this.speed *= 2;
        }

        this.x -= currentSpeed;
    }

    draw() {
        let img = loadedImages.zombie;
        if (this.type === 'conehead') img = loadedImages.conehead;
        if (this.type === 'buckethead') img = loadedImages.buckethead;
        if (this.type === 'flagzombie') img = loadedImages.flagzombie;
        if (this.type === 'newspaperzombie') img = loadedImages.newspaperzombie;

        if (img) {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = '#795548';
            ctx.fillRect(this.x, this.y + 10, this.width, this.height);
        }

        // Frozen effect
        if (this.frozenTimer > 0) {
            ctx.fillStyle = 'rgba(0, 100, 255, 0.3)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        // Health bar
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width * (this.health / this.maxHealth), 5);
    }
}

class Projectile {
    constructor(x, y, isFrozen = false) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.power = 20;
        this.speed = 5;
        this.isFrozen = isFrozen;
    }

    update() {
        this.x += this.speed;
    }

    draw() {
        ctx.fillStyle = this.isFrozen ? '#03A9F4' : '#8BC34A';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Sun {
    constructor(x, y, amount) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.amount = amount;
        this.despawnTimer = 0;
    }

    draw() {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 15, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'orange';
        ctx.stroke();
    }

    clicked(mouseX, mouseY) {
        // Simple distance check
        let dist = Math.sqrt((mouseX - (this.x + 15)) ** 2 + (mouseY - (this.y + 15)) ** 2);
        return dist < 20;
    }
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
        }
    }

    // Spawn zombies
    if (frame % 400 === 0 && frame > 0) {
        // Pick a random row
        let row = Math.floor(Math.random() * GRID_ROWS);
        zombies.push(new Zombie(row * CELL_SIZE + TOP_OFFSET));
    }
}

function handleProjectiles() {
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].update();
        projectiles[i].draw();

        for (let j = 0; j < zombies.length; j++) {
            if (zombies[j] && collision(projectiles[i], zombies[j])) {
                zombies[j].health -= projectiles[i].power;
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
        let y = -50; // Start above
        // We'll need to animate it falling in a real update, for now just spawn at random spot
        // Actually let's spawn it at a random spot on the grid for simplicity first
        y = Math.random() * (canvas.height - TOP_OFFSET) + TOP_OFFSET;
        suns.push(new Sun(x, y, 25));
    }

    for (let i = 0; i < suns.length; i++) {
        suns[i].draw();
        // Could add despawn logic
    }
}
