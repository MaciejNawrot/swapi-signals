import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameStore } from '../state/game.store';
import { downloadJSON } from '../utilities/downloadJSON';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [GameStore],
})
export class AppComponent {
  public gameStore = inject(GameStore);

  public isLoading = this.gameStore.isLoading;
  public error = this.gameStore.error;
  public playerOne = this.gameStore.playerOne;
  public playerTwo = this.gameStore.playerTwo;
  public shipOne = this.gameStore.shipOne;
  public shipTwo = this.gameStore.shipTwo;
  public winner = this.gameStore.gameWinner;

  public fetchPlayers() {
    this.gameStore.setPlayers();
  }

  public fetchShips() {
    this.gameStore.setShips();
  }

  public setWinner() {
    this.gameStore.setWinner();
  }

  public downloadHistory() {
    downloadJSON(this.gameStore.history(), 'game_history');
  }
}
