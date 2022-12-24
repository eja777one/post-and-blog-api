import { ObjectID } from "bson";

export type APIErrorResult = {
	errorsMessages: Array<FieldError>
};

export type FieldError = {
	message: string | null
	field: string | null
};

export type Paginator<T> = {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: Array<T>
};

export type BlogInputModel = {
	name: string
	description: string
	websiteUrl: string
};

export type BlogPostInputModel = {
	title: string
	shortDescription: string
	content: string
};

export type PostInputModel = {
	title: string
	shortDescription: string
	content: string
	blogId: string
};

export type BlogViewModel = {
	id: string
	name: string
	description: string
	websiteUrl: string
	createdAt: string
};

export type PostViewModel = {
	id: string
	title: string
	shortDescription: string
	content: string
	blogId: string
	blogName: string
	createdAt: string
};

export enum sortDirection {
	'asc' = 'asc',
	'desc' = 'desc'
};

export enum HTTP {
	'OK_200' = 200,
	'CREATED_201' = 201,
	'NO_CONTENT_204' = 204,
	'BAD_REQUEST_400' = 400,
	'UNAUTHORIZED_401' = 401,
	'NOT_FOUND_404' = 404,
};

export type BlogDBModel = {
	_id: ObjectID
	name: string
	description: string
	websiteUrl: string
	createdAt: string
};

export type BlogDBInputModel = {
	name: string
	description: string
	websiteUrl: string
	createdAt: string
};

export type PostDBModel = {
	_id: ObjectID
	title: string
	shortDescription: string
	content: string
	blogId: string
	blogName: string
	createdAt: string
};

export type PostInputModelNoId = {
	title: string
	shortDescription: string
	content: string
};

export type Query = {
	pageNumber: number
	pageSize: number
	sortBy: string
	sortDirection: sortDirection.asc | sortDirection.desc
	searchNameTerm?: string
};