import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGame } from '@/context/game-context';

export default function HomeScreen() {
  const {
    hasCompletedSavedGame,
    hasSavedInProgressGame,
    isLoaded,
    resumeGame,
    startGame,
  } = useGame();
  const [name, setName] = useState('');
  const [players, setPlayers] = useState<string[]>([]);

  const addPlayer = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    setPlayers((currentPlayers) => [...currentPlayers, trimmedName]);
    setName('');
  };

  const removePlayer = (indexToRemove: number) => {
    setPlayers((currentPlayers) => currentPlayers.filter((_, index) => index !== indexToRemove));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Local pull-up party</Text>
          <Text style={styles.title}>Bar 300</Text>
          <Text style={styles.subtitle}>Add players, pass the phone, and tally each set fast.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Players</Text>
          <View style={styles.inputRow}>
            <TextInput
              autoCapitalize="words"
              onChangeText={setName}
              onSubmitEditing={addPlayer}
              placeholder="Player name"
              placeholderTextColor="#7c8a9a"
              returnKeyType="done"
              style={styles.input}
              value={name}
            />
            <Pressable
              accessibilityRole="button"
              disabled={!name.trim()}
              onPress={addPlayer}
              style={({ pressed }) => [
                styles.smallButton,
                !name.trim() && styles.disabledButton,
                pressed && name.trim() && styles.pressed,
              ]}>
              <Text style={styles.smallButtonText}>Add</Text>
            </Pressable>
          </View>

          <FlatList
            data={players}
            keyExtractor={(playerName, index) => `${playerName}-${index}`}
            ListEmptyComponent={<Text style={styles.emptyText}>No players yet. Add at least one to start.</Text>}
            renderItem={({ item, index }) => (
              <View style={styles.playerRow}>
                <Text style={styles.playerName}>{item}</Text>
                <Pressable accessibilityRole="button" onPress={() => removePlayer(index)}>
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            )}
            style={styles.playerList}
          />
        </View>

        {hasCompletedSavedGame && (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>A completed saved game exists. Start a new game when you are ready.</Text>
          </View>
        )}

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            disabled={!isLoaded || players.length === 0}
            onPress={() => startGame(players)}
            style={({ pressed }) => [
              styles.primaryButton,
              (!isLoaded || players.length === 0) && styles.disabledButton,
              pressed && players.length > 0 && styles.pressed,
            ]}>
            <Text style={styles.primaryButtonText}>Start New Game</Text>
          </Pressable>

          {hasSavedInProgressGame && (
            <Pressable
              accessibilityRole="button"
              onPress={resumeGame}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <Text style={styles.secondaryButtonText}>Resume Game</Text>
            </Pressable>
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
    gap: 20,
    padding: 20,
  },
  header: {
    gap: 8,
    paddingTop: 12,
  },
  eyebrow: {
    color: '#66e3a6',
    fontSize: 14,
    fontWeight: '800',
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
    fontSize: 17,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#151b23',
    borderColor: '#263241',
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
    padding: 18,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '800',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    backgroundColor: '#0d1117',
    borderColor: '#2f3e50',
    borderRadius: 16,
    borderWidth: 1,
    color: '#f8fafc',
    flex: 1,
    fontSize: 18,
    minHeight: 56,
    paddingHorizontal: 16,
  },
  smallButton: {
    alignItems: 'center',
    backgroundColor: '#66e3a6',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 22,
  },
  smallButtonText: {
    color: '#07130d',
    fontSize: 17,
    fontWeight: '900',
  },
  playerList: {
    maxHeight: 260,
  },
  playerRow: {
    alignItems: 'center',
    backgroundColor: '#0d1117',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    minHeight: 54,
    paddingHorizontal: 14,
  },
  playerName: {
    color: '#f8fafc',
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  removeText: {
    color: '#ff8a8a',
    fontSize: 15,
    fontWeight: '800',
  },
  emptyText: {
    color: '#7c8a9a',
    fontSize: 16,
    lineHeight: 22,
  },
  notice: {
    backgroundColor: '#202a18',
    borderColor: '#476732',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  noticeText: {
    color: '#d4f7bf',
    fontSize: 15,
    lineHeight: 21,
  },
  actions: {
    gap: 12,
    marginTop: 'auto',
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
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#223047',
    borderRadius: 20,
    minHeight: 58,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.72,
  },
});
