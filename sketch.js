function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
let carrinho;
let verduras = [];
let obstaculos = [];
let pontos = 0;
let tempo = 30; // Duração do jogo em segundos
let gameOver = false;
let jogoIniciado = false;

function setup() {
  createCanvas(800, 600);
  carrinho = new Carrinho(); // Criando o carrinho
  frameRate(60);
}

function draw() {
  background(220);

  // Se o jogo não foi iniciado, exibe a tela inicial
  if (!jogoIniciado) {
    showIntroScreen(); // Tela de introdução
  } else {
    // Exibição do jogo
    if (!gameOver) {
      jogo();
    } else {
      // Se o jogo acabou, substituímos a tela de game over pela tela inicial novamente
      showIntroScreen(); // Tela inicial após a perda
    }

    // Atualiza e desenha o carrinho
    carrinho.update();
    carrinho.show();

    // Adicionar verduras e obstáculos apenas se o jogo não estiver no game over
    if (!gameOver) {
      if (frameCount % 60 === 0 && tempo > 0) {
        verduras.push(new Verdura());
        obstaculos.push(new Obstaculo());
      }
    }

    // Atualiza e desenha as verduras
    for (let i = verduras.length - 1; i >= 0; i--) {
      verduras[i].update();
      verduras[i].show();
    
      // Verificar se o carrinho pegou a verdura
      if (verduras[i].isCaught(carrinho)) {
        pontos += 10;
        verduras.splice(i, 1); // Remove a verdura da lista
      }
    }

    // Atualiza e desenha os obstáculos
    for (let i = obstaculos.length - 1; i >= 0; i--) {
      obstaculos[i].update();
      obstaculos[i].show();

      // Verifica se o carrinho bateu no obstáculo
      if (obstaculos[i].isHit(carrinho)) {
        gameOver = true;
      }
    }

    // Exibe o tempo e pontos
    fill(0);
    textSize(20);
    text(`Pontos: ${pontos}`, 100, 30);
    text(`Tempo: ${tempo}s`, width - 100, 30);
  }
}

// Tela inicial (explicação do jogo)
function showIntroScreen() {
  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  
  // Se o jogo está em andamento, exibe a tela de explicação novamente após a perda
  if (gameOver) {
    text("Você Perdeu!", width / 2, height / 3);
    textSize(24);
    text(`Você fez ${pontos} pontos!`, width / 2, height / 2);
    textSize(18);
    text("Pressione 'Enter' para reiniciar", width / 2, height / 2 + 40);
  } else {
    text("Bem-vindo ao jogo 'Conexão Campo e Cidade'", width / 2, height / 3);
    textSize(18);
    text("Você sabia que as verduras são importantes para nosso corpo? E sabia que elas vem do campo? Controle o carrinho com as setas para pegar verduras!", width / 2, height / 2);
    text("Evite os obstáculos e colete o máximo de verduras que puder!", width / 2, height / 2 + 30);
    text("Pressione 'Enter' para começar", width / 2, height / 2 + 60);
  }
}

// Função para começar o jogo ao pressionar Enter
function keyPressed() {
  if (keyCode === ENTER && !jogoIniciado && !gameOver) {
    // Começa o jogo ao pressionar Enter
    jogoIniciado = true;
    tempo = 30;
    pontos = 0;
    gameOver = false;
    verduras = [];
    obstaculos = [];
  }

  // Reiniciar o jogo após o game over, voltando para a tela inicial
  if (keyCode === ENTER && gameOver) {
    // Reseta o jogo e volta para a tela inicial
    jogoIniciado = false;
    gameOver = false;
    pontos = 0;
    tempo = 30;
    verduras = [];
    obstaculos = [];
  }
}

// Jogo principal
function jogo() {
  // Tela principal do jogo
  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);
  text(`Pontos: ${pontos}`, 10, 10);
  text(`Tempo: ${tempo}s`, width - 100, 10);
}

// Tela de game over (substituída pela tela inicial)
function showGameOver() {
  // Não exibe mais a tela de game over separada, já que voltamos à tela inicial
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Você Perdeu!", width / 2, height / 3);
  textSize(24);
  text(`Você fez ${pontos} pontos!`, width / 2, height / 2);
  text("Pressione 'Enter' para reiniciar", width / 2, height / 2 + 40);
}

// Classe para o Carrinho
class Carrinho {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
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
    fill(255, 0, 0);
    rect(this.x, this.y, this.size, 30); // Carrinho simples
  }
}

// Classe para as Verduras
class Verdura {
  constructor() {
    this.x = random(50, width - 50);
    this.y = -30;
    this.size = 30;
    this.speed = 3;
  }

  update() {
    this.y += this.speed; // As verduras descem pela tela
  }

  show() {
    fill(0, 255, 0);
    ellipse(this.x, this.y, this.size, this.size); // Verdura simples
  }

  // Verifica se o carrinho pegou a verdura
  isCaught(carrinho) {
    let d = dist(this.x, this.y, carrinho.x + carrinho.size / 2, carrinho.y + carrinho.size / 2);
    return d < this.size / 2 + carrinho.size / 2;
  }
}

// Classe para Obstáculos
class Obstaculo {
  constructor() {
    this.x = random(50, width - 50);
    this.y = -30;
    this.size = 40;
    this.speed = 4;
  }

  update() {
    this.y += this.speed;
  }

  show() {
    fill(150);
    rect(this.x, this.y, this.size, this.size); // Obstáculo simples
  }

  // Verifica se o carrinho bateu no obstáculo
  isHit(carrinho) {
    let d = dist(this.x + this.size / 2, this.y + this.size / 2, carrinho.x + carrinho.size / 2, carrinho.y + carrinho.size / 2);
    return d < this.size / 2 + carrinho.size / 2;
  }
}
