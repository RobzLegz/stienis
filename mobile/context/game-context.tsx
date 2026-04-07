import { router } from 'expo-router';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { GAMBLE_COUNTDOWN_START } from '@/constants/game';
import { clearGameState, loadGameState, saveGameState } from '@/storage/game-storage';
import { GameState, Player } from '@/types/game';
import { randomInteger } from '@/utils/random';
import {
  getNextPlayerIndex,
  hasReachedTarget,
  withCombinedTotal,
} from '@/utils/scoring';

type GameContextValue = {
  state: GameState;
  isLoaded: boolean;
  hasSavedInProgressGame: boolean;
  hasCompletedSavedGame: boolean;
  startGame: (names: string[]) => Promise<void>;
  resumeGame: () => void;
  resetSavedGame: () => Promise<void>;
  incrementCounter: () => void;
  decrementCounter: () => void;
  finishSet: () => void;
  bankSet: () => Promise<void>;
  gambleSet: () => void;
  continueAfterGamble: () => Promise<void>;
  skipTurn: () => Promise<void>;
  endGameEarly: () => Promise<void>;
  newGame: () => Promise<void>;
};

const cleanState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  currentCounter: 0,
  isInProgress: false,
  isComplete: false,
  endedEarly: false,
  endReason: null,
  phase: 'tally',
  finishedSetValue: null,
  combinedTotal: 0,
  gambleCountdown: null,
  gambleResult: null,
  lastTurnMessage: null,
};

const GameContext = createContext<GameContextValue | null>(null);

function createPlayer(name: string, index: number): Player {
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
    name,
    sets: [],
    score: 0,
  };
}

function getActivePlayer(state: GameState) {
  return state.players[state.currentPlayerIndex];
}

function completeIfTargetReached(state: GameState): GameState {
  const nextState = withCombinedTotal(state);

  if (!hasReachedTarget(nextState.players)) {
    return nextState;
  }

  return {
    ...nextState,
    isInProgress: false,
    isComplete: true,
    endedEarly: false,
    endReason: 'target_reached',
    phase: 'tally',
    currentCounter: 0,
    finishedSetValue: null,
    gambleCountdown: null,
  };
}

function resetTurnState(state: GameState, message: string | null = null): GameState {
  const nextPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, state.players.length);

  return {
    ...state,
    currentPlayerIndex: nextPlayerIndex,
    currentCounter: 0,
    phase: 'tally',
    finishedSetValue: null,
    gambleCountdown: null,
    gambleResult: null,
    lastTurnMessage: message,
  };
}

function applyTurnScore(state: GameState, multiplier: 0 | 1 | 2, gambleResult: 'win' | 'lose' | null) {
  const activePlayer = getActivePlayer(state);

  if (!activePlayer || state.finishedSetValue === null) {
    return state;
  }

  const turnValue = state.finishedSetValue;
  const awardedScore = multiplier === 0 ? 0 : turnValue * multiplier;
  const players = state.players.map((player, index) => {
    if (index !== state.currentPlayerIndex) {
      return player;
    }

    return {
      ...player,
      sets: [...player.sets, state.finishedSetValue ?? 0],
      score: player.score + awardedScore,
    };
  });

  const resultLabel =
    gambleResult === 'win'
      ? `Gamble won: ${activePlayer.name} scored ${awardedScore}.`
      : gambleResult === 'lose'
        ? `Gamble lost: ${activePlayer.name} scored 0.`
        : `${activePlayer.name} banked ${awardedScore}.`;

  return completeIfTargetReached(resetTurnState(withCombinedTotal({ ...state, players }), resultLabel));
}

function scoreGambleWithoutAdvancing(state: GameState, multiplier: 0 | 2, gambleResult: 'win' | 'lose') {
  if (state.finishedSetValue === null) {
    return state;
  }

  const awardedScore = multiplier === 0 ? 0 : state.finishedSetValue * multiplier;
  const players = state.players.map((player, index) => {
    if (index !== state.currentPlayerIndex) {
      return player;
    }

    return {
      ...player,
      sets: [...player.sets, state.finishedSetValue ?? 0],
      score: player.score + awardedScore,
    };
  });

  return withCombinedTotal({
    ...state,
    players,
    phase: 'gambleResolution',
    gambleCountdown: null,
    gambleResult,
    lastTurnMessage: null,
  });
}

function getGambleResultMessage(state: GameState) {
  const activePlayer = getActivePlayer(state);

  if (!activePlayer || state.finishedSetValue === null || state.gambleResult === null) {
    return null;
  }

  return state.gambleResult === 'win'
    ? `Gamble won: ${activePlayer.name} scored ${state.finishedSetValue * 2}.`
    : `Gamble lost: ${activePlayer.name} scored 0.`;
}

export function GameProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState(cleanState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function restore() {
      const savedState = await loadGameState();

      if (!mounted) {
        return;
      }

      setState(savedState ?? cleanState);
      setIsLoaded(true);
    }

    restore();

    return () => {
      mounted = false;
    };
  }, []);

  const persistAndSet = useCallback(async (nextState: GameState) => {
    const stateWithTotal = withCombinedTotal(nextState);
    setState(stateWithTotal);
    await saveGameState(stateWithTotal);
  }, []);

  const updateAndPersist = useCallback((producer: (currentState: GameState) => GameState) => {
    setState((currentState) => {
      const nextState = withCombinedTotal(producer(currentState));
      void saveGameState(nextState);

      return nextState;
    });
  }, []);

  useEffect(() => {
    if (!isLoaded || state.phase !== 'gambling' || state.gambleCountdown === null) {
      return;
    }

    const gambleCountdown = state.gambleCountdown;

    if (gambleCountdown > 0) {
      const timeout = setTimeout(() => {
        persistAndSet({
          ...state,
          gambleCountdown: Math.max(gambleCountdown - 1, 0),
        });
      }, 1000);

      return () => clearTimeout(timeout);
    }

    const result = randomInteger(0, 1) === 1 ? 'win' : 'lose';
    const nextState = scoreGambleWithoutAdvancing({ ...state, gambleResult: result }, result === 'win' ? 2 : 0, result);

    void persistAndSet(nextState);
  }, [isLoaded, persistAndSet, state]);

  const startGame = useCallback(
    async (names: string[]) => {
      const players = names.map(createPlayer);
      const nextState = withCombinedTotal({
        ...cleanState,
        players,
        isInProgress: true,
      });

      await persistAndSet(nextState);
      router.replace('/game');
    },
    [persistAndSet],
  );

  const resumeGame = useCallback(() => {
    router.replace('/game');
  }, []);

  const resetSavedGame = useCallback(async () => {
    await clearGameState();
    setState(cleanState);
  }, []);

  const incrementCounter = useCallback(() => {
    updateAndPersist((currentState) => {
      if (currentState.phase !== 'tally' || currentState.isComplete) {
        return currentState;
      }

      return { ...currentState, currentCounter: currentState.currentCounter + 1 };
    });
  }, [updateAndPersist]);

  const decrementCounter = useCallback(() => {
    updateAndPersist((currentState) => {
      if (currentState.phase !== 'tally' || currentState.isComplete) {
        return currentState;
      }

      return { ...currentState, currentCounter: Math.max(currentState.currentCounter - 1, 0) };
    });
  }, [updateAndPersist]);

  const finishSet = useCallback(() => {
    if (state.phase !== 'tally' || state.currentCounter <= 0 || state.isComplete) {
      return;
    }

    persistAndSet({
      ...state,
      phase: 'decision',
      finishedSetValue: state.currentCounter,
    });
  }, [persistAndSet, state]);

  const bankSet = useCallback(async () => {
    if (state.phase !== 'decision') {
      return;
    }

    const nextState = applyTurnScore(state, 1, null);
    await persistAndSet(nextState);

    if (nextState.isComplete) {
      router.replace('/results');
    }
  }, [persistAndSet, state]);

  const gambleSet = useCallback(() => {
    if (state.phase !== 'decision') {
      return;
    }

    persistAndSet({
      ...state,
      phase: 'gambling',
      gambleCountdown: GAMBLE_COUNTDOWN_START,
      gambleResult: null,
    });
  }, [persistAndSet, state]);

  const continueAfterGamble = useCallback(async () => {
    if (state.phase !== 'gambleResolution') {
      return;
    }

    const nextState = completeIfTargetReached(resetTurnState(state, getGambleResultMessage(state)));
    await persistAndSet(nextState);

    if (nextState.isComplete) {
      router.replace('/results');
    }
  }, [persistAndSet, state]);

  const skipTurn = useCallback(async () => {
    if (state.phase !== 'tally' || state.isComplete) {
      return;
    }

    const activePlayer = getActivePlayer(state);
    await persistAndSet(resetTurnState(state, activePlayer ? `${activePlayer.name} skipped.` : null));
  }, [persistAndSet, state]);

  const endGameEarly = useCallback(async () => {
    if (state.phase === 'gambling' || state.phase === 'gambleResolution') {
      return;
    }

    const nextState = withCombinedTotal({
      ...state,
      isInProgress: false,
      isComplete: true,
      endedEarly: true,
      endReason: 'ended_early',
      phase: 'tally',
      currentCounter: 0,
      gambleCountdown: null,
    });

    await persistAndSet(nextState);
    router.replace('/results');
  }, [persistAndSet, state]);

  const newGame = useCallback(async () => {
    await clearGameState();
    setState(cleanState);
    router.replace('/');
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      isLoaded,
      hasSavedInProgressGame: isLoaded && state.isInProgress && !state.isComplete && state.players.length > 0,
      hasCompletedSavedGame: isLoaded && state.isComplete && state.players.length > 0,
      startGame,
      resumeGame,
      resetSavedGame,
      incrementCounter,
      decrementCounter,
      finishSet,
      bankSet,
      gambleSet,
      continueAfterGamble,
      skipTurn,
      endGameEarly,
      newGame,
    }),
    [
      bankSet,
      continueAfterGamble,
      decrementCounter,
      endGameEarly,
      finishSet,
      gambleSet,
      incrementCounter,
      isLoaded,
      newGame,
      resetSavedGame,
      resumeGame,
      skipTurn,
      startGame,
      state,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }

  return context;
}
