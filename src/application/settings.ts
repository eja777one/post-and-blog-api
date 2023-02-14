export const settings = {
  MONGO_URI: process.env.mongoURI
    || "mongodb://0.0.0.0:27017/?maxPoolSize=20&w=majority",
  ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET || "access tokSecret",
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET || "refresh tokSecret",
};