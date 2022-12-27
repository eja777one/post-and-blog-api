import { usersRepository } from './../repositories/users-db-repository';
import { usersQueryRepository } from '../repositories/users-query-repository';
import { ObjectID } from 'bson';
import { UserInputModel } from "../models";
import bcrypt from 'bcrypt';

export const usersServices = {
  async checkAuth(login: string, password: string) {
    const user = await usersQueryRepository.getUserByLogin(login);
    if (user) {
      const inputPass = await this
        ._generateHash(password, user.passwordSalt);
      const checkPassword = inputPass === user.passwordHash ? true : false;
      return checkPassword;
    } else return false;
  },

  async createUser(body: UserInputModel) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this
      ._generateHash(body.password, passwordSalt);

    const user = {
      _id: new ObjectID,
      login: body.login,
      email: body.email,
      createdAt: new Date().toISOString(),
      passwordHash,
      passwordSalt
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