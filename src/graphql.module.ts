import { Module } from '@nestjs/common';
import { GraphQLModule as GraphQL } from '@nestjs/graphql';
import { ConnectionParams } from 'subscriptions-transport-ws';
import { Response } from 'express';

import { sessionConfig } from './sessionConfig';

@Module({})
export class GraphQLModule {
  static async forRootAsync() {
    return GraphQL.forRootAsync({
      useFactory: async () => ({
        autoSchemaFile: 'schema.gql',
        context: async ({ req, res, connection }) => {
          req = connection ? { session: connection.context } : req;
          return { req, res };
        },
        installSubscriptionHandlers: true,
        subscriptions: {
          path: '/Subscriptions',
          onConnect: async (_: ConnectionParams, webSocket: any) =>
            new Promise(async resolve => {
              const express = sessionConfig();
              express(webSocket.upgradeReq, {} as Response, () => {
                resolve(webSocket.upgradeReq.session);
              });
            }),
        },
      }),
    });
  }
}
