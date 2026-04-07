export type EndReason = 'target_reached' | 'ended_early' | null;

export type GambleResult = 'win' | 'lose' | null;

export type TurnPhase = 'tally' | 'decision' | 'gambling' | 'gambleResolution';

export type Player = {
  id: string;
  name: string;
  sets: number[];
  score: number;
};

export type GameState = {
  players: Player[];
  currentPlayerIndex: number;
  currentCounter: number;
  isInProgress: boolean;
  isComplete: boolean;
  endedEarly: boolean;
  endReason: EndReason;
  phase: TurnPhase;
  finishedSetValue: number | null;
  combinedTotal: number;
  gambleCountdown: number | null;
  gambleResult: GambleResult;
  lastTurnMessage: string | null;
};
