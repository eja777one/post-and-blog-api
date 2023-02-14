import { UserModel } from './../../../db';
import { inject, injectable } from 'inversify';
import { UsersQueryRepository } from '../infrastructure/usersQRepo';
import { UsersRepository } from '../infrastructure/usersDBRepo';
import { Query, UserInputModel, BLLResponse, Paginator, UserViewModel }
  from '../../../models';
import bcrypt from 'bcrypt';

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) protected usersRepository: UsersRepository,
    @inject(UsersQueryRepository) protected usersQueryRepository:
      UsersQueryRepository,
  ) { }

  async getUsers(query: Query) {
    const users = await this.usersQueryRepository.getUsers(query);
    return new BLLResponse<Paginator<UserViewModel>>(200, users);
  }

  async createUser(body: UserInputModel, ip: string) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(body.password, passwordSalt);

    const userInput = UserModel.makeUserByAdmin(body.login, body.email,
      passwordHash, passwordSalt, ip);

    const newUserId = await this.usersRepository.save(userInput);
    const user = await this.usersQueryRepository.getUser(newUserId);

    if (!user) return new BLLResponse<undefined>(404);
    else return new BLLResponse<UserViewModel>(201, user);
  }

  async deleteUser(id: string) {
    const deleted = await this.usersRepository.deleteUser(id);
    if (!deleted) return new BLLResponse<undefined>(404);
    else return new BLLResponse<undefined>(204);
  }

  async deleteAll() {
    const result = await this.usersRepository.deleteAll();
    return result;
  }

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
};