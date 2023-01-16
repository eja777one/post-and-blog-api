import { usersRepository } from '../repositories/05.usersDbRepository';
import { usersQueryRepository } from '../repositories/05.usersQueryRepository';
import { ObjectID } from 'bson';
import { UserInputModel } from "../models";
import bcrypt from 'bcrypt';
import add from 'date-fns/add';

export const usersServices = {
  async createUser(body: UserInputModel, ip: string | undefined) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this
      ._generateHash(body.password, passwordSalt);

    const user = {
      _id: new ObjectID,
      accountData: {
        login: body.login,
        email: body.email,
        passwordHash,
        passwordSalt,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: 'none',
        expirationDate: add(new Date(), { hours: 0 }),
        isConfirmed: true,
        sentEmails: []
      },
      registrationDataType: { ip }
    };

    const newUser = await usersRepository.addUser(user);
    return newUser;
  },

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },

  async deleteUserById(id: string) {
    const result = await usersRepository.deleteUserById(id);
    return result;
  },

  async deleteAll() {
    return await usersRepository.deleteAll();
  }
};