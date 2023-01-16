import { BlogInputModel, BlogViewModel } from "../../src/models";

const randomizer = () => (Math.random() * 10000).toFixed(0);

const blogs: Array<BlogViewModel> | [] = [
  {
    id: `b${randomizer()}`,
    name: 'name1',
    description: 'description1',
    websiteUrl: 'websiteUrl1',
    createdAt: "2022-12-18T06:57:43.998Z"
  },
  {
    id: `b${randomizer()}`,
    name: 'name2',
    description: 'description2',
    websiteUrl: 'websiteUrl2',
    createdAt: "2022-12-18T06:57:43.998Z"
  },
  {
    id: `b${randomizer()}`,
    name: 'name3',
    description: 'description3',
    websiteUrl: 'websiteUrl3',
    createdAt: "2022-12-18T06:57:43.998Z"
  },
];

export const blogRepository = {
  async getBlogs() { return blogs },

  async createBlog(body: BlogInputModel) {
    const id = `b${randomizer()}`;
    const createdAt = new Date().toISOString();
    const blog = { id, createdAt, ...body };

    blogs.push(blog);
    return blog;
  },

  async getBlogById(id: string) {
    return blogs.filter(blog => blog.id === id)[0];
  },

  async updateBlog(id: string, body: BlogInputModel) {
    let blog = blogs.filter(blog => blog.id === id)[0];
    blog.name = body.name;
    blog.description = body.description;
    blog.websiteUrl = body.websiteUrl;
    return blog;
  },

  async deleteBlogById(id: string) {
    for (let i = 0; i < blogs.length; i++) {
      if (blogs[i].id === id) {
        blogs.splice(i, 1);
        return;
      }
    }
  },

  async deleteAll() { return blogs.splice(0) }
};