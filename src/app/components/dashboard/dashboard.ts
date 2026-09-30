import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Jogador, Missao, Funcionario } from '../../game.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class DashboardComponent implements OnInit {
  jogador!: Jogador;
  missoes: Missao[] = [];
  mercadoHackers: Funcionario[] = [];
  logDoJogo: string = "Bem-vindo ao Cyber Tycoon! Escolha uma missão para hackear.";
  mensagemErro: string = "";
  
  poderDeAtaqueFicticio: number = 30; 

  constructor(private gameService: GameService, private cdr: ChangeDetectorRef, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/']);
      return;
    }
    this.carregarDadosDoJogo(id);
  }

  carregarDadosDoJogo(id: number) {
    this.gameService.getJogador(id).subscribe({
      next: (dados) => {
        if (!dados) {
          this.mensagemErro = "Backend retornou vazio (null). O jogador 1 não existe?";
        } else {
          this.jogador = dados;
        }
        this.cdr.markForCheck(); // 👈 FORÇA a atualização da tela
      },
      error: (err) => {
        this.mensagemErro = `Erro: ${err.status} - ${err.message}`;
        this.cdr.markForCheck();
      }
    });
    this.gameService.getMissoes().subscribe({
      next: (lista) => {
        this.missoes = lista;
        this.cdr.markForCheck();
      },
      error: (err) => console.error("Erro ao carregar missões:", err)
    });
    
    this.carregarMercado();
  }

  carregarMercado() {
    this.gameService.getMercadoFuncionarios().subscribe({
      next: (lista) => {
        this.mercadoHackers = lista;
        this.cdr.markForCheck();
      },
      error: (err) => console.error("Erro ao carregar mercado:", err)
    });
  }

  contratarHacker(hacker: Funcionario) {
    if (this.jogador.dinheiro < hacker.salarioDiario) {
      alert(`Você não tem fundos para cobrir o primeiro dia de salário do(a) ${hacker.nome}!`);
      return;
    }

    this.gameService.contratarFuncionario(hacker.id, this.jogador.id).subscribe({
      next: (resultado) => {
        this.logDoJogo = `>_ CONTRATO ASSINADO: ${resultado}`;
        // Adiciona o poder do hacker ao poder do jogador!
        this.poderDeAtaqueFicticio += hacker.ataque;
        // Recarrega os dados para atualizar o dinheiro e o mercado
        this.carregarDadosDoJogo(this.jogador.id);
      },
      error: (err) => {
        alert("Erro ao contratar: " + err.error);
      }
    });
  }

  passarDia() {
    this.gameService.avancarTurno(this.jogador.id).subscribe(novoStatus => {
      this.jogador = novoStatus;
      this.logDoJogo = `O dia avançou! Custos de infraestrutura foram deduzidos (-R$ 100,00).`;
      this.cdr.markForCheck();
    });
  }

  tentarHackear(missaoId: number) {
    if ((this.jogador.missoesHoje || 0) >= 4) {
      alert("Você não tem mais ações disponíveis para hoje! Avance o turno.");
      return;
    }
    
    this.gameService.executarMissao(missaoId, this.jogador.id, this.poderDeAtaqueFicticio)
      .subscribe(resultadoTexto => {
        this.logDoJogo = resultadoTexto;
        this.gameService.getJogador(this.jogador.id).subscribe(dados => {
          this.jogador = dados;
          this.cdr.markForCheck();
        });
      });
  }

  deletarJogadorAtual() {
    this.gameService.deletarJogador(this.jogador.id).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert("Erro ao deletar perfil: " + err.message);
      }
    });
  }


}
