"use strict";

export default class Player {
  constructor(
    canvas,
    canvasContenxt,
    spriteRunLeft,
    spriteRunRight,
    spriteStandLeft,
    spriteStandRight
  ) {
    this.canvas = canvas;
    this.canvasContenxt = canvasContenxt;
    this.position = {
      x: 100,
      y: 300,
    };
    this.velocity = {
      x: 0,
      y: 20,
    };
    this.width = 66;
    this.height = 150;
    this.speed = 5;

    this.image = spriteStandRight;
    this.frames = 0;
    this.sprites = {
      stand: {
        right: spriteStandRight,
        left: spriteStandLeft,
        cropWidth: 177,
        width: 66,
      },
      run: {
        right: spriteRunRight,
        left: spriteRunLeft,
        cropWidth: 341,
        width: 127.875,
      },
    };

    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;

    this.gravity = 1;
  }

  draw() {
    this.canvasContenxt.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames++;
    if (
      this.frames > 59 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    ) {
      this.frames = 0;
    } else if (
      this.frames > 29 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    ) {
      this.frames = 0;
    }
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // 가장 하단까지만 이동
    if (this.position.y + this.height + this.velocity.y <= this.canvas.height) {
      this.velocity.y += this.gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}
