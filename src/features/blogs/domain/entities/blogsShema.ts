import { Model, Schema, HydratedDocument } from "mongoose";
import { BlogDBModel } from './../../../../models';
import { BlogModel } from "../../../../db";

interface IBlogMethods {
  // someMethod(): null;
  updateBlog(name: string, description: string, websiteUrl: string): void;
}

export interface IBlogDBModel extends Model<BlogDBModel, {}, IBlogMethods> {
  makeBlog(name: string, description: string, websiteUrl: string): BlogDBModel;
  // someOtherMethod(): Promise<HydratedDocument<BlogDBModel, IBlogDBModel>>
};

export const blogSchema = new Schema<BlogDBModel, IBlogDBModel>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true }
  }
);

blogSchema.static('makeBlog', function makeBlog(name: string,
  description: string, websiteUrl: string) {
  return new BlogModel({
    name: name,
    description: description,
    websiteUrl: websiteUrl,
    createdAt: new Date().toISOString()
  });
});

blogSchema.method('updateBlog', function updateBlog(name: string,
  description: string, websiteUrl: string) {
  this.name = name;
  this.description = description;
  this.websiteUrl = websiteUrl;
});