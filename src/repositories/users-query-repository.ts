import { usersCollection } from './db';
import { Paginator, Query, UserViewModel } from '../models';
import { ObjectID } from 'bson';
import { usersRepository } from './users-db-repository';

const prepareUser = (input: any) => {
  const obj = {
    id: input._id.toString(),
    login: input.login,
    email: input.email,
    createdAt: input.createdAt
  };
  return obj;
};

export const usersQueryRepository = {
  async getUsersByQuery(query: Query) {
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

    if (findObj.$or.length = 0) findObj = {};

    const items = await usersCollection.find(findObj)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();

    const items2 = await usersCollection.find(findObj).toArray();

    const pagesCount = Math.ceil(items2.length / limit);

    const answer = {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: items2.length,
      items: items.map((el: any) => prepareUser(el))
    }

    return answer;
  },

  async getUserById(id: any) {
    const user = await usersCollection.findOne({ _id: new ObjectID(id) });
    return prepareUser(user);
  },

  async getUserByLogin(login: string) {
    const user = await usersCollection.findOne({ login });
    return user;
  },

  async getUsers() {
    const result = await usersCollection.find({}).toArray();
    return result;
  },
};