import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CrmListQueryDto } from '../../../common/dto/crm-list-query.dto';
import { StatusUpdateDto } from '../../../common/dto/status-update.dto';
import {
  organizationScopedBody,
  organizationScopedQuery,
} from '../../../common/utils/organization-scope.util';
import { CreateNotificationDto } from '../dto/notification.dto';
import { NotificationsService } from '../services/notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Post()
  create(@Body() dto: CreateNotificationDto, @Req() request: Request) {
    return this.service.create(organizationScopedBody(dto, request));
  }

  @Get()
  list(@Query() query: CrmListQueryDto, @Req() request: Request) {
    return this.service.list(organizationScopedQuery(query, request));
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.findOne(id, organizationScopedQuery(query, request));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateNotificationDto>,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.update(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: StatusUpdateDto,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.updateStatus(
      id,
      dto,
      organizationScopedQuery(query, request),
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query() query: CrmListQueryDto,
    @Req() request: Request,
  ) {
    return this.service.remove(id, organizationScopedQuery(query, request));
  }
}
