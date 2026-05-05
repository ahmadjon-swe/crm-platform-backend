import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RolesAdmin } from 'src/shared/enums/roles.enum';
import { VerifyAuthDto } from './dto/verify-auth.dto';

@ApiTags("Admin's")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // --------------  -------------------------
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesAdmin.SUPERADMIN)
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  // --------------  -------------------------
  @Get()
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  // --------------  -------------------------
  @Get()
  verify(@Body() verifyAuthDto: VerifyAuthDto) {
    return this.authService.verify(verifyAuthDto);
  }

  // --------------  -------------------------
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesAdmin.SUPERADMIN)
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  // --------------  -------------------------
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesAdmin.SUPERADMIN)
  @Get()
  findAllDeleted() {
    return this.authService.findAllDeleted();
  }

  // --------------  -------------------------
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesAdmin.SUPERADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  // --------------  -------------------------
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesAdmin.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  // --------------  -------------------------
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesAdmin.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  // --------------  -------------------------
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesAdmin.SUPERADMIN)
  @Patch(':id')
  unremove(@Param('id') id: string) {
    return this.authService.unremove(+id);
  }

  @Get()
  refreshTokens(@Param('id') id: string, @Body('refresh_token') refresh_token: string) {
    return this.authService.refreshTokens(+id, refresh_token);
  }
}
