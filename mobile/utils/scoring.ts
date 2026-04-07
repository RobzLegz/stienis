import { TARGET_SCORE } from '@/constants/game';
import { GameState, Player } from '@/types/game';

export function calculateTotalScore(players: Player[]) {
  return players.reduce((total, player) => total + player.score, 0);
}

export function getNextPlayerIndex(currentPlayerIndex: number, playerCount: number) {
  if (playerCount <= 0) {
    return 0;
  }

  return (currentPlayerIndex + 1) % playerCount;
}

export function hasReachedTarget(players: Player[]) {
  return calculateTotalScore(players) >= TARGET_SCORE;
}

export function withCombinedTotal(state: GameState): GameState {
  return {
    ...state,
    combinedTotal: calculateTotalScore(state.players),
  };
}

export function sortPlayersByScore(players: Player[]) {
  return [...players].sort((a, b) => b.score - a.score);
}
