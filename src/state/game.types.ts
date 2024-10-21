export type Player = {
  name: string;
  mass: string;
  height: string;
}

export type Ship = {
  name: string;
  crew: string;
}

export type GameState = {
  isLoading: boolean;
  error: { message: string } | null;
  playerOne: Player | null;
  playerTwo: Player | null;
  shipOne: Ship | null;
  shipTwo: Ship | null;
  history: Array<{
    playerOne: { name: string; score: number; ship: string };
    playerTwo: { name: string; score: number; ship: string };
    winner: string;
  }>;
  gameWinner: string;
};
