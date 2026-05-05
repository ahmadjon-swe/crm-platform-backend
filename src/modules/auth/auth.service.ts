import { BadRequestException, Injectable, NotFoundException, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { IsNull, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from 'src/shared/constants/jwt.contstant';
import { VerifyAuthDto } from './dto/verify-auth.dto';

@Injectable()
export class AuthService {

  constructor(@InjectRepository(Auth) private authRepo: Repository<Auth>, private jwtService: JwtService) {}

  // ----------- CREATE ADMIN ------------------------
  async create(createAuthDto: CreateAuthDto) {
    const {email, name, username, password} = createAuthDto

    const foundAdmin = await this.authRepo.findOne({
      where: [
        { email },
        { username }
      ]
    });

    if(foundAdmin) throw new BadRequestException("username or email is already exists")

    const hash = await bcrypt.hash(password, 12)

    this.authRepo.create({name, email, username, password})

    return {message: "admin added successfully"}
  }

  // ----------- GENERATE TOKEN (ONL WORKS IN THESE FUNCTIONS) ------------------------
  async generateToken (admin: Auth) {
    const payload = {name: admin.name, role: admin.role, email: admin.email}

    const access_token = this.jwtService.sign(payload, {secret: jwtConstants.access_secret, expiresIn: "30m"})
    const refresh_token = this.jwtService.sign(payload, {secret: jwtConstants.refresh_secret, expiresIn: "15d"})

    return {access_token, refresh_token}
  }

  // ----------- LOGIN ------------------------
  async login(loginAuthDto: LoginAuthDto) {
    const {login, password} = loginAuthDto

    const foundAdmin = await this.authRepo.findOne({
      where: [
        { email: login },
        { username: login }
      ]
    });

    if(!foundAdmin) throw new BadRequestException("admin is not found")

    const check = await bcrypt.compare(password, foundAdmin.password)

    if(!check) throw new BadRequestException("wrong password")

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_time = Date.now()+120000

    foundAdmin.otp = otp
    foundAdmin.otp_time = otp_time

    await this.authRepo.save(foundAdmin)

    return {message: "Please cehk your email"}
  }

  // ----------- VERIFY ------------------------
  async verify(verifyAuthDto: VerifyAuthDto) {
    const {login, otp} = verifyAuthDto

    const foundAdmin = await this.authRepo.findOne({
      where: [
        { email: login },
        { username: login }
      ]
    })

    if(!foundAdmin) throw new NotFoundException("login is not found")
    if(!foundAdmin.otp_time || foundAdmin.otp_time< Date.now()) throw new RequestTimeoutException("otp is expired")
    if(!foundAdmin.otp || foundAdmin.otp!=otp) throw new BadRequestException("Otp is incorrect")
    
    const {access_token, refresh_token} = await this.generateToken(foundAdmin)

    foundAdmin.otp = ""
    foundAdmin.otp_time = 0

    foundAdmin.refresh_token = refresh_token

    await this.authRepo.save(foundAdmin)

    return {messsage: "you are successfully logged in", token: {access_token, refresh_token}}
  }

  // ----------- refresh tokens ------------------------
  async refreshTokens(id: number, refresh_token: string) {
    const foundAdmin = await this.authRepo.findOne({where: {id}})

    if(!foundAdmin) throw new NotFoundException("Admin is not found")

    if(!foundAdmin.refresh_token || foundAdmin.refresh_token != refresh_token) throw new UnauthorizedException("refresh token is incoorect or expired")

    try {
      await this.jwtService.verifyAsync(refresh_token, {secret: jwtConstants.refresh_secret});
    } catch {
      throw new UnauthorizedException();
    }
    
    const tokens =  await this.generateToken(foundAdmin)
    foundAdmin.refresh_token = tokens.refresh_token
    await this.authRepo.save(foundAdmin)

    return tokens
  }


  // ----------- FIND ALL ADMINS (NOT DELETED) ------------------------
  async findAll() {
    return await this.authRepo.find() || []
  }

  // ----------- FIND DELETED ADMINS ------------------------
  async findAllDeleted() {
    return await this.authRepo.find({where: {deletedAt: Not(IsNull())}}) || []
  }

  // ----------- FIND ADMIN ------------------------
  async findOne(id: number) {
    const foundAdmin = await this.authRepo.findOne({where: {id}, withDeleted: true})

    if(!foundAdmin) throw new NotFoundException("Admin is not found")

    return foundAdmin
  }

  // ----------- UPDATE ADMIN ------------------------
  async update(id: number, updateAuthDto: UpdateAuthDto) {
    const foundAdmin = await this.authRepo.findOne({where: {id}, withDeleted: true})

    if(!foundAdmin) throw new NotFoundException("Admin is not found")

    return await this.authRepo.update({id}, {...foundAdmin, ...updateAuthDto})
  }

  // ----------- SOFT DELETE ADMIN ------------------------
  async remove(id: number) {
    const foundAdmin = await this.authRepo.findOne({where: {id}})

    if(!foundAdmin) throw new NotFoundException("Admin is not found")

    await this.authRepo.softDelete({id})

    return {message: "Deleted admin"}
  }

  // ----------- UNDELETE ADMIN ------------------------
  async unremove(id: number) {
    const foundAdmin = await this.authRepo.findOne({where: {id}, withDeleted: true})

    if(!foundAdmin) throw new NotFoundException("Admin is not found")

    foundAdmin.deletedAt = undefined

    this.authRepo.save(foundAdmin)

    return {message: "Restored admin"}
  }
}
