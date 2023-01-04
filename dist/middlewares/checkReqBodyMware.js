"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReqBodyMware = exports.testCommentBody = exports.testAddUserReqBody = exports.testLoginPassReqBody = exports.testPostsReqBodyNoBlogId = exports.testPostsReqBody = exports.testBlogsReqBody = void 0;
const blogs_query_repository_1 = require("./../repositories/blogs-query-repository");
const express_validator_1 = require("express-validator");
exports.testBlogsReqBody = (0, express_validator_1.checkSchema)({
    name: {
        isString: true,
        trim: { options: [' '] },
        isLength: {
            options: { min: 1, max: 15 }
        },
    },
    description: {
        isString: true,
        trim: { options: [' '] },
        isLength: {
            options: { min: 1, max: 500 }
        },
    },
    websiteUrl: {
        isString: true,
        matches: {
            options: new RegExp('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+\.)*\/?$')
        },
        isLength: {
            options: { max: 100 }
        },
    },
});
exports.testPostsReqBody = (0, express_validator_1.checkSchema)({
    title: {
        isString: true,
        trim: { options: [' '] },
        isLength: {
            options: { min: 1, max: 30 }
        },
    },
    shortDescription: {
        isString: true,
        trim: { options: [' '] },
        isLength: {
            options: { min: 1, max: 100 }
        },
    },
    content: {
        isString: true,
        trim: { options: [' '] },
        isLength: {
            options: { min: 1, max: 1000 }
        },
    },
    blogId: {
        isString: true,
        trim: { options: [' '] },
        custom: {
            options: (value) => __awaiter(void 0, void 0, void 0, function* () {
                const blog = yield blogs_query_repository_1.blogsQueryRepository.getBlogById(value);
                if (!blog)
                    throw new Error('Blog id is unexist');
                else
                    return true;
            })
        }
    },
});
exports.testPostsReqBodyNoBlogId = (0, express_validator_1.checkSchema)({
    title: {
        isString: true,
        trim: { options: [' '] },
        isLength: {
            options: { min: 1, max: 30 }
        },
    },
    shortDescription: {
        isString: true,
        trim: { options: [' '] },
        isLength: {
            options: { min: 1, max: 100 }
        },
    },
    content: {
        isString: true,
        trim: { options: [' '] },
        isLength: {
            options: { min: 1, max: 1000 }
        },
    }
});
exports.testLoginPassReqBody = (0, express_validator_1.checkSchema)({
    loginOrEmail: { isString: true },
    password: { isString: true }
});
exports.testAddUserReqBody = (0, express_validator_1.checkSchema)({
    login: {
        isString: true,
        isLength: {
            options: { min: 3, max: 10 }
        },
    },
    password: {
        isString: true,
        isLength: {
            options: { min: 6, max: 20 }
        },
    },
    email: {
        isString: true,
        matches: {
            options: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        },
    }
});
exports.testCommentBody = (0, express_validator_1.checkSchema)({
    content: {
        isString: true,
        isLength: {
            options: { min: 20, max: 300 }
        }
    }
});
const checkReqBodyMware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const rawErrors = [];
        for (let el of errors.array()) {
            rawErrors.push(el.param);
        }
        ;
        const tempErrors = Array.from(new Set(rawErrors));
        const myErrors = tempErrors.map(e => ({ message: `incorrect ${e}`, field: e }));
        return res.status(400).json({ errorsMessages: myErrors });
        // TEST #2.3, #2.9, #2.16, #3.3, #3.9, #3.18, #4.4, #4.12
    }
    else
        next();
};
exports.checkReqBodyMware = checkReqBodyMware;
