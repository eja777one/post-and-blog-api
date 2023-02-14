import { UsersRequestDBModel } from '../../../../models';
import mongoose from "mongoose";

export const usersRequestSchema = new mongoose.Schema<UsersRequestDBModel>({
  ip: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, required: true }
});
