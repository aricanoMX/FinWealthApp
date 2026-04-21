import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { TransactionsRepository } from '../src/transactions/transactions.repository';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { GlobalExceptionFilter } from '../src/core/filters/global-exception.filter';

import { APP_GUARD } from '@nestjs/core';

import { ExecutionContext } from '@nestjs/common';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication<App>;
  const mockTransactionsRepository = {
    createWithEntries: jest.fn().mockResolvedValue('mocked-tx-uuid'),
  };

  beforeAll(async () => {
    // Forcefully mock the guard prototype to bypass global registration issues
    jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockImplementation((context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();
      req.user = { userId: '123e4567-e89b-12d3-a456-426614174000', email: 'test@example.com' };
      return true;
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TransactionsRepository)
      .useValue(mockTransactionsRepository)
      .compile();

    app = moduleFixture.createNestApplication();

    // 1. Global API Configuration
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    // 2. Global Validation Pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // 3. Global Exception Filter
    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/transactions', () => {
    it('should successfully create a balanced transaction', async () => {
      const payload = {
        ledgerId: '123e4567-e89b-12d3-a456-426614174001',
        date: '2023-10-01T10:00:00Z',
        description: 'Test balanced transaction',
        entries: [
          { accountId: '123e4567-e89b-12d3-a456-426614174002', amount: '100.50' },
          { accountId: '123e4567-e89b-12d3-a456-426614174003', amount: '-100.50' },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/transactions')
        .send(payload)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        data: { id: 'mocked-tx-uuid' },
      });
      expect(mockTransactionsRepository.createWithEntries).toHaveBeenCalledTimes(1);
      expect(mockTransactionsRepository.createWithEntries).toHaveBeenCalledWith(payload);
    });

    it('should reject an unbalanced transaction with 400 Bad Request', async () => {
      const payload = {
        ledgerId: '123e4567-e89b-12d3-a456-426614174001',
        date: '2023-10-01T10:00:00Z',
        description: 'Test unbalanced transaction',
        entries: [
          { accountId: '123e4567-e89b-12d3-a456-426614174002', amount: '100.50' },
          { accountId: '123e4567-e89b-12d3-a456-426614174003', amount: '-50.00' }, // Unbalanced!
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/transactions')
        .send(payload)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        code: 'ERR_DOUBLE_ENTRY_VIOLATION',
        message: expect.stringContaining('The sum of debits and credits is not zero'),
      });
      expect(mockTransactionsRepository.createWithEntries).not.toHaveBeenCalled();
    });

    it('should reject a transaction with invalid DTO data', async () => {
      const payload = {
        ledgerId: 'invalid-uuid', // Should fail IsUUID
        date: '2023-10-01T10:00:00Z',
        description: 'Test invalid dto',
        entries: [], // Should fail ArrayMinSize
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/transactions')
        .send(payload)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(typeof response.body.message).toBe('string');
      expect(mockTransactionsRepository.createWithEntries).not.toHaveBeenCalled();
    });
  });
});
