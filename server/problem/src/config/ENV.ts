export const env = {
  get PORT() {
    return process.env.PORT!;
  },
  get MONGO_URI() {
    return process.env.MONGO_URI!;
  },
};
