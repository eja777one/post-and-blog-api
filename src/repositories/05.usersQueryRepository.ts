import { UserDBModel } from './../models';
import { Paginator, UserViewModel } from '../models';
import { usersCollection } from './00.db';
import { Query } from '../models';
import { ObjectID } from 'bson';

const prepareUser = (input: UserDBModel) => {
  const obj = {
    id: input._id.toString(),
    login: input.accountData.login,
    email: input.accountData.email,
    createdAt: input.accountData.createdAt
  };
  return obj;
};

export const usersQueryRepository = {
  async getUsersByQuery(query: Query)
    : Promise<Paginator<UserViewModel>> {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const limit = query.pageSize;
    const sortBy = query.sortBy;
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
    const sortObj: any = {};
    sortObj[sortBy] = sortDirection;
    let findObj: any = { $or: [] };

    if (query.searchLoginTerm) {
      findObj.$or.push({ login: new RegExp(query.searchLoginTerm, 'i') });
    };
    if (query.searchEmailTerm) {
      findObj.$or.push({ email: new RegExp(query.searchEmailTerm, 'i') });
    };

    if (findObj.$or.length === 0) findObj = {};

    const items = await usersCollection.find(findObj)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();

    const usersCount = await usersCollection.countDocuments(findObj);

    const pagesCount = Math.ceil(usersCount / limit);

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: usersCount,
      items: items.map((el: any) => prepareUser(el))
    }
  },

  async getUserById(id: any) {
    const user = await usersCollection.findOne({ _id: new ObjectID(id) });
    if (user) return prepareUser(user);
    else return null;
  },

  async getDbUserById(id: any) {
    const user = await usersCollection.findOne({ _id: new ObjectID(id) });
    if (user) return user;
    else return null;
  },

  async getDbUser(email: string) {
    const user = await usersCollection.findOne({ 'accountData.email': email });
    const formatUser = {
      _id: user?._id,
      login: user?.accountData.login,
      email: user?.accountData.email,
      createdAt: user?.accountData.createdAt,
      confirmationCode: user?.emailConfirmation.confirmationCode,
      expirationDate: user?.emailConfirmation.expirationDate,
      isConfirmed: user?.emailConfirmation.isConfirmed,
      sentEmailsCount: user?.emailConfirmation.sentEmails.length
    }
    if (user) return formatUser;
    else return null;
  },

  async getUser(loginOrEmail: string) {
    let user: UserDBModel | null;
    if (loginOrEmail.indexOf('@') !== -1) {
      user = await usersCollection.findOne({ 'accountData.email': loginOrEmail });
    } else {
      user = await usersCollection.findOne({ 'accountData.login': loginOrEmail });
    }
    return user;
  },

  async getUserByConfirm(code: string) {
    const user = await usersCollection.findOne({ 'emailConfirmation.confirmationCode': code });
    return user;
  },
};