# Bar 300

A fully offline local multiplayer pull-up tally game built with Expo, React Native, and TypeScript.

## Features

- Three screens: Home, Game, Results
- Local multiplayer only
- No authentication, backend, database, or cloud sync
- Game state persisted locally with `expo-secure-store`
- Push-your-luck Bank/Gamble scoring
- Early game ending with saved leaderboard results

## Get Started

Install dependencies:

```bash
bun install
```

Start the app:

```bash
bun start
```

Then open the project in Expo Go, an iOS simulator, or an Android emulator from the Expo CLI prompt.

## Project Structure

- `app/`: Expo Router screens and root layout
- `context/`: app-wide game state provider and actions
- `storage/`: SecureStore persistence helpers
- `types/`: shared TypeScript game types
- `utils/`: scoring and random-number helpers
- `constants/`: game constants

## Checks

```bash
bun run lint
bun x tsc --noEmit
```
