export const env = {
  get PORT() {
    return process.env.PORT!;
  },
  get AUTH() {
    return process.env.AUTH!;
  }
};


export function validateEnv() {
    if(!env.PORT) {
        throw new Error("PORT is not found in the env")
    }
    if(!env.AUTH) {
        throw new Error("AUTH is not found in the env")
    }
}