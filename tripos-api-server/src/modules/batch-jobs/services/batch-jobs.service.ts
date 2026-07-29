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

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @InjectModel(OperationTask.name)
    private readonly operationTaskModel: Model<OperationTask>,
  ) {}

  onModuleInit() {
    this.registerJob('notification-cleanup', 60 * 60 * 1000, () =>
      this.archiveOldReadNotifications(),
    );
    this.registerJob('operation-overdue-check', 15 * 60 * 1000, () =>
      this.flagOverdueOperations(),
    );
  }

  onModuleDestroy() {
    this.timers.forEach((timer) => clearInterval(timer));
  }

  private registerJob(
    name: string,
    intervalMs: number,
    handler: () => Promise<void>,
  ) {
    void this.runJob(name, handler);
    const timer = setInterval(
      () => void this.runJob(name, handler),
      intervalMs,
    );
    this.timers.push(timer);
  }

  private async runJob(name: string, handler: () => Promise<void>) {
    try {
      await handler();
      this.logger.log(`${name} completed`);
    } catch (error) {
      this.logger.error(
        `${name} failed`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private async archiveOldReadNotifications() {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await this.notificationModel.updateMany(
      { status: 'read', updatedAt: { $lt: cutoff } },
      { $set: { status: 'archived' } },
    );
  }

  private async flagOverdueOperations() {
    await this.operationTaskModel.updateMany(
      {
        dueAt: { $lt: new Date() },
        status: { $nin: ['completed'] },
      },
      { $set: { priority: 'urgent', slaStatus: 'overdue' } },
    );
  }
}
