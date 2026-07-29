import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { LoginDto, RegisterCrmUserDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }
  @Roles('platform_admin', 'tenant_admin')
  @Post('register-crm-user')
  register(
    @Body() dto: RegisterCrmUserDto,
    @Req() request: Request & { user?: { tenantId?: unknown; role?: string } },
  ) {
    return this.service.register(dto, request.user);
  }
  @Get('me') me(@Headers('authorization') authorization?: string) {
    return this.service.me(extractBearer(authorization));
  }
  @Post('refresh') refresh(@Headers('authorization') authorization?: string) {
    return this.service.refresh(extractBearer(authorization));
  }
  @Post('logout') logout(@Headers('authorization') authorization?: string) {
    return this.service.logout(extractBearer(authorization));
  }
}

function extractBearer(authorization?: string) {
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : '';
  if (!token) throw new UnauthorizedException('Missing bearer token');
  return token;
}
