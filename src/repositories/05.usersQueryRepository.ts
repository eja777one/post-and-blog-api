import { ObjectID } from 'bson';
import { UserModel } from './00.db';
import { Paginator, UserViewModel, Query, UserDBModel }
  from '../models';

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

    const items = await UserModel.find(findObj)
      .sort(sortObj)
      .limit(query.pageSize)
      .skip((query.pageNumber - 1) * query.pageSize)
      .lean();

    const usersCount = await UserModel.countDocuments(findObj);

    const pagesCount = Math.ceil(usersCount / query.pageSize);

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: usersCount,
      items: items.map((el: any) => prepareUser(el))
    }
  },

  async getUserById(id: string) {
    const user = await UserModel
      .findOne({ _id: new ObjectID(id) });

    return user ? user : null;
  },

  async getViewUserById(id: string) {
    const user = await UserModel
      .findOne({ _id: new ObjectID(id) });

    return user ? prepareUser(user) : null;
  },

  async getDbUserById(id: string) {
    const user = await UserModel
      .findOne({ _id: new ObjectID(id) });

    return user ? user : null;
  },

  async getDbUser(email: string) {
    const user = await UserModel.findOne({ 'accountData.email': email });

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
    if (loginOrEmail.indexOf('@') !== -1) {
      const user = await UserModel.
        findOne({ 'accountData.email': loginOrEmail });
      return user ? user : null;
    } else {
      const user = await UserModel
        .findOne({ 'accountData.login': loginOrEmail });
      return user ? user : null;
    };
  },

  async findUser(loginOrEmail: string) {
    if (loginOrEmail.indexOf('@') !== -1) {
      const user = await UserModel.
        findOne({ 'accountData.email': loginOrEmail });
      return user ? 'emailIsExist' : null;
    } else {
      const user = await UserModel
        .findOne({ 'accountData.login': loginOrEmail });
      return user ? 'loginIsExist' : null;
    };
  },

  async getUserByConfirm(code: string) {
    const user = await UserModel.findOne({
      'emailConfirmation.confirmationCode': code
    });

    return user;
  },

  async getUserByRefreshToken(refreshToken: string) {
    const user = await UserModel.findOne({
      'loginData.refreshToken': refreshToken
    });

    return user;
  },
};