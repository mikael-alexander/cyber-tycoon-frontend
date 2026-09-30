import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jogador, Missao } from '../game.models';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Busca o status do jogador logado
  getJogador(id: number): Observable<Jogador> {
    return this.http.get<Jogador>(`${this.apiUrl}/jogadores/${id}`);
  }

  // Lista todos os jogadores
  getJogadores(): Observable<Jogador[]> {
    return this.http.get<Jogador[]>(`${this.apiUrl}/jogadores`);
  }

  // Cria um novo jogador
  criarJogador(nome: string): Observable<Jogador> {
    return this.http.post<Jogador>(`${this.apiUrl}/jogadores?nome=${nome}`, {});
  }

  // Deleta um jogador
  deletarJogador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/jogadores/${id}`);
  }

  // Avança o turno (dia do jogo)
  avancarTurno(id: number): Observable<Jogador> {
    return this.http.post<Jogador>(`${this.apiUrl}/jogadores/${id}/avancar-turno`, {});
  }

  // Lista todas as missões cadastradas no PostgreSQL
  getMissoes(): Observable<Missao[]> {
    return this.http.get<Missao[]>(`${this.apiUrl}/missoes`);
  }

  // Executa uma missão enviando o poder de ataque computado
  executarMissao(missaoId: number, jogadorId: number, poderAtaque: number): Observable<string> {
    // Retorna como texto simples puro (String) enviado pelo Spring Boot
    return this.http.post(`${this.apiUrl}/missoes/${missaoId}/executar`, null, {
      params: { jogadorId: jogadorId.toString(), poderAtaque: poderAtaque.toString() },
      responseType: 'text'
    });
  }
}
