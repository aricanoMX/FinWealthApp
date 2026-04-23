import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { DrizzleHealthIndicator } from './drizzle.health';

@ApiTags('System')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private dbHealth: DrizzleHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check the health status of the application' })
  check() {
    return this.health.check([
      // Basic check to see if the server is responsive
      () => this.http.pingCheck('api-status', 'http://localhost:3000/api/v1'),
      () => this.dbHealth.isHealthy('database'),
    ]);
  }
}
