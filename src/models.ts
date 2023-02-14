import { ObjectId } from 'mongodb';
import { ObjectID } from "bson";

// export type APIErrorResult = {
// 	errorsMessages: Array<FieldError>
// };

export class APIErrorResult {
	constructor(
		public errorsMessages: Array<FieldError>
	) { }
};

export class FieldError {

	public message: string | null
	public field: string | null

	constructor(field: string) {
		this.message = `incorrect ${field}`
		this.field = field
	}
};

export class BLLResponse<T> {
	constructor(
		public statusCode: HTTP,
		public data?: T | undefined,
		public message?: string | undefined,
		public error?: APIErrorResult | undefined,
	) { }
};

export type Paginator<T> = {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: Array<T>
};

export type LikeInputModel = {
	likeStatus: LikeStatus
};

export type PostInputModelNoId = {
	title: string
	shortDescription: string
	content: string
};

export class PostInputModel {
	constructor(
		public title: string,
		public shortDescription: string,
		public content: string,
		public blogId: string
	) { }
};

export type PostViewModel = {
	id: string
	title: string
	shortDescription: string
	content: string
	blogId: string
	blogName: string
	createdAt: string
	extendedLikesInfo: ExtendedLikesInfoViewModel
};

export class PostDBModel {
	constructor(
		public _id: ObjectID,
		public title: string,
		public shortDescription: string,
		public content: string,
		public blogId: string,
		public blogName: string,
		public createdAt: string,
		public likesCount: number,
		public dislikesCount: number,
		public usersLikeStatus: LikeDetailsDBModel[]
	) { }
};

export type LikeStatus = 'None' | 'Like' | 'Dislike'

export type ExtendedLikesInfoViewModel = {
	likesCount: number,
	dislikesCount: number,
	myStatus: LikeStatus,
	newestLikes: LikeDetailsViewModel[]
};

export type LikeDetailsViewModel = {
	addedAt: string,
	userId: string,
	login: string
};

export type LikeDetailsViewModelArr = LikeDetailsViewModel[]

export type LikeDetailsDBModel = {
	addedAt: string,
	userId: string,
	login: string,
	status: LikeStatus
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
	'FORBIDDEN_403' = 403,
	'NOT_FOUND_404' = 404,
	'METHOD_NOT_ALLOWED_405' = 405,
	'TOO_MANY_REQUESTS_429' = 429
};

export type Query = {
	pageNumber: number
	pageSize: number
	sortBy: string
	sortDirection: sortDirection.asc | sortDirection.desc
	searchNameTerm?: string
	searchLoginTerm?: string
	searchEmailTerm?: string
};

export type LoginInputModel = {
	loginOrEmail: string
	password: string
};

export type UserInputModel = {
	login: string
	password: string
	email: string
};

export type UserViewModel = {
	id: string
	login: string
	email: string
	createdAt: string
};

export class UserDBModel {
	constructor(
		public _id: ObjectID,
		public accountData: {
			login: string,
			email: string,
			passwordHash: string,
			passwordSalt: string,
			createdAt: string
		},
		public emailConfirmation: {
			confirmationCode: string,
			expirationDate: Date,
			isConfirmed: boolean,
			sentEmails: SentEmailType[]
		},
		public registrationDataType: {
			ip: string
		}
	) { }
};

export type SentEmailType = {
	sentDate: Date
};

export type CommentInputModel = {
	content: string
};

export type CommentViewModel = {
	id: string | null
	content: string
	commentatorInfo: CommentatorInfo
	createdAt: string
	likesInfo: LikesInfoViewModel
};

export type CommentatorInfo = {
	userId: string
	userLogin: string
};

export type LikesInfoViewModel = {
	likesCount: number
	dislikesCount: number
	myStatus: 'None' | 'Like' | 'Dislike'
};

// export enum LikeStatus {
// 	'None' = 'None',
// 	'Like' = 'Like',
// 	'Dislike' = 'Dislike',
// };

export class CommentDBModel {
	constructor(
		public _id: ObjectID,
		public content: string,
		public userId: string,
		public userLogin: string,
		public createdAt: string,
		public postId: string,
		public likesCount: number,
		public dislikesCount: number,
		public usersLikeStatus: UsersLikeStatus[]
	) { }
};

export type UsersLikeStatus = {
	userId: string,
	likeStatus: 'None' | 'Like' | 'Dislike',
};

export type LoginSuccessViewModel = {
	accessToken: string
};

export type MeViewModel = {
	email: string
	login: string
	userId: string
};

export type RegistrationConfirmationCodeModel = {
	code: string
};

export type RegistrationEmailResending = {
	email: string
};

export class TokensMetaDBModel {
	constructor(
		public _id: ObjectID,
		public createdAt: string,
		public expiredAt: string,
		public deviceId: string,
		public ip: string,
		public deviceName: string,
		public userId: string
	) { }
};

export type UsersRequestDBModel = {
	_id: ObjectId
	ip: string
	url: string
	createdAt: Date
};

export type DeviceViewModel = {
	ip: string,
	title: string,
	lastActiveDate: string,
	deviceId: string
};

export type NewPasswordRecoveryInputModel = {
	newPassword: string
	recoveryCode: string
};

export type PasswordRecoveryInputModel = {
	email: string
};

export class PasswordDataDBModel {
	constructor(
		public _id: ObjectID,
		public userId: ObjectID,
		public passwordRecoveryCode: string,
		public createdAt: string,
		public expiredAt: string
	) { }
};

export class TokensDTO {
	constructor(
		public accessToken: string,
		public refreshToken: string
	) { }
}

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

export type BlogViewModel = {
	id: string
	name: string
	description: string
	websiteUrl: string
	createdAt: string
};

export class BlogDBModel {
	constructor(
		public _id: ObjectID,
		public name: string,
		public description: string,
		public websiteUrl: string,
		public createdAt: string
	) { }
};

export type BlogDBInputModel = {
	name: string
	description: string
	websiteUrl: string
	createdAt: string
};