import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TARGET_SCORE } from '@/constants/game';
import { useGame } from '@/context/game-context';
import { sortPlayersByScore } from '@/utils/scoring';

export default function ResultsScreen() {
  const { isLoaded, newGame, state } = useGame();
  const leaderboard = sortPlayersByScore(state.players);
  const endedLabel = state.endReason === 'ended_early' ? 'Ended early' : `Target reached (${TARGET_SCORE})`;

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Results</Text>
          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.subtitle}>{endedLabel}</Text>
          <Text style={styles.total}>Combined total: {state.combinedTotal}</Text>
        </View>

        <FlatList
          contentContainerStyle={styles.listContent}
          data={leaderboard}
          keyExtractor={(player) => player.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No results yet.</Text>}
          renderItem={({ item, index }) => (
            <View style={styles.resultCard}>
              <View style={styles.rankBubble}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={styles.resultDetails}>
                <Text style={styles.playerName}>{item.name}</Text>
                <Text style={styles.setHistory}>Sets: {item.sets.length ? item.sets.join(', ') : 'none'}</Text>
              </View>
              <Text style={styles.playerScore}>{item.score}</Text>
            </View>
          )}
        />

        <Pressable accessibilityRole="button" onPress={newGame} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
          <Text style={styles.primaryButtonText}>New Game</Text>
        </Pressable>
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
    gap: 18,
    padding: 20,
  },
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    gap: 8,
    paddingTop: 12,
  },
  eyebrow: {
    color: '#66e3a6',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 46,
  },
  subtitle: {
    color: '#aab6c5',
    fontSize: 18,
    fontWeight: '800',
  },
  total: {
    color: '#d4f7bf',
    fontSize: 18,
    fontWeight: '900',
  },
  listContent: {
    gap: 12,
    paddingBottom: 12,
  },
  resultCard: {
    alignItems: 'center',
    backgroundColor: '#151b23',
    borderColor: '#263241',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  rankBubble: {
    alignItems: 'center',
    backgroundColor: '#66e3a6',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  rankText: {
    color: '#07130d',
    fontSize: 18,
    fontWeight: '900',
  },
  resultDetails: {
    flex: 1,
    gap: 4,
  },
  playerName: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '900',
  },
  setHistory: {
    color: '#aab6c5',
    fontSize: 15,
    lineHeight: 21,
  },
  playerScore: {
    color: '#f8fafc',
    fontSize: 30,
    fontWeight: '900',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#66e3a6',
    borderRadius: 22,
    minHeight: 64,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#07130d',
    fontSize: 20,
    fontWeight: '900',
  },
  loadingText: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '800',
  },
  emptyText: {
    color: '#7c8a9a',
    fontSize: 17,
  },
  pressed: {
    opacity: 0.72,
  },
});
