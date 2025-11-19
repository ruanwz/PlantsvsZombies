class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CELL_SIZE;
        this.height = CELL_SIZE;
        this.plant = false; // Is there a plant here?
    }

    draw() {
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    mouseCollision(mouseX, mouseY) {
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.width &&
            mouseY >= this.y &&
            mouseY <= this.y + this.height
        );
    }
}
