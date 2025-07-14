import express from 'express';
import path from 'path';
import { challengeRouter } from './routes/challenge-routes.js';
import cors from 'cors';
import http from 'http';
import * as pinoHttp from 'pino-http';
import { logger } from './utils/logger.js';
import { __dirname } from './utils/path.js';
// import { getApolloServer } from './graphql/index.js';
// import { getGraphqlMiddleware } from './graphql/index.js';
async function startServer() {
    const app = express();
    const port = process.env.PORT || 3000;
    // Our httpServer handles incoming requests to our Express app.
    // enabling our servers to shut down gracefully.
    const httpServer = http.createServer(app);
    /* Set up Graphql
    
    // Apollo Server
    const server = getApolloServer(httpServer)
    await server.start();
    // Apply GraphQL middleware
    app.use('/graphql', getGraphqlMiddleware(server));
  
    */
    // Middleware
    app.use(pinoHttp.pinoHttp({ logger }));
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '../public')));
    // Routes
    app.use('/', challengeRouter);
    app.get('/', (_req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
    app.get('/api/health', (_req, res) => {
        res.json({ status: 'ok', message: 'Server is running' });
    });
    // Server startup
    await new Promise((resolve) => httpServer.listen({ port: port }, resolve));
    logger.info(`Server running at http://localhost:${port}`);
}
startServer();
