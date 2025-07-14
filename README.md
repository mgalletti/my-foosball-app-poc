# Foosball App POC

A proof of concept application for tracking foosball games and statistics.

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

## API Endpoints

- `GET /` - Serves the main application
- `GET /api/health` - Check server health

## Technologies Used

- Node.js
- Express.js
- TypeScript
- ES Modules
- MongoDB/DynamoDB (database adapters available)

## Notes

This application uses ES Modules. The `package.json` has `"type": "module"` set, and the TypeScript configuration is set to use `NodeNext` module format.