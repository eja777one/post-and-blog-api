import { UserDBModel, UserInputModel } from '../models';
import { usersRepository } from '../repositories/05.usersDBRepo';
import { ObjectID } from 'bson';
import bcrypt from 'bcrypt';
import add from 'date-fns/add';

class UsersService {

  async createUser(body: UserInputModel, ip: string) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(body.password, passwordSalt);

    const user = new UserDBModel(
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

    const newUserId = await usersRepository.addUser(user);
    return newUserId;
  }

  async deleteUser(id: string) {
    const deleted = await usersRepository.deleteUser(id);
    return deleted;
  }

  async deleteAll() {
    const result = await usersRepository.deleteAll();
    return result;
  }

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
};

export const usersService = new UsersService();