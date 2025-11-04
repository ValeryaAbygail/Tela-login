// Exemplo simples de classes em JavaScript para a atividade

class Restaurante {
  constructor(nome, endereco) {
    this.nome = nome;
    this.endereco = endereco;
    this.pratos = [];
  }

  adicionarPrato(prato) {
    this.pratos.push(prato);
  }

  listarPratos() {
    return this.pratos;
  }
}

// Copiar e colar no código as perguntas ao Copilot como comentários:
// Copilot, me explique esta classe Restaurante. O que é um 'constructor'?
// Copilot, o que é 'this' neste contexto?

class Prato {
  constructor(nome, preco) {
    this.nome = nome;
    this.preco = preco;
  }

  mostrar() {
    return `${this.nome} - R$${this.preco}`;
  }
}

// Copilot: explicar a classe Prato e o método mostrar

class Artista {
  constructor(nome, genero) {
    this.nome = nome;
    this.genero = genero;
    this.musicas = [];
  }

  adicionarMusica(musica) {
    this.musicas.push(musica);
  }
}

// Copilot: explicar Artista, adicionarMusica e por que usamos arrays para músicas

class Musica {
  constructor(titulo, duracao) {
    this.titulo = titulo;
    this.duracao = duracao; // em segundos
  }

  formatarDuracao() {
    const min = Math.floor(this.duracao / 60);
    const seg = this.duracao % 60;
    return `${min}:${seg.toString().padStart(2,'0')}`;
  }
}

// Copilot: explique o método formatarDuracao e por que é útil

// Dados falsos iniciais (substituir depois por fetch para o MongoDB Data API)
const restauranteExemplo = new Restaurante('Sabor Bom', 'Rua A, 123');
restauranteExemplo.adicionarPrato(new Prato('Prato do Dia', 25.0));

console.log(restauranteExemplo.listarPratos());

module.exports = { Restaurante, Prato, Artista, Musica };
