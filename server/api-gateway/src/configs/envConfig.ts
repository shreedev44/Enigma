export const env = {
  get PORT() {
    return process.env.PORT!;
  },
  get AUTH() {
    return process.env.AUTH!;
  },
  get PROBLEM() {
    return process.env.PROBLEM
  },
  get JWT_ACCESS_SECRET() {
    return process.env.JWT_ACCESS_SECRET!;
  },
};


export function validateEnv() {
    if(!env.PORT) {
        throw new Error("PORT is not found in the env")
    }
    if(!env.AUTH) {
        throw new Error("AUTH is not found in the env")
    }
    if(!env.PROBLEM) {
      throw new Error("PROBLEM is not found in the env")
    }
    if(!env.JWT_ACCESS_SECRET) {
      throw new Error("JWT_ACCESS_SECRET is not found in the env")
    }
}