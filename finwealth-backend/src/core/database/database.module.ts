import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from 'finwealth-infra/src/schema'; // Path as installed via npm link

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const connectionString = configService.get<string>('SUPABASE_URL');
        if (!connectionString) {
            throw new Error('Database connection string is required');
        }
        
        const client = postgres(connectionString, { prepare: false });
        return drizzle(client, { schema });
      },
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
