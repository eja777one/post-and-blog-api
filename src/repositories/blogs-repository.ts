import { BlogInputModel, BlogViewModel } from "../models";

const randomizer = () => (Math.random() * 10000).toFixed(0);

const blogs: Array<BlogViewModel> | [] = [
  {
    id: `b${randomizer()}`,
    name: 'name1',
    description: 'description1',
    websiteUrl: 'websiteUrl1',
  },
  {
    id: `b${randomizer()}`,
    name: 'name2',
    description: 'description2',
    websiteUrl: 'websiteUrl2',
  },
  {
    id: `b${randomizer()}`,
    name: 'name3',
    description: 'description3',
    websiteUrl: 'websiteUrl3',
  },
];

export const blogRepository = {
  getBlogs() { return blogs },

  addBlog(body: BlogInputModel) {
    const id = `b${randomizer()}`;
    const blog = { id, ...body };
    blogs.push(blog);
    return blog
  },

  getBlogById(id: string) {
    console.log(blogs.filter(blog => blog.id === id)[0]);
    return blogs.filter(blog => blog.id === id)[0];
  },

  updateBlog(id: string, body: BlogInputModel) {
    let blog = blogs.filter(blog => blog.id === id)[0];
    blog.name = body.name;
    blog.description = body.description;
    blog.websiteUrl = body.websiteUrl;
    return blog;
  },

  deleteBlogById(id: string) {
    for (let i = 0; i < blogs.length; i++) {
      if (blogs[i].id === id) {
        blogs.splice(i, 1);
        return;
      }
    }
  },

  deleteAll() { return blogs.splice(0) }
};