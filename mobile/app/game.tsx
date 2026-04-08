import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TARGET_SCORE } from '@/constants/game';
import { useGame } from '@/context/game-context';

export default function GameScreen() {
  const [isOverflowMenuOpen, setIsOverflowMenuOpen] = useState(false);
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
  const {
    bankSet,
    continueAfterGamble,
    decrementCounter,
    endGameEarly,
    finishSet,
    gambleSet,
    incrementCounter,
    isLoaded,
    skipTurn,
    state,
  } = useGame();
  const currentPlayer = state.players[state.currentPlayerIndex];

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading game...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentPlayer || !state.isInProgress || state.isComplete) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>No active game</Text>
          <Pressable accessibilityRole="button" onPress={() => router.replace('/')} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const confirmEndGame = () => {
    setIsOverflowMenuOpen(false);
    Alert.alert('End game early?', 'This will finish the game and show the current leaderboard.', [
      { text: 'Keep Playing', style: 'cancel' },
      { text: 'End Game', style: 'destructive', onPress: endGameEarly },
    ]);
  };

  const handleSkipTurn = () => {
    setIsOverflowMenuOpen(false);
    skipTurn();
  };

  const toggleScoreboard = () => {
    setIsOverflowMenuOpen(false);
    setIsScoreboardOpen((current) => !current);
  };

  const isTallying = state.phase === 'tally';
  const isChoosing = state.phase === 'decision';
  const isGambling = state.phase === 'gambling';
  const isGambleResolved = state.phase === 'gambleResolution';
  const finishedSetValue = state.finishedSetValue ?? state.currentCounter;
  const progress = Math.min((state.combinedTotal / TARGET_SCORE) * 100, 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.playerBlock}>
            <Text style={styles.eyebrow}>Current player</Text>
            <Text numberOfLines={1} style={styles.title}>
              {currentPlayer.name}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.menuAnchor}>
              <Pressable
                accessibilityHint="Opens more actions for the current turn"
                accessibilityLabel="More actions"
                accessibilityRole="button"
                onPress={() => setIsOverflowMenuOpen((current) => !current)}
                style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}>
                <Entypo color="#f8fafc" name="dots-three-vertical" size={18} />
              </Pressable>
              {isOverflowMenuOpen && (
                <View style={styles.overflowMenu}>
                  <Pressable accessibilityRole="button" onPress={handleSkipTurn} style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
                    <Text style={styles.menuItemText}>Skip</Text>
                  </Pressable>
                  <View style={styles.menuDivider} />
                  <Pressable accessibilityRole="button" onPress={confirmEndGame} style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
                    <Text style={[styles.menuItemText, styles.menuItemDanger]}>End</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.scorePanelContainer}>
          <Pressable
            accessibilityHint="Shows all player scores"
            accessibilityLabel="Group score"
            accessibilityRole="button"
            onPress={toggleScoreboard}
            style={({ pressed }) => [styles.scorePanel, pressed && styles.pressed]}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Group</Text>
              <View style={styles.totalValueRow}>
                <Text style={styles.totalValue}>
                  {state.combinedTotal}/{TARGET_SCORE}
                </Text>
                <Entypo color="#aab6c5" name={isScoreboardOpen ? 'chevron-up' : 'chevron-down'} size={18} />
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </Pressable>
          {isScoreboardOpen && (
            <View style={styles.scoreboardDropdown}>
              <View style={styles.scoreboardPanel}>
                {state.players.map((player) => (
                  <View key={player.id} style={styles.scoreboardRow}>
                    <Text numberOfLines={1} style={styles.scoreboardName}>
                      {player.name}
                    </Text>
                    <Text style={styles.scoreboardValue}>{player.score}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
        {state.lastTurnMessage && (
          <Text numberOfLines={1} style={styles.lastTurn}>
            {state.lastTurnMessage}
          </Text>
        )}

        <View style={styles.counterBlock}>
          <Text style={styles.counterLabel}>{isTallying ? 'Set reps' : 'Completed set'}</Text>
          <Text style={styles.counter}>{finishedSetValue}</Text>
        </View>

        <View style={styles.bottomSection}>
          {isChoosing && (
            <View style={styles.prompt}>
              <Text style={styles.promptTitle}></Text>
              <View style={styles.promptRow}>
                <Pressable
                  accessibilityRole="button"
                  onPress={bankSet}
                  style={({ pressed }) => [styles.choiceButton, styles.primaryButton, pressed && styles.pressed]}>
                  <Text style={styles.primaryButtonText}>Bank</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={gambleSet} style={({ pressed }) => [styles.gambleButton, pressed && styles.pressed]}>
                  <Text style={styles.gambleButtonText}>50/50 double</Text>
                </Pressable>
              </View>
            </View>
          )}

          {isGambling && (
            <View style={styles.prompt}>
              <Text style={styles.eyebrow}>Coinflip</Text>
              <Text style={styles.countdown}>{state.gambleCountdown}</Text>
              <Text style={styles.promptSubtext}>Double or nothing...</Text>
            </View>
          )}

          {isGambleResolved && (
            <View style={styles.prompt}>
              <Text style={styles.eyebrow}>Double or nothing</Text>
              <Text style={[styles.resultTitle, state.gambleResult === 'win' ? styles.winText : styles.loseText]}>
                {state.gambleResult === 'win' ? 'Double' : 'Nothing'}
              </Text>
              <Text style={styles.promptSubtext}>
                {state.gambleResult === 'win' ? `${finishedSetValue * 2} reps scored.` : '0 reps scored.'}
              </Text>
              <Pressable accessibilityRole="button" onPress={continueAfterGamble} style={({ pressed }) => [styles.primaryButton, styles.continueButton, pressed && styles.pressed]}>
                <Text style={styles.primaryButtonText}>Continue</Text>
              </Pressable>
            </View>
          )}

          {isTallying && (
            <View style={styles.tallySection}>
              <View style={styles.tallyRow}>
                <Pressable
                  accessibilityRole="button"
                  disabled={state.currentCounter === 0}
                  onPress={decrementCounter}
                  style={({ pressed }) => [
                    styles.tallyButton,
                    styles.minusButton,
                    state.currentCounter === 0 && styles.disabledButton,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={styles.tallyButtonText}>-</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={incrementCounter} style={({ pressed }) => [styles.tallyButton, styles.plusButton, pressed && styles.pressed]}>
                  <Text style={styles.tallyButtonText}>+</Text>
                </Pressable>
              </View>

              <View style={styles.actions}>
                <Pressable
                  accessibilityRole="button"
                  disabled={state.currentCounter === 0}
                  onPress={finishSet}
                  style={({ pressed }) => [
                    styles.finishButton,
                    state.currentCounter === 0 && styles.disabledButton,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={styles.finishButtonText}>Finish Set</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  container: {
    flex: 1,
    gap: 10,
    padding: 16,
  },
  centered: {
    alignItems: 'center',
    flex: 1,
    gap: 20,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  headerActions: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  playerBlock: {
    flex: 1,
  },
  eyebrow: {
    color: '#66e3a6',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    fontSize: 30,
    fontWeight: '900',
  },
  loadingText: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '800',
  },
  scorePanel: {
    backgroundColor: '#101722',
    borderColor: '#334155',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  scorePanelContainer: {
    position: 'relative',
    zIndex: 20,
  },
  scoreboardDropdown: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: '100%',
    zIndex: 30,
  },
  scoreboardPanel: {
    backgroundColor: '#101722',
    borderColor: '#334155',
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  scoreboardRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 30,
  },
  scoreboardName: {
    color: '#aab6c5',
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    paddingRight: 12,
  },
  scoreboardValue: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '900',
  },
  menuAnchor: {
    position: 'relative',
    zIndex: 50,
  },
  menuButton: {
    alignItems: 'center',
    backgroundColor: '#182332',
    borderRadius: 16,
    height: 36,
    justifyContent: 'center',
    marginTop: 2,
    width: 36,
  },
  overflowMenu: {
    backgroundColor: '#182332',
    borderColor: '#273344',
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 132,
    padding: 6,
    position: 'absolute',
    right: 0,
    top: 42,
    zIndex: 60,
  },
  menuItem: {
    borderRadius: 12,
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  menuItemText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
  },
  menuItemDanger: {
    color: '#ff8a8a',
  },
  menuDivider: {
    backgroundColor: '#273344',
    height: 1,
    marginVertical: 4,
  },
  totalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: '#aab6c5',
    fontSize: 16,
    fontWeight: '800',
  },
  totalValueRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  totalValue: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '900',
  },
  progressTrack: {
    backgroundColor: '#273344',
    borderRadius: 999,
    height: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#66e3a6',
    height: '100%',
  },
  lastTurn: {
    color: '#d4f7bf',
    fontSize: 14,
    fontWeight: '800',
    minHeight: 18,
  },
  counterBlock: {
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
    minHeight: 220,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  counterLabel: {
    color: '#66e3a6',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  counter: {
    color: '#f8fafc',
    fontSize: 120,
    fontWeight: '900',
    includeFontPadding: false,
    textAlign: 'center',
  },
  prompt: {
    alignItems: 'center',
    gap: 10,
    minHeight: 88,
  },
  promptTitle: {
    fontSize: 20,
  },
  promptRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  promptSubtext: {
    color: '#aab6c5',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  countdown: {
    color: '#f8fafc',
    fontSize: 56,
    fontWeight: '900',
    lineHeight: 62,
  },
  resultTitle: {
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 50,
  },
  winText: {
    color: '#66e3a6',
  },
  loseText: {
    color: '#ff8a8a',
  },
  tallyRow: {
    flexDirection: 'row',
    gap: 14,
  },
  tallySection: {
    gap: 18,
  },
  tallyButton: {
    alignItems: 'center',
    borderRadius: 28,
    flex: 1,
    justifyContent: 'center',
    minHeight: 90,
  },
  minusButton: {
    backgroundColor: '#382934',
  },
  plusButton: {
    backgroundColor: '#66e3a6',
  },
  tallyButtonText: {
    color: '#07130d',
    fontSize: 64,
    fontWeight: '900',
  },
  actions: {
    gap: 10,
  },
  finishButton: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 22,
    minHeight: 54,
    justifyContent: 'center',
  },
  finishButtonText: {
    color: '#0d1117',
    fontSize: 19,
    fontWeight: '900',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#66e3a6',
    borderRadius: 20,
    minHeight: 58,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#07130d',
    fontSize: 18,
    fontWeight: '900',
  },
  choiceButton: {
    flex: 1,
  },
  gambleButton: {
    alignItems: 'center',
    backgroundColor: '#8b6cff',
    borderRadius: 20,
    flex: 1,
    minHeight: 58,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  gambleButtonText: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '900',
  },
  continueButton: {
    alignSelf: 'stretch',
  },
  disabledButton: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.72,
  },
});
