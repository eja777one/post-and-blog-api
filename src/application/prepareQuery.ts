import { Query, sortDirection } from '../models';

export const prepareQueries = (query: any) => {
  const queryObj: Query = {
    pageNumber: +query.pageNumber ? +query.pageNumber : 1,
    pageSize: +query.pageSize ? +query.pageSize : 10,
    sortBy: query.sortBy || 'createdAt',
    sortDirection: query.sortDirection || sortDirection.desc
  };

  if (query.searchNameTerm) queryObj.searchNameTerm = query.searchNameTerm;
  if (query.searchLoginTerm) queryObj.searchLoginTerm = query.searchLoginTerm;
  if (query.searchEmailTerm) queryObj.searchEmailTerm = query.searchEmailTerm;

  return queryObj;
};