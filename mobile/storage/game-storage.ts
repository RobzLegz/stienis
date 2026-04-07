import * as SecureStore from 'expo-secure-store';

import { STORAGE_KEY } from '@/constants/game';
import { GameState, Player } from '@/types/game';
import { withCombinedTotal } from '@/utils/scoring';

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isPlayer(value: unknown): value is Player {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Player;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    Array.isArray(candidate.sets) &&
    candidate.sets.every(isNumber) &&
    isNumber(candidate.score)
  );
}

function isGameState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as GameState;
  const validPhase = ['tally', 'decision', 'gambling', 'gambleResolution'].includes(candidate.phase);
  const validEndReason =
    candidate.endReason === null ||
    candidate.endReason === 'target_reached' ||
    candidate.endReason === 'ended_early';
  const validGambleResult =
    candidate.gambleResult === null ||
    candidate.gambleResult === 'win' ||
    candidate.gambleResult === 'lose';

  return (
    Array.isArray(candidate.players) &&
    candidate.players.every(isPlayer) &&
    isNumber(candidate.currentPlayerIndex) &&
    isNumber(candidate.currentCounter) &&
    typeof candidate.isInProgress === 'boolean' &&
    typeof candidate.isComplete === 'boolean' &&
    typeof candidate.endedEarly === 'boolean' &&
    validEndReason &&
    validPhase &&
    (candidate.finishedSetValue === null || isNumber(candidate.finishedSetValue)) &&
    isNumber(candidate.combinedTotal) &&
    (candidate.gambleCountdown === null || isNumber(candidate.gambleCountdown)) &&
    validGambleResult &&
    (candidate.lastTurnMessage === null || typeof candidate.lastTurnMessage === 'string')
  );
}

export async function loadGameState() {
  try {
    const saved = await SecureStore.getItemAsync(STORAGE_KEY);

    if (!saved) {
      return null;
    }

    const parsed = JSON.parse(saved) as unknown;

    if (!isGameState(parsed)) {
      await clearGameState();
      return null;
    }

    return withCombinedTotal(parsed);
  } catch {
    await clearGameState();
    return null;
  }
}

export async function saveGameState(state: GameState) {
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(withCombinedTotal(state)));
}

export async function clearGameState() {
  await SecureStore.deleteItemAsync(STORAGE_KEY);
}
