"use strict";

const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;

const c = canvas.getContext("2d");

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

const gravity = 1;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
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
  }

  draw() {
    c.drawImage(
      this.image,
      177 * this.frames,
      0,
      177,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames++;
    if (this.frames > 20) this.frames = 0;
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // 가장 하단까지만 이동
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };

    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };

    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

let player = new Player();

let platforms = [];
let genericObjects = [];
let keys = {};
let scrollOffset = 0;

function init() {
  player = new Player();

  platforms = [
    new Platform({
      x:
        plateFormImage.width * 4 +
        300 -
        2 +
        plateFormImage.width -
        plateFormSmallImage.width,
      y: 270,
      image: plateFormSmallImage,
    }),
    new Platform({ x: -1, y: 470, image: plateFormImage }),
    new Platform({
      x: plateFormImage.width - 3,
      y: 470,
      image: plateFormImage,
    }),
    new Platform({
      x: plateFormImage.width * 2 + 100,
      y: 470,
      image: plateFormImage,
    }),
    new Platform({
      x: plateFormImage.width * 3 + 300,
      y: 470,
      image: plateFormImage,
    }),
    new Platform({
      x: plateFormImage.width * 4 + 300 - 2,
      y: 470,
      image: plateFormImage,
    }),
    new Platform({
      x: plateFormImage.width * 5 + 700 - 2,
      y: 470,
      image: plateFormImage,
    }),
  ];

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: backgroundImage,
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: hillsImage,
    }),
  ];

  keys = {
    right: {
      pressed: false,
    },
    left: {
      pressed: false,
    },
  };

  scrollOffset = 0;
}

function animate() {
  requestAnimationFrame(animate);

  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);
  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });
  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  // 플레이어 x좌표 이동 설정
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
    }

    // 승리 조건
    if (scrollOffset > 2000) {
      console.log("game win");
    }

    // 패배 조건
    if (player.position.y + player.width > canvas.height) {
      console.log("game lose");
      init();
    }
  }

  // 플랫폼과 충돌 시
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });
}

addEventListener("keydown", ({ keyCode }) => {
  console.log(keyCode);
  switch (keyCode) {
    case 65:
      console.log("left");
      keys.left.pressed = true;
      break;
    case 83:
      console.log("down");
      break;
    case 68:
      console.log("right");
      keys.right.pressed = true;
      break;
    case 87:
      console.log("up");
      player.velocity.y -= 20;
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      console.log("left");
      keys.left.pressed = false;
      break;
    case 83:
      console.log("down");
      break;
    case 68:
      console.log("right");
      keys.right.pressed = false;
      break;
    case 87:
      console.log("up");
      // player.velocity.y -= 10;
      break;
  }
});

init();
animate();
