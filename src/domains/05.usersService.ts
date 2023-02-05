import { UsersQueryRepository } from './../repositories/05.usersQRepo';
import { UsersRepository } from './../repositories/05.usersDBRepo';
import { Query, UserDBModel, UserInputModel } from '../models';
import { ObjectID } from 'bson';
import bcrypt from 'bcrypt';
import add from 'date-fns/add';

export class UsersService {
  constructor(
    protected usersRepository: UsersRepository,
    protected usersQueryRepository: UsersQueryRepository,
  ) { }

  async getUsers(query: Query) {
    const users = await this.usersQueryRepository.getUsers(query);
    return users;
  }

  async createUser(body: UserInputModel, ip: string) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(body.password, passwordSalt);

    const userInput = new UserDBModel(
      new ObjectID,
      {
        login: body.login,
        email: body.email,
        passwordHash,
        passwordSalt,
        createdAt: new Date().toISOString(),
      },
      {
        confirmationCode: 'none',
        expirationDate: add(new Date(), { hours: 0 }),
        isConfirmed: true,
        sentEmails: []
      },
      { ip }
    );

    const newUserId = await this.usersRepository.addUser(userInput);
    const user = await this.usersQueryRepository.getUser(newUserId)
    return user;
  }

  async deleteUser(id: string) {
    const deleted = await this.usersRepository.deleteUser(id);
    return deleted;
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