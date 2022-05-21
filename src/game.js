"use strict";

import Player from "./player.js";
import Platform from "./platform.js";
import GenericObject from "./genericObject.js";

function createImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

const plateFormImage = await createImage("./static/images/platform.png");
const plateFormSmallImage = await createImage(
  "./static/images/platformSmallTall.png"
);
const backgroundImage = await createImage("./static/images/background.png");
const hillsImage = await createImage("./static/images/hills.png");

const spriteRunLeft = await createImage("./static/images/spriteRunLeft.png");
const spriteRunRight = await createImage("./static/images/spriteRunRight.png");
const spriteStandLeft = await createImage(
  "./static/images/spriteStandLeft.png"
);
const spriteStandRight = await createImage(
  "./static/images/spriteStandRight.png"
);

export default class Game {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.canvas.width = 1024;
    this.canvas.height = 576;
    this.canvasContext = canvas.getContext("2d");

    this.player = "";
    this.platforms = [];
    this.genericObjects = [];
    this.keys = {};
    this.scrollOffset = 0;
    this.lastKey = "";
  }

  init() {
    this.player = new Player(
      this.canvasContext,
      spriteRunLeft,
      spriteRunRight,
      spriteStandLeft,
      spriteStandRight
    );

    this.platforms = [
      new Platform({
        canvas: this.canvasContext,
        x:
          plateFormImage.width * 4 +
          300 -
          2 +
          plateFormImage.width -
          plateFormSmallImage.width,
        y: 270,
        image: plateFormSmallImage,
      }),
      new Platform({
        canvas: this.canvasContext,
        x: -1,
        y: 470,
        image: plateFormImage,
      }),
      new Platform({
        canvas: this.canvasContext,
        x: plateFormImage.width - 3,
        y: 470,
        image: plateFormImage,
      }),
      new Platform({
        canvas: this.canvasContext,
        x: plateFormImage.width * 2 + 100,
        y: 470,
        image: plateFormImage,
      }),
      new Platform({
        canvas: this.canvasContext,
        x: plateFormImage.width * 3 + 300,
        y: 470,
        image: plateFormImage,
      }),
      new Platform({
        canvas: this.canvasContext,
        x: plateFormImage.width * 4 + 300 - 2,
        y: 470,
        image: plateFormImage,
      }),
      new Platform({
        canvas: this.canvasContext,
        x: plateFormImage.width * 5 + 700 - 2,
        y: 470,
        image: plateFormImage,
      }),
    ];

    this.genericObjects = [
      new GenericObject({
        canvas: this.canvasContext,
        x: -1,
        y: -1,
        image: backgroundImage,
      }),
      new GenericObject({
        canvas: this.canvasContext,
        x: -1,
        y: -1,
        image: hillsImage,
      }),
    ];

    this.keys = {
      right: {
        pressed: false,
      },
      left: {
        pressed: false,
      },
    };

    this.scrollOffset = 0;
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    this.canvasContext.fillStyle = "white";
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.genericObjects.forEach((genericObject) => {
      genericObject.draw();
    });
    this.platforms.forEach((platform) => {
      platform.draw();
    });
    this.player.update();

    // 플레이어 x좌표 이동 설정
    if (this.keys.right.pressed && this.player.position.x < 400) {
      this.player.velocity.x = this.player.speed;
    } else if (
      (this.keys.left.pressed && this.player.position.x > 100) ||
      (this.keys.left.pressed &&
        this.scrollOffset === 0 &&
        this.player.position.x > 0)
    ) {
      this.player.velocity.x = -this.player.speed;
    } else {
      this.player.velocity.x = 0;
      if (this.keys.right.pressed) {
        this.scrollOffset += this.player.speed;
        this.platforms.forEach((platform) => {
          platform.position.x -= this.player.speed;
        });
        this.genericObjects.forEach((genericObject) => {
          genericObject.position.x -= this.player.speed * 0.66;
        });
      } else if (this.keys.left.pressed && this.scrollOffset > 0) {
        this.scrollOffset -= this.player.speed;
        this.platforms.forEach((platform) => {
          platform.position.x += this.player.speed;
        });
        this.genericObjects.forEach((genericObject) => {
          genericObject.position.x += this.player.speed * 0.66;
        });
      }
    }

    // 플랫폼과 충돌 시
    this.platforms.forEach((platform) => {
      if (
        this.player.position.y + this.player.height <= platform.position.y &&
        this.player.position.y + this.player.height + this.player.velocity.y >=
          platform.position.y &&
        this.player.position.x + this.player.width >= platform.position.x &&
        this.player.position.x <= platform.position.x + platform.width
      ) {
        this.player.velocity.y = 0;
      }
    });

    if (
      this.keys.right.pressed &&
      this.lastKey === "right" &&
      this.player.currentSprite !== this.player.sprites.run.right
    ) {
      this.player.frames = 1;
      this.player.currentSprite = this.player.sprites.run.right;
      this.player.currentCropWidth = this.player.sprites.run.cropWidth;
      this.player.width = this.player.sprites.run.width;
    } else if (
      this.keys.left.pressed &&
      this.lastKey === "left" &&
      this.player.currentSprite !== this.player.sprites.run.left
    ) {
      this.player.currentSprite = this.player.sprites.run.left;
      this.player.currentCropWidth = this.player.sprites.run.cropWidth;
      this.player.width = this.player.sprites.run.width;
    } else if (
      !this.keys.left.pressed &&
      this.lastKey === "left" &&
      this.player.currentSprite !== this.player.sprites.stand.left
    ) {
      this.player.currentSprite = this.player.sprites.stand.left;
      this.player.currentCropWidth = this.player.sprites.stand.cropWidth;
      this.player.width = this.player.sprites.stand.width;
    } else if (
      !this.keys.right.pressed &&
      this.lastKey === "right" &&
      this.player.currentSprite !== this.player.sprites.stand.right
    ) {
      this.player.currentSprite = this.player.sprites.stand.right;
      this.player.currentCropWidth = this.player.sprites.stand.cropWidth;
      this.player.width = this.player.sprites.stand.width;
    }

    // 승리 조건
    if (this.scrollOffset > this.plateFormImage.width * 5 + 300 - 2) {
      console.log("game win");
    }

    // 패배 조건
    if (this.player.position.y + this.player.height > this.canvas.height) {
      console.log("game lose");
      this.init();
    }
  };
}
