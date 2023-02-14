import "reflect-metadata";
import { ObjectID } from 'bson';
import { ObjectId } from 'mongodb'
import { UserModel } from '../../../db';
import { injectable } from 'inversify';
import { Paginator, UserViewModel, Query, UserDBModel }
  from '../../../models';

const prepareUser = (input: UserDBModel): UserViewModel => {
  return {
    id: input._id.toString(),
    login: input.accountData.login,
    email: input.accountData.email,
    createdAt: input.accountData.createdAt
  };
};

@injectable()
export class UsersQueryRepository {

  async getUsers(query: Query): Promise<Paginator<UserViewModel>> {

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
  }

  async getUser(id: string) {
    const user = await UserModel.findOne({ _id: new ObjectID(id) });
    return user ? prepareUser(user) : null;
  }

  async getDBUser(param: string) {
    if (ObjectId.isValid(param)) {
      const user = await UserModel.findOne({ _id: new ObjectID(param) });
      return user ? user : null;
    } else if (param.indexOf('@') !== -1) {
      const user = await UserModel.findOne({ 'accountData.email': param });
      return user ? user : null;
    } else {
      const user = await UserModel.findOne({ 'accountData.login': param });
      return user ? user : null;
    };
  }

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
  }

  async getUserByConfirm(code: string) {
    const user = await UserModel.findOne({
      'emailConfirmation.confirmationCode': code
    });

    return user;
  }

  async getUserForTests(email: string) {
    const user = await UserModel.findOne({ 'accountData.email': email });

    if (!user) return null;

    return {
      _id: user?._id,
      login: user?.accountData.login,
      email: user?.accountData.email,
      createdAt: user?.accountData.createdAt,
      confirmationCode: user?.emailConfirmation.confirmationCode,
      expirationDate: user?.emailConfirmation.expirationDate,
      isConfirmed: user?.emailConfirmation.isConfirmed,
      sentEmailsCount: user?.emailConfirmation.sentEmails.length
    }
  }
};