import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../../notifications/schemas/notification.schema';
import { OperationTask } from '../../operations/schemas/operation-task.schema';

@Injectable()
export class BatchJobsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BatchJobsService.name);
  private readonly timers: NodeJS.Timeout[] = [];
  private readonly jobs = new Map<
    string,
    {
      name: string;
      description: string;
      intervalMs: number;
      handler: () => Promise<Record<string, unknown>>;
      lastRunAt?: Date;
      lastStatus: 'pending' | 'running' | 'completed' | 'failed';
      lastResult?: Record<string, unknown>;
      lastError?: string;
    }
  >();

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @InjectModel(OperationTask.name)
    private readonly operationTaskModel: Model<OperationTask>,
  ) {}

  onModuleInit() {
    this.registerJob(
      'notification-cleanup',
      'Archives read notifications older than 30 days.',
      60 * 60 * 1000,
      () => this.archiveOldReadNotifications(),
    );
    this.registerJob(
      'operation-overdue-check',
      'Marks overdue operation tasks as urgent and overdue.',
      15 * 60 * 1000,
      () => this.flagOverdueOperations(),
    );
  }

  onModuleDestroy() {
    this.timers.forEach((timer) => clearInterval(timer));
  }

  private registerJob(
    name: string,
    description: string,
    intervalMs: number,
    handler: () => Promise<Record<string, unknown>>,
  ) {
    this.jobs.set(name, {
      name,
      description,
      intervalMs,
      handler,
      lastStatus: 'pending',
    });
    void this.runJob(name);
    const timer = setInterval(() => void this.runJob(name), intervalMs);
    this.timers.push(timer);
  }

  listJobs() {
    const items = Array.from(this.jobs.values()).map((job) => ({
      name: job.name,
      description: job.description,
      intervalMinutes: Math.round(job.intervalMs / 60000),
      lastRunAt: job.lastRunAt,
      lastStatus: job.lastStatus,
      lastResult: job.lastResult,
      lastError: job.lastError,
      status: job.lastStatus,
    }));
    return { items, total: items.length, page: 1, limit: items.length };
  }

  async runAll() {
    const results = [];
    for (const job of this.jobs.values()) {
      results.push(await this.runJob(job.name));
    }
    return {
      items: results,
      total: results.length,
      page: 1,
      limit: results.length,
    };
  }

  async runOne(name: string) {
    return this.runJob(name);
  }

  private async runJob(name: string) {
    const job = this.jobs.get(name);
    if (!job) {
      return {
        name,
        status: 'failed',
        error: 'Unknown batch job',
      };
    }
    job.lastStatus = 'running';
    try {
      const result = await job.handler();
      job.lastRunAt = new Date();
      job.lastStatus = 'completed';
      job.lastResult = result;
      job.lastError = undefined;
      this.logger.log(`${name} completed`);
      return { name, status: job.lastStatus, result, lastRunAt: job.lastRunAt };
    } catch (error) {
      job.lastRunAt = new Date();
      job.lastStatus = 'failed';
      job.lastError = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `${name} failed`,
        error instanceof Error ? error.stack : String(error),
      );
      return { name, status: job.lastStatus, error: job.lastError };
    }
  }

  private async archiveOldReadNotifications() {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await this.notificationModel.updateMany(
      { status: 'read', updatedAt: { $lt: cutoff } },
      { $set: { status: 'archived' } },
    );
    return { archived: result.modifiedCount };
  }

  private async flagOverdueOperations() {
    const result = await this.operationTaskModel.updateMany(
      {
        dueAt: { $lt: new Date() },
        status: { $nin: ['completed'] },
      },
      { $set: { priority: 'urgent', slaStatus: 'overdue' } },
    );
    return { flagged: result.modifiedCount };
  }
}
