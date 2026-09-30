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

export interface Funcionario {
  id: number;
  nome: string;
  ataque: number;
  defesa: number;
  salarioDiario: number;
}