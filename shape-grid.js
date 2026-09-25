class ShapeGrid {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.hero = canvas.closest(".hero");

    this.speed = options.speed ?? 0.5;
    this.squareSize = options.squareSize ?? 40;
    this.direction = options.direction ?? "diagonal";
    this.borderColor = options.borderColor ?? "rgba(47,41,58,.28)";
    this.hoverFillColor = options.hoverFillColor ?? "#d7b15e";
    this.shape = options.shape ?? "square";
    this.hoverTrailAmount = options.hoverTrailAmount ?? 20;

    this.width = 0;
    this.height = 0;

    this.offsetX = 0;
    this.offsetY = 0;

    this.hoveredCell = null;
    this.trail = [];

    this.animationFrame = null;

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

    window.addEventListener("resize", this.resize);

    if (this.hero) {
      this.hero.addEventListener("mousemove", this.handleMouseMove);
      this.hero.addEventListener("mouseleave", this.handleMouseLeave);
    }

    this.resize();
    this.animate();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  animate() {
    this.update();
    this.draw();

    this.animationFrame = requestAnimationFrame(this.animate);
  }

  update() {
    const speed = this.speed;
    const size = this.squareSize;

    if (this.direction === "right") {
      this.offsetX -= speed;
    }

    if (this.direction === "left") {
      this.offsetX += speed;
    }

    if (this.direction === "up") {
      this.offsetY += speed;
    }

    if (this.direction === "down") {
      this.offsetY -= speed;
    }

    if (this.direction === "diagonal") {
      this.offsetX -= speed;
      this.offsetY -= speed;
    }

    this.offsetX = ((this.offsetX % size) + size) % size;
    this.offsetY = ((this.offsetY % size) + size) % size;
  }

  draw() {
    const ctx = this.ctx;
    const size = this.squareSize;

    ctx.clearRect(0, 0, this.width, this.height);

    const columns = Math.ceil(this.width / size) + 3;
    const rows = Math.ceil(this.height / size) + 3;

    for (let col = -2; col < columns; col++) {
      for (let row = -2; row < rows; row++) {
        const x = col * size + this.offsetX - size;
        const y = row * size + this.offsetY - size;

        const isHovered =
          this.hoveredCell &&
          this.hoveredCell.x === col &&
          this.hoveredCell.y === row;

        const trailIndex = this.trail.findIndex(
          (cell) => cell.x === col && cell.y === row,
        );

        if (isHovered) {
          ctx.save();
          ctx.fillStyle = this.hoverFillColor;
          ctx.globalAlpha = 0.55;

          this.drawShape(x, y, size, true);

          ctx.restore();
        } else if (trailIndex !== -1) {
          const opacity = 1 - trailIndex / Math.max(this.hoverTrailAmount, 1);

          ctx.save();
          ctx.fillStyle = this.hoverFillColor;
          ctx.globalAlpha = Math.max(0, opacity) * 0.4;

          this.drawShape(x, y, size, true);

          ctx.restore();
        }

        ctx.save();

        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;

        this.drawShape(x, y, size, false);

        ctx.restore();
      }
    }
  }

  drawShape(x, y, size, fill) {
    const ctx = this.ctx;

    if (this.shape === "square") {
      if (fill) {
        ctx.fillRect(x, y, size, size);
      } else {
        ctx.strokeRect(x, y, size, size);
      }

      return;
    }

    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const radius = size / 2;

    ctx.beginPath();

    if (this.shape === "circle") {
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    }

    if (this.shape === "triangle") {
      ctx.moveTo(centerX, y);
      ctx.lineTo(x + size, y + size);
      ctx.lineTo(x, y + size);
      ctx.closePath();
    }

    if (this.shape === "hexagon") {
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;

        const px = centerX + radius * Math.cos(angle);

        const py = centerY + radius * Math.sin(angle);

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }

      ctx.closePath();
    }

    if (fill) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  }

  getCellFromMouse(event) {
    const rect = this.canvas.getBoundingClientRect();
    const size = this.squareSize;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const offsetX = ((this.offsetX % size) + size) % size;

    const offsetY = ((this.offsetY % size) + size) % size;

    return {
      x: Math.floor((mouseX - offsetX) / size),
      y: Math.floor((mouseY - offsetY) / size),
    };
  }

  handleMouseMove(event) {
    const cell = this.getCellFromMouse(event);

    if (
      !this.hoveredCell ||
      this.hoveredCell.x !== cell.x ||
      this.hoveredCell.y !== cell.y
    ) {
      if (this.hoveredCell) {
        this.trail.unshift({
          x: this.hoveredCell.x,
          y: this.hoveredCell.y,
        });
      }

      this.trail = this.trail.slice(0, this.hoverTrailAmount);

      this.hoveredCell = cell;
    }
  }

  handleMouseLeave() {
    this.hoveredCell = null;
    this.trail = [];
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    window.removeEventListener("resize", this.resize);

    if (this.hero) {
      this.hero.removeEventListener("mousemove", this.handleMouseMove);

      this.hero.removeEventListener("mouseleave", this.handleMouseLeave);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("heroShapeGrid");

  if (!canvas) return;

  new ShapeGrid(canvas, {
    speed: 0.5,
    squareSize: 50,
    direction: "diagonal",
    borderColor: "rgba(0, 0, 0, 0.28)",
    hoverFillColor: "#ffae00",
    shape: "square",
    hoverTrailAmount: 30,
  });
});
