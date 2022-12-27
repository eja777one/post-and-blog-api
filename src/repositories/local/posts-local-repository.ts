import { blogRepository } from './blogs-local-repository';
import { PostInputModel, PostViewModel } from '../../models';

const randomizer = () => (Math.random() * 10000).toFixed(0);

const posts: Array<PostViewModel> | [] = [
  {
    id: `p${randomizer()}`,
    title: 'title1',
    shortDescription: 'shortDescription1',
    content: 'content1',
    blogId: 'blogId1',
    blogName: 'blogName1',
    createdAt: "2022-12-18T06:57:43.998Z"
  },
  {
    id: `p${randomizer()}`,
    title: 'title2',
    shortDescription: 'shortDescription2',
    content: 'content2',
    blogId: 'blogId2',
    blogName: 'blogName2',
    createdAt: "2022-12-18T06:57:43.998Z"
  },
  {
    id: `p${randomizer()}`,
    title: 'title3',
    shortDescription: 'shortDescription3',
    content: 'content3',
    blogId: 'blogId3',
    blogName: 'blogName3',
    createdAt: "2022-12-18T06:57:43.998Z"
  },
];

export const postsRepository = {
  async getPosts() { return posts },

  async createPost(body: PostInputModel) {
    // const blogName = await blogRepository.getBlogById(body.blogId).name;
    const blogName = await blogRepository.getBlogById(body.blogId).then(value => value.name);

    const id = `p${randomizer()}`;
    const createdAt = new Date().toISOString();

    const post = { id, blogName, createdAt, ...body };
    posts.push(post);
    return post;
  },

  async getPostById(id: string) {
    const post = posts.filter(post => post.id === id)[0];
    return post;
  },

  async updatePost(id: string, body: PostInputModel) {
    const blogName = await blogRepository.getBlogById(body.blogId).then(value => value.name);
    let post = posts.filter(post => post.id === id)[0];
    post.title = body.title;
    post.shortDescription = body.shortDescription;
    post.content = body.content;
    post.blogId = body.blogId;
    post.blogName = blogName;
    return post;
  },

  async deletePostById(id: string) {
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === id) {
        posts.splice(i, 1);
        return;
      }
    }
  },

  async deleteAll() { return posts.splice(0) }
}