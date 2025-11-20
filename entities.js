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
        this.maxHealth = 100;
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
        this.maxHealth = 100;
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
        this.maxHealth = 100;
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


class Jalapeno extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.maxHealth = 100;
        this.timer = 0;
        this.exploded = false;
    }

    draw() {
        if (!this.exploded) {
            if (loadedImages.jalapeno) {
                // Shake effect before explosion
                let shakeX = 0;
                if (this.timer > 30) {
                    shakeX = (Math.random() - 0.5) * 5;
                }
                ctx.drawImage(loadedImages.jalapeno, this.x + shakeX, this.y, this.width, this.height);
            }
            this.drawHealthBar();
        } else {
            // Draw explosion line
            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.fillRect(0, this.y + 20, canvas.width, 60);
            ctx.fillStyle = 'orange';
            ctx.fillRect(0, this.y + 30, canvas.width, 40);
        }
    }

    update() {
        if (!this.exploded) {
            this.timer++;
            if (this.timer > 60) { // 1 second delay
                this.exploded = true;
                this.timer = 0; // Reuse timer for explosion duration
                audioController.playExplosion();

                // Destroy all zombies in this row
                for (let i = 0; i < zombies.length; i++) {
                    // Check if zombie is in roughly the same row
                    if (Math.abs(zombies[i].y - this.y) < 10) {
                        zombies[i].health = 0;
                    }
                }
            }
        } else {
            this.timer++;
            if (this.timer > 20) { // Show explosion for 20 frames
                this.health = 0; // Remove plant
            }
        }
    }
}

class Squash extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.maxHealth = 100;
        this.state = 'idle'; // idle, jumping, smashing
        this.target = null;
        this.jumpY = 0;
        this.timer = 0;
    }

    draw() {
        if (loadedImages.squash) {
            ctx.drawImage(loadedImages.squash, this.x, this.y - this.jumpY, this.width, this.height);
        }
        this.drawHealthBar();
    }

    update() {
        if (this.state === 'idle') {
            // Look for zombie in same cell or adjacent (left/right)
            for (let i = 0; i < zombies.length; i++) {
                const z = zombies[i];
                // Check distance
                const dx = (z.x + z.width / 2) - (this.x + this.width / 2);
                const dy = (z.y + z.height / 2) - (this.y + this.height / 2);

                // Same row check
                if (Math.abs(dy) < 10) {
                    // Check x distance (within 1 cell range left or right)
                    if (Math.abs(dx) < CELL_SIZE * 1.2) {
                        this.target = z;
                        this.state = 'jumping';
                        break;
                    }
                }
            }
        } else if (this.state === 'jumping') {
            this.jumpY += 5;
            if (this.jumpY > 50) {
                this.state = 'smashing';
                // Move x towards target slightly if needed
                if (this.target) {
                    this.x += (this.target.x - this.x) * 0.5;
                }
            }
        } else if (this.state === 'smashing') {
            this.jumpY -= 10;
            if (this.jumpY <= 0) {
                this.jumpY = 0;
                // Smash!
                if (this.target) {
                    this.target.health -= 500; // Massive damage
                    audioController.playHit();
                }
                this.health = 0; // Remove self
            }
        }
    }
}

class Spikeweed extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.maxHealth = 100;
    }

    draw() {
        if (loadedImages.spikeweed) {
            ctx.drawImage(loadedImages.spikeweed, this.x, this.y + 20, this.width, this.height - 20);
        }
        this.drawHealthBar();
    }

    update() {
        // Deal damage to any zombie on top
        for (let i = 0; i < zombies.length; i++) {
            if (collision(this, zombies[i])) {
                zombies[i].health -= 2;
            }
        }
    }
}


class Threepeater extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.maxHealth = 100;
        this.shootTimer = 0;
    }

    draw() {
        if (loadedImages.threepeater) {
            ctx.drawImage(loadedImages.threepeater, this.x, this.y, this.width, this.height);
        }
        this.drawHealthBar();
    }

    update() {
        this.shootTimer++;
        if (this.shootTimer >= 100) {
            // Shoot in 3 rows
            projectiles.push(new Projectile(this.x + 70, this.y + 30));
            if (this.y - CELL_SIZE >= TOP_OFFSET) {
                projectiles.push(new Projectile(this.x + 70, this.y - CELL_SIZE + 30));
            }
            if (this.y + CELL_SIZE < canvas.height) {
                projectiles.push(new Projectile(this.x + 70, this.y + CELL_SIZE + 30));
            }
            audioController.playShoot();
            this.shootTimer = 0;
        }
    }
}

class Torchwood extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.maxHealth = 100;
    }

    draw() {
        if (loadedImages.torchwood) {
            ctx.drawImage(loadedImages.torchwood, this.x, this.y, this.width, this.height);
        }
        this.drawHealthBar();
    }

    update() {
        // Check for projectiles passing through
        for (let p of projectiles) {
            if (!p.isFireball && !p.isFrozen && collision(this, p)) {
                p.isFireball = true;
                p.power *= 2;
            }
        }
    }
}

class TallNut extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 800; // Very high health
        this.maxHealth = 800;
    }

    draw() {
        if (loadedImages.tallnut) {
            ctx.drawImage(loadedImages.tallnut, this.x, this.y - 20, this.width, this.height + 20);
        }
        this.drawHealthBar();
    }
}


class PuffShroom extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 50;
        this.maxHealth = 50;
        this.shootTimer = 0;
    }
    draw() { if (loadedImages.puffshroom) ctx.drawImage(loadedImages.puffshroom, this.x, this.y, this.width, this.height); this.drawHealthBar(); }
    update() {
        this.shootTimer++;
        if (this.shootTimer >= 100) {
            // Short range check
            let zombieInRange = false;
            for (let z of zombies) {
                if (z.y === this.y && z.x > this.x && z.x < this.x + 3 * CELL_SIZE) {
                    zombieInRange = true; break;
                }
            }
            if (zombieInRange) {
                let p = new Projectile(this.x + 50, this.y + 30);
                p.type = 'spore';
                projectiles.push(p);
                audioController.playShoot();
                this.shootTimer = 0;
            }
        }
    }
}

class SunShroom extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 50;
        this.maxHealth = 50;
        this.sunTimer = 0;
        this.age = 0;
    }
    draw() { if (loadedImages.sunshroom) ctx.drawImage(loadedImages.sunshroom, this.x, this.y, this.width, this.height); this.drawHealthBar(); }
    update() {
        this.sunTimer++;
        this.age++;
        if (this.sunTimer >= 400) {
            let amount = this.age > 2000 ? 25 : 15; // Grow after some time
            suns.push(new Sun(this.x + 20, this.y + 20, amount));
            this.sunTimer = 0;
        }
    }
}

class FumeShroom extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.maxHealth = 100;
        this.shootTimer = 0;
    }
    draw() { if (loadedImages.fumeshroom) ctx.drawImage(loadedImages.fumeshroom, this.x, this.y, this.width, this.height); this.drawHealthBar(); }
    update() {
        this.shootTimer++;
        if (this.shootTimer >= 100) {
            // Fume passes through zombies (piercing)
            // For simplicity, just damage all zombies in row within range (4 cols)
            let fired = false;
            for (let z of zombies) {
                if (z.y === this.y && z.x > this.x && z.x < this.x + 4 * CELL_SIZE) {
                    z.health -= 20;
                    fired = true;
                }
            }
            if (fired) {
                // Visual effect?
                audioController.playShoot();
                this.shootTimer = 0;
            }
        }
    }
}

class HypnoShroom extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 50;
        this.maxHealth = 50;
    }
    draw() { if (loadedImages.hypnoshroom) ctx.drawImage(loadedImages.hypnoshroom, this.x, this.y, this.width, this.height); this.drawHealthBar(); }
    update() {
        // If eaten, kill zombie (simplified hypno)
        for (let i = 0; i < zombies.length; i++) {
            if (collision(this, zombies[i])) {
                zombies[i].health = 0;
                this.health = 0;
                break;
            }
        }
    }
}

class ScaredyShroom extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 50;
        this.maxHealth = 50;
        this.shootTimer = 0;
        this.scared = false;
    }
    draw() {
        if (loadedImages.scaredyshroom) {
            ctx.save();
            if (this.scared) ctx.globalAlpha = 0.5; // Hiding
            ctx.drawImage(loadedImages.scaredyshroom, this.x, this.y, this.width, this.height);
            ctx.restore();
        }
        this.drawHealthBar();
    }
    update() {
        // Check for nearby zombies
        this.scared = false;
        for (let z of zombies) {
            if (z.y === this.y && Math.abs(z.x - this.x) < 2 * CELL_SIZE) {
                this.scared = true;
                break;
            }
        }
        if (!this.scared) {
            this.shootTimer++;
            if (this.shootTimer >= 100) {
                // Short range check for shooting
                let zombieInRange = false;
                for (let z of zombies) {
                    if (z.y === this.y && z.x > this.x && z.x < this.x + 3 * CELL_SIZE) { // Assuming 3 CELL_SIZE range for shooting
                        zombieInRange = true;
                        break;
                    }
                }
                if (zombieInRange) {
                    let p = new Projectile(this.x + 70, this.y + 30, true); // ScaredyShroom shoots frozen projectiles? This is unusual.
                    p.type = 'frozen';
                    projectiles.push(p);
                    audioController.playShoot();
                    this.shootTimer = 0;
                }
            }
        }
    }
}

class IceShroom extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.maxHealth = 100;
        this.timer = 0;
    }
    draw() { if (loadedImages.iceshroom) ctx.drawImage(loadedImages.iceshroom, this.x, this.y, this.width, this.height); this.drawHealthBar(); }
    update() {
        this.timer++;
        if (this.timer > 50) {
            // Freeze all zombies
            for (let z of zombies) {
                z.frozenTimer = 500; // Long freeze
            }
            this.health = 0;
        }
    }
}

class DoomShroom extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.maxHealth = 100;
        this.timer = 0;
    }
    draw() { if (loadedImages.doomshroom) ctx.drawImage(loadedImages.doomshroom, this.x, this.y, this.width, this.height); this.drawHealthBar(); }
    update() {
        this.timer++;
        if (this.timer > 100) {
            // Massive explosion
            for (let z of zombies) {
                if (Math.sqrt((z.x - this.x) ** 2 + (z.y - this.y) ** 2) < 300) {
                    z.health = 0;
                }
            }
            audioController.playExplosion();
            this.health = 0;
        }
    }
}

class SplitPea extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.maxHealth = 100;
        this.shootTimer = 0;
    }
    draw() { if (loadedImages.splitpea) ctx.drawImage(loadedImages.splitpea, this.x, this.y, this.width, this.height); this.drawHealthBar(); }
    update() {
        this.shootTimer++;
        if (this.shootTimer >= 100) {
            projectiles.push(new Projectile(this.x + 70, this.y + 30)); // Front
            let backProj = new Projectile(this.x - 20, this.y + 30); // Back
            backProj.speed = -5;
            projectiles.push(backProj);
            audioController.playShoot();
            this.shootTimer = 0;
        }
    }
}

class Starfruit extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.maxHealth = 100;
        this.shootTimer = 0;
    }
    draw() { if (loadedImages.starfruit) ctx.drawImage(loadedImages.starfruit, this.x, this.y, this.width, this.height); this.drawHealthBar(); }
    update() {
        this.shootTimer++;
        if (this.shootTimer >= 100) {
            // 5 directions: Up, Down, Back, Up-Diag, Down-Diag? 
            // Starfruit shoots: Up, Down, Back, Up-Right, Down-Right?
            // Actually it shoots 5 points of star.
            // Let's do: Up, Down, Back, Forward-Up, Forward-Down
            let dirs = [[0, -5], [0, 5], [-5, 0], [3, -3], [3, 3]];
            for (let d of dirs) {
                let p = new Projectile(this.x + 30, this.y + 30);
                p.speedX = d[0];
                p.speedY = d[1];
                p.type = 'star';
                p.update = function () { this.x += this.speedX; this.y += this.speedY; }; // Custom update
                projectiles.push(p);
            }
            audioController.playShoot();
            this.shootTimer = 0;
        }
    }
}

class MagnetShroom extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.maxHealth = 100;
        this.cooldown = 0;
    }
    draw() { if (loadedImages.magnetshroom) ctx.drawImage(loadedImages.magnetshroom, this.x, this.y, this.width, this.height); this.drawHealthBar(); }
    update() {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }
        // Steal metal
        for (let z of zombies) {
            if (Math.abs(z.x - this.x) < 200 && Math.abs(z.y - this.y) < 200) {
                if (z.type === 'buckethead' && z.health > 100) {
                    z.health = 100; // Remove bucket health
                    z.type = 'normal'; // Visual change (simplified)
                    this.cooldown = 500;
                    break;
                }
            }
        }
    }
}

class CabbagePult extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.maxHealth = 100;
        this.shootTimer = 0;
    }
    draw() { if (loadedImages.cabbagepult) ctx.drawImage(loadedImages.cabbagepult, this.x, this.y, this.width, this.height); this.drawHealthBar(); }
    update() {
        this.shootTimer++;
        if (this.shootTimer >= 200) {
            for (let z of zombies) {
                if (z.y === this.y && z.x > this.x) {
                    // Calculate target row (0-4) based on y
                    let row = Math.floor((this.y - TOP_OFFSET) / CELL_SIZE);
                    projectiles.push(new LobbedProjectile(this.x + 50, this.y + 30, row, 'cabbage'));
                    audioController.playShoot();
                    this.shootTimer = 0;
                    break;
                }
            }
        }
    }
}

class MelonPult extends Plant {
    constructor(x, y) {
        super(x, y);
        this.health = 100;
        this.maxHealth = 100;
        this.shootTimer = 0;
    }
    draw() { if (loadedImages.melonpult) ctx.drawImage(loadedImages.melonpult, this.x, this.y, this.width, this.height); this.drawHealthBar(); }
    update() {
        this.shootTimer++;
        if (this.shootTimer >= 200) {
            for (let z of zombies) {
                if (z.y === this.y && z.x > this.x) {
                    let row = Math.floor((this.y - TOP_OFFSET) / CELL_SIZE);
                    projectiles.push(new LobbedProjectile(this.x + 50, this.y + 30, row, 'melon'));
                    audioController.playShoot();
                    this.shootTimer = 0;
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
        let img = loadedImages[this.type];
        // Fallback for legacy or if type matches but key is different (e.g. normal vs zombie)
        if (!img && this.type === 'normal') img = loadedImages['normal'];

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
        this.isFireball = false;
        this.type = 'pea'; // pea, frozen, fire, spore, star, cabbage, melon
    }

    update() {
        this.x += this.speed;
    }

    draw() {
        if (this.type === 'fire' || this.isFireball) {
            ctx.fillStyle = '#FF5722';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width + 5, 0, Math.PI * 2); // Larger
            ctx.fill();
            ctx.strokeStyle = '#FFEB3B';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else if (this.type === 'frozen' || this.isFrozen) {
            ctx.fillStyle = '#03A9F4';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width + 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#E1F5FE';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (this.type === 'spore') {
            ctx.fillStyle = '#9C27B0';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2); // Larger spore
            ctx.fill();
            ctx.strokeStyle = '#E1BEE7';
            ctx.lineWidth = 1;
            ctx.stroke();
        } else if (this.type === 'star') {
            ctx.fillStyle = '#FFEB3B';
            ctx.beginPath();
            // Larger star
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * 15 + this.x,
                    Math.sin((18 + i * 72) * Math.PI / 180) * 15 + this.y);
                ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * 6 + this.x,
                    Math.sin((54 + i * 72) * Math.PI / 180) * 6 + this.y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#F57F17';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            // Standard pea
            ctx.fillStyle = '#8BC34A';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width + 3, 0, Math.PI * 2); // Larger
            ctx.fill();
            ctx.strokeStyle = '#33691E';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}

class LobbedProjectile {
    constructor(x, y, targetRow, type = 'cabbage') {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.targetRow = targetRow;
        this.type = type;
        this.power = type === 'melon' ? 80 : 20;
        this.speed = 4;
        this.progress = 0; // 0 to 1
        this.targetX = x + 400; // Default target distance
        // Find target zombie
        for (let z of zombies) {
            if (z.y === (targetRow * CELL_SIZE) + TOP_OFFSET && z.x > x) {
                this.targetX = z.x + 40; // Aim for center
                break;
            }
        }
        this.targetY = (targetRow * CELL_SIZE) + TOP_OFFSET + 50;
        this.height = 150; // Arc height
        this.markedForDeletion = false;
        this.rotation = 0;
    }

    update() {
        this.progress += 0.015;
        this.x = this.startX + (this.targetX - this.startX) * this.progress;
        // Parabolic arc: y = startY + (targetY - startY)*t - 4*h*t*(1-t)
        this.y = this.startY + (this.targetY - this.startY) * this.progress - 4 * this.height * this.progress * (1 - this.progress);
        this.rotation += 0.2;

        if (this.progress >= 1) {
            this.markedForDeletion = true;
            // Check collision/splash
            let hit = false;
            for (let z of zombies) {
                if (Math.abs(z.x - this.x) < 60 && Math.abs(z.y - this.y) < 60) {
                    z.health -= this.power;
                    hit = true;
                    // Splash for melon
                    if (this.type === 'melon') {
                        spawnParticles(this.x, this.y, 'melon_splash', 20); // More particles
                        spawnParticles(this.x, this.y, 'melon_chunk', 5); // Chunks
                    } else {
                        spawnParticles(this.x, this.y, 'leaf_splash');
                    }
                }
            }
            if (!hit) {
                spawnParticles(this.x, this.y, 'dust');
            }
        }
    }

    draw() {
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        // Shadow size based on height (smaller when higher)
        let shadowSize = 15 * (1 - this.progress * 0.5);
        ctx.ellipse(this.x, this.targetY, shadowSize, shadowSize * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        if (this.type === 'melon') {
            // Melon Body
            ctx.fillStyle = '#4CAF50'; // Light green
            ctx.beginPath();
            ctx.ellipse(0, 0, 20, 16, 0, 0, Math.PI * 2);
            ctx.fill();

            // Dark stripes
            ctx.fillStyle = '#1B5E20'; // Dark green
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.ellipse((i - 1) * 10, 0, 4, 16, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.strokeStyle = '#1B5E20';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Shine
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.ellipse(-5, -6, 8, 4, -0.5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Cabbage
            ctx.fillStyle = '#8BC34A';
            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 2); // Larger cabbage
            ctx.fill();
            ctx.strokeStyle = '#33691E';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Leaves detail
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.quadraticCurveTo(0, -8, 8, 0);
            ctx.moveTo(-8, 4);
            ctx.quadraticCurveTo(0, 12, 8, 4);
            ctx.stroke();
        }
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.startY = y; // Ground level for this particle
        this.type = type;
        this.life = 1.0;
        this.decay = Math.random() * 0.05 + 0.02;
        this.speedX = (Math.random() - 0.5) * 6; // Faster spread
        this.speedY = (Math.random() - 0.5) * 6;
        this.gravity = 0.5; // Gravity
        this.size = Math.random() * 5 + 2;
        this.color = 'white';
        if (type === 'melon_splash') {
            this.color = '#4CAF50';
            this.speedY = -Math.random() * 5 - 2; // Explode up
        }
        if (type === 'melon_chunk') {
            this.color = '#1B5E20';
            this.size = Math.random() * 8 + 4; // Bigger chunks
            this.decay = 0.01; // Last longer
            this.speedY = -Math.random() * 8 - 3; // Explode higher
        }
        if (type === 'leaf_splash') this.color = '#8BC34A';
        if (type === 'dust') this.color = '#9E9E9E';
        if (type === 'fire') { this.color = '#FF5722'; this.gravity = -0.1; } // Fire floats up
        if (type === 'ice') this.color = '#03A9F4';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity; // Apply gravity

        // Ground collision
        if (this.y >= this.startY + 20) { // Approximate ground
            this.y = this.startY + 20;
            this.speedY *= -0.5; // Bounce
            this.speedX *= 0.8; // Friction
        }

        this.life -= this.decay;
    }

    draw() {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        if (this.type === 'melon_chunk') {
            // Draw chunks as irregular shapes
            ctx.rect(this.x, this.y, this.size, this.size);
        } else {
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

class ConeHeadZombie extends Zombie {
    constructor(y) {
        super(y);
        this.type = 'conehead';
        this.health = 200;
        this.maxHealth = 200;
    }
}

class BucketHeadZombie extends Zombie {
    constructor(y) {
        super(y);
        this.type = 'buckethead';
        this.health = 300;
        this.maxHealth = 300;
    }
}

class NewspaperZombie extends Zombie {
    constructor(y) {
        super(y);
        this.type = 'newspaper';
        this.health = 150; // 100 base + 50 shield
        this.maxHealth = 150;
        this.hasNewspaper = true;
        this.baseSpeed = this.speed;
    }

    update() {
        super.update();
        // Check if newspaper is lost (health < 100)
        if (this.hasNewspaper && this.health < 100) {
            this.hasNewspaper = false;
            this.speed = this.baseSpeed * 3; // Enrage speed
        }
    }

    draw() {
        super.draw();
        if (this.hasNewspaper) {
            // Draw newspaper overlay if needed, but SVG handles it mostly
        }
    }
}

class BalloonZombie extends Zombie {
    constructor(y) {
        super(y);
        this.type = 'balloon';
        this.health = 100;
        this.maxHealth = 100;
        this.isFlying = true;
    }

    update() {
        super.update();
        // If damaged, balloon pops
        if (this.isFlying && this.health < 100) {
            this.isFlying = false;
            // Visual drop effect could be added here
        }
    }

    draw() {
        if (this.isFlying) {
            ctx.save();
            ctx.translate(0, -20); // Float up
            super.draw();
            ctx.restore();
        } else {
            super.draw();
        }
    }
}

class AllStarZombie extends Zombie {
    constructor(y) {
        super(y);
        this.type = 'allstar';
        this.health = 300; // High health
        this.maxHealth = 300;
        this.speed = this.speed * 2.5; // Fast start
        this.tackleDone = false;
    }

    update() {
        super.update();
        // Check for collision to tackle
        if (!this.tackleDone) {
            for (let plant of plants) {
                if (plant.y === this.y && Math.abs(plant.x - this.x) < 40) {
                    // Tackle! Instant kill plant
                    plant.health = 0;
                    this.tackleDone = true;
                    this.speed = this.speed / 2.5; // Return to normal speed
                    break;
                }
            }
        }
    }
}

class MinerZombie extends Zombie {
    constructor(y) {
        super(y);
        this.type = 'miner';
        this.health = 100;
        this.maxHealth = 100;
        this.state = 'digging'; // digging, rising, walking
        this.digTimer = 0;
        this.x = 900; // Start off screen
        this.targetX = 100; // Target left side
        this.speed = 2;
    }

    update() {
        if (this.state === 'digging') {
            this.x -= this.speed;
            // Visual: maybe draw dirt particles
            if (this.x <= this.targetX) {
                this.state = 'rising';
                this.digTimer = 50;
            }
        } else if (this.state === 'rising') {
            this.digTimer--;
            if (this.digTimer <= 0) {
                this.state = 'walking';
            }
        } else if (this.state === 'walking') {
            // Walk backwards (right)
            this.x += this.speed * 0.5;
            if (this.x > 900) {
                // Walked off screen?
            }

            // Eat plants (check collision)
            this.eating = false;
            for (let plant of plants) {
                if (plant.y === this.y && Math.abs(plant.x - this.x) < 40) {
                    this.eating = true;
                    plant.health -= 0.5;
                    break;
                }
            }
        }
    }

    draw() {
        if (this.state === 'digging') {
            // Draw dirt mound moving
            ctx.fillStyle = '#795548';
            ctx.beginPath();
            ctx.arc(this.x, this.y + 80, 20, 0, Math.PI, true);
            ctx.fill();
        } else {
            // Draw zombie facing right (flip)
            ctx.save();
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            if (loadedImages[this.type]) {
                ctx.drawImage(loadedImages[this.type], 0, 0, this.width, this.height);
            } else {
                ctx.fillStyle = 'blue';
                ctx.fillRect(0, 0, this.width, this.height);
            }
            ctx.restore();
            this.drawHealthBar();
        }
    }
}

function spawnParticles(x, y, type, count = 10) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, type));
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
