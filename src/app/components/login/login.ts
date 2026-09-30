import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Jogador } from '../../game.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  jogadores: Jogador[] = [];
  carregando = true;
  erro = '';

  constructor(private gameService: GameService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.gameService.getJogadores().subscribe({
      next: (lista) => {
        this.jogadores = lista;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.erro = "Falha ao conectar no backend. O Spring Boot está rodando?";
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }

  criarNovoJogo(nome: string) {
    if (!nome || nome.trim() === '') return;
    this.carregando = true;
    this.cdr.markForCheck();
    
    this.gameService.criarJogador(nome).subscribe(jogador => {
      this.entrarNoJogo(jogador.id);
    });
  }

  deletarJogador(event: Event, id: number, nome: string) {
    event.stopPropagation(); // impede de entrar no jogo ao clicar no ícone
    if (!confirm(`Tem certeza que deseja deletar o perfil "${nome}"? Esta ação não pode ser desfeita.`)) return;

    this.gameService.deletarJogador(id).subscribe({
      next: () => {
        this.jogadores = this.jogadores.filter(j => j.id !== id);
        this.cdr.markForCheck();
      },
      error: (err) => {
        alert(`Erro ao deletar jogador: ${err.message}`);
      }
    });
  }

  entrarNoJogo(id: number) {
    this.router.navigate(['/dashboard', id]);
  }
}
