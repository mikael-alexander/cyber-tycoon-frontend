export interface Jogador {
  id: number;
  nome: string;
  dinheiro: number;
  reputacao: number;
  diaAtual: number;
  missoesHoje: number;
}

export interface Missao {
  id: number;
  descricao: string;
  dificuldade: number;
  recompensaDinheiro: number;
  status: string;
}
