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
}
