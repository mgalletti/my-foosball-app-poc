import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { Server } from 'http';
import { typeDefs } from './type-defs.js';
import { RequestHandler } from 'express';
import { expressMiddleware } from '@as-integrations/express4';

// Apollo Server
export const getApolloServer = (httpServer: Server): ApolloServer => {
  return new ApolloServer({
    typeDefs,
    resolvers: {}, // need to define resolvers
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: false, // might want to enable for dev env
    hideSchemaDetailsFromClientErrors: false, // Apollo recommends enabling this option in production to avoid leaking information about your schema.
  });
};

// Get GraphQL middleware
export const getGraphqlMiddleware = (server: ApolloServer): RequestHandler[] => {
  return [
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.authorization }),
    }),
  ];
};
