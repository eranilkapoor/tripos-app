import { Body, Controller, Get, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterCrmUserDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @Post('login') login(@Body() dto: LoginDto) { return this.service.login(dto); }
  @Post('register-crm-user') register(@Body() dto: RegisterCrmUserDto) { return this.service.register(dto); }
  @Get('me') me(@Headers('authorization') authorization?: string) { return this.service.me(extractBearer(authorization)); }
  @Post('logout') logout(@Headers('authorization') authorization?: string) { return this.service.logout(extractBearer(authorization)); }
}

function extractBearer(authorization?: string) {
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!token) throw new UnauthorizedException('Missing bearer token');
  return token;
}
