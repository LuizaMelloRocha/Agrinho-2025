function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
let carrinho;
let verduras = [];
let obstaculos = [];
let nuvens = [];
let pontos = 0;
let tempo = 30;
let gameOver = false;
let jogoIniciado = false;

function setup() {
  createCanvas(800, 600);
  carrinho = new Carrinho();
  frameRate(60);

  // Cria nuvens iniciais
  for (let i = 0; i < 5; i++) {
    nuvens.push(new Nuvem(random(width), random(50, 150)));
  }
}

function draw() {
  if (!jogoIniciado) {
    showIntroScreen();
  } else {
    drawSky();
    drawField();

    if (!gameOver) {
      jogo();

      if (frameCount % 60 === 0 && tempo > 0) {
        tempo--;
        if (tempo === 0) {
          gameOver = true;
        }
      }

      carrinho.update();
      carrinho.show();

      if (frameCount % 60 === 0) {
        verduras.push(new Verdura());

        // Aumenta o número de pragas com base nos pontos
        let pragasPorFrame = 1 + floor(pontos / 20);
        for (let i = 0; i < pragasPorFrame; i++) {
          obstaculos.push(new Obstaculo());
        }
      }

      for (let i = verduras.length - 1; i >= 0; i--) {
        verduras[i].update();
        verduras[i].show();

        if (verduras[i].isCaught(carrinho)) {
          pontos += 10;
          verduras.splice(i, 1);
        } else if (verduras[i].y > height) {
          verduras.splice(i, 1);
        }
      }

      for (let i = obstaculos.length - 1; i >= 0; i--) {
        obstaculos[i].update();
        obstaculos[i].show();

        if (obstaculos[i].isHit(carrinho)) {
          gameOver = true;
        } else if (obstaculos[i].y > height) {
          obstaculos.splice(i, 1);
        }
      }

      fill(0);
      textSize(20);
      textAlign(LEFT, TOP);
      text(`Pontos: ${pontos}`, 10, 10);
      textAlign(RIGHT, TOP);
      text(`Tempo: ${tempo}s`, width - 10, 10);

    } else {
      showIntroScreen();
    }
  }
}

function drawSky() {
  background(135, 206, 235); // Céu azul

  // Sol
  noStroke();
  fill(255, 223, 0);
  ellipse(width - 80, 80, 100, 100);

  // Nuvens
  for (let nuvem of nuvens) {
    nuvem.update();
    nuvem.show();
  }
}

function drawField() {
  fill(4, 139, 34);
  noStroke();
  rect(0, height / 2, width, height / 2);

  for (let i = 0; i < width; i += 40) {
    fill(0, 100, 0);
    rect(i, height / 2, 20, height / 2);
  }
}

function showIntroScreen() {
  background(144, 238, 144);
  fill("green");
  textSize(24);
  textAlign(CENTER, CENTER);

  if (gameOver) {
    text("Você Perdeu!", width / 2, height / 3);
    textSize(24);
    text(`Você fez ${pontos} pontos!`, width / 2, height / 2);
    textSize(18);
    text("Pressione 'Enter' para reiniciar", width / 2, height / 2 + 40);
  } else {
    text("Bem-vindo ao jogo 'Conexão Campo e Cidade'", width / 2, height / 3);
    textSize(12);
    text("As verduras são importantes para o nosso corpo. Sabia que elas vêm do campo?", width / 2, height / 2);
    text("Controle o agricultor com as setas para pegar verduras!", width / 2, height / 2 + 20);
    text("Evite os obstáculos que são as pragas, elas podem estragar o alimento,e colete o máximo de verduras que puder!", width / 2, height / 2 + 40);
    text("Pressione 'Enter' para começar", width / 2, height / 2 + 70);
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    pontos = 0;
    tempo = 30;
    verduras = [];
    obstaculos = [];
    gameOver = false;
    jogoIniciado = true;
  }
}

function jogo() {
  // Lógica já está no draw()
}

// ==== CLASSES ====

class Carrinho {
  constructor() {
    this.x = width / 2;
    this.y = height - 60;
    this.size = 50;
    this.speed = 5;
  }

  update() {
    if (keyIsDown(LEFT_ARROW) && this.x > 0) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW) && this.x < width - this.size) {
      this.x += this.speed;
    }
  }

  show() {
    textSize(40);
    textAlign(CENTER, CENTER);
    text("👨🏿‍🌾", this.x + this.size / 2, this.y + 15);
  }
}

class Verdura {
  constructor() {
    this.x = random(50, width - 50);
    this.y = -30;
    this.size = 30;
    this.baseSpeed = 3;
    this.emojis = ["🥦", "🥕", "🥒", "🥔"];
    this.emoji = random(this.emojis);
  }

  update() {
    let velocidade = this.baseSpeed + (pontos / 10) * 0.5;
    this.y += velocidade;
  }

  show() {
    textSize(30);
    textAlign(CENTER, CENTER);
    text(this.emoji, this.x, this.y);
  }

  isCaught(carrinho) {
    let d = dist(this.x, this.y, carrinho.x + carrinho.size / 2, carrinho.y + carrinho.size / 2);
    return d < this.size;
  }
}

class Obstaculo {
  constructor() {
    this.x = random(50, width - 50);
    this.y = -30;
    this.size = 40;
    this.baseSpeed = 4;
  }

  update() {
    let velocidade = this.baseSpeed + (pontos / 10) * 0.5;
    this.y += velocidade;
  }

  show() {
    textSize(30);
    textAlign(CENTER, CENTER);
    text("🐛", this.x, this.y);
  }

  isHit(carrinho) {
    let d = dist(this.x + this.size / 2, this.y + this.size / 2, carrinho.x + carrinho.size / 2, carrinho.y + carrinho.size / 2);
    return d < this.size / 2 + carrinho.size / 2;
  }
}

class Nuvem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(60, 100);
    this.speed = random(0.2, 0.5);
  }

  update() {
    this.x += this.speed;
    if (this.x > width + this.size) {
      this.x = -this.size;
      this.y = random(50, 150);
    }
  }

  show() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size * 0.6);
    ellipse(this.x + 30, this.y + 10, this.size * 0.8, this.size * 0.5);
    ellipse(this.x - 30, this.y + 10, this.size * 0.8, this.size * 0.5);
  }
}
