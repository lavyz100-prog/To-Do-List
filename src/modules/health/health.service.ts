import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  async getHealth() {
    const isDbConnected = this.dataSource.isInitialized;

    return {
      status: isDbConnected ? 'OK' : 'ERROR',
      backend: {
        status: 'up',
        message: 'Backend is running.',
        uptime: process.uptime(),
      },
      database: {
        status: isDbConnected ? 'connected' : 'disconnected',
        canQuery: await this.checkConnection(),
      },
      timestamp: new Date().toISOString(),
    };
  }

  private async checkConnection(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (error) {
      console.error(`Error : ${error}`);
      return false;
    }
  }
}
