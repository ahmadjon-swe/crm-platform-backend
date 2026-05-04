import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { IsNull, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {

  constructor(@InjectRepository(Auth) private authRepo: Repository<Auth>) {}

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

  async findAll() {
    return await this.authRepo.find() || []
  }

  async findAllDeleted() {
    return await this.authRepo.find({where: {deletedAt: Not(IsNull())}}) || []
  }

  async findOne(id: number) {
    const foundAdmin = await this.authRepo.findOne({where: {id}, withDeleted: true})

    if(!foundAdmin) throw new NotFoundException("Admin is not found")

    return foundAdmin
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    const foundAdmin = await this.authRepo.findOne({where: {id}, withDeleted: true})

    if(!foundAdmin) throw new NotFoundException("Admin is not found")
  }

  async remove(id: number) {
    const foundAdmin = await this.authRepo.findOne({where: {id}})

    if(!foundAdmin) throw new NotFoundException("Admin is not found")

    await this.authRepo.softDelete({id})

    return {message: "Deleted admin"}
  }

  async unremove(id: number) {
    const foundAdmin = await this.authRepo.findOne({where: {id}, withDeleted: true})

    if(!foundAdmin) throw new NotFoundException("Admin is not found")

    foundAdmin.deletedAt = undefined

    this.authRepo.save(foundAdmin)

    return {message: "Restored admin"}
  }


}
