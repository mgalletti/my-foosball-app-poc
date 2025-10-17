# Foosball App POC

A proof of concept application for organizing and managing foosball challenges between players at various locations.

## What This App Does

The Foosball App enables players to:
- Create and join foosball challenges at different venues
- Track player statistics and skill levels
- Manage venue locations with coordinates and status
- Organize games by time slots (morning, afternoon, evening, night)

## Business Logic

### Core Entities
- **Players**: Users with skill levels (beginner, intermediate, expert) and point tracking
- **Places**: Venues with geographic coordinates and verification status
- **Challenges**: Game sessions with owners, participants, scheduling, and status tracking

### Challenge Workflow
1. **Creation**: A player creates a challenge at a specific place and time
2. **Open**: Other players can join the challenge
3. **Active**: Challenge is in progress with confirmed participants
4. **Completed**: Game finished with results recorded
5. **Terminated**: Challenge cancelled or abandoned

### Key Features
- Location-based challenge discovery using coordinates
- Skill-based matchmaking through player expertise levels
- Time slot organization for better scheduling
- Player statistics and point system for competitive tracking

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Setup and Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-foosball-app-poc
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
Run the application with hot-reloading for development:
```bash
npm run dev
```

### Production Mode
Build and run the application for production:
```bash
npm run build
npm start
```

## Build Process

Build the TypeScript code to JavaScript:
```bash
npm run build
```

This compiles the TypeScript files from the `src` directory to JavaScript in the `dist` directory.

## Cleaning the Build

Remove the generated files:
```bash
npm run clean
```

## Testing

Run the tests:
```bash
npm test
```

The test suite includes comprehensive tests for the InMemoryAdapter class, verifying all CRUD operations and query functionality.

## Code Quality

### Linting
Check for code issues:
```bash
npm run lint
```

Fix auto-fixable linting errors:
```bash
npm run lint:fix
```

### Formatting
Format code with Prettier:
```bash
npm run format
```

Check if code is properly formatted:
```bash
npm run format:check
```

## Project Structure

- `/src` - Server-side code
- `/public` - Static assets and client-side code
- `/src/models` - Data models
- `/src/repository` - Data access layer
- `/dist` - Compiled JavaScript (generated after build)
- `/test` - Test files (not included in production build)

## API Documentation

Interactive API documentation is available at `/api-docs` when the server is running.

### Main Endpoints
- `GET /api/health` - Check server health
- `GET /challenges` - List all challenges
- `POST /challenges` - Create new challenge
- `GET /places` - List all places
- `POST /places` - Add new place
- `GET /players` - List all players
- `POST /players` - Register new player

## Technologies Used

- Node.js
- Express.js
- TypeScript
- ES Modules
- MongoDB/DynamoDB (database adapters available)

## Notes

This application uses ES Modules. The `package.json` has `"type": "module"` set, and the TypeScript configuration is set to use `NodeNext` module format.