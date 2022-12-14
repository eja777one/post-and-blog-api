"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReqBodyMware = exports.testPostsReqBody = exports.testBlogsReqBody = void 0;
const express_validator_1 = require("express-validator");
const blogs_repository_1 = require("../repositories/blogs-repository");
exports.testBlogsReqBody = (0, express_validator_1.checkSchema)({
    name: {
        isString: true,
        isLength: {
            options: { max: 15 }
        },
    },
    description: {
        isString: true,
        isLength: {
            options: { max: 500 }
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
        isLength: {
            options: { max: 30 }
        },
    },
    shortDescription: {
        isString: true,
        isLength: {
            options: { max: 100 }
        },
    },
    content: {
        isString: true,
        isLength: {
            options: { max: 1000 }
        },
    },
    blogId: {
        isString: true,
        custom: {
            options: (value, { req, location, path }) => {
                const blog = blogs_repository_1.blogRepository.getBlogById(value);
                if (!blog)
                    throw new Error('Blog id is unexist');
                else
                    return true;
            }
        }
    },
});
const checkReqBodyMware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const myErrors = []; // BAD BAD BAD
        for (let el of errors.array()) {
            const error = {
                message: `incorrect ${el.param}`,
                field: el.param
            };
            myErrors.push(error);
        }
        return res.status(400).json({ errorsMessages: myErrors }); // TEST #2.3, #2.9, #3.3, #3.9
    }
    else
        next();
};
exports.checkReqBodyMware = checkReqBodyMware;
