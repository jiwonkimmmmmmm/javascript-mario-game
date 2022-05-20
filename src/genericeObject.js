"use strict";

export default class GenericObject {
  constructor({ canvas, x, y, image }) {
    this.canvas = canvas;
    this.position = {
      x,
      y,
    };

    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    this.canvas.drawImage(this.image, this.position.x, this.position.y);
  }
}
