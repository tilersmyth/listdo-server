import { Module } from '@nestjs/common';
import { GraphQLModule as GraphQL } from '@nestjs/graphql';
import { ConnectionParams } from 'subscriptions-transport-ws';
import { PubSub } from 'graphql-subscriptions';
import { Response } from 'express';

import { sessionConfig } from './sessionConfig';

@Module({})
export class GraphQLModule {
  static async forRootAsync() {
    const pubSub = new PubSub();
    return GraphQL.forRootAsync({
      useFactory: async () => ({
        autoSchemaFile: 'schema.gql',
        context: async ({ req, res, connection }) => {
          req = connection ? { session: connection.context } : req;
          return { req, res, pubSub };
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
