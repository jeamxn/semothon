import Elysia from "elysia";

import exit from "@back/utils/error";

import userService from "./userService";

const getUser = new Elysia()
  .use(userService)
  .guard({
    isSignIn: true,
  })
  .resolve(async ({ cookie, userModel, error }) => {
    const access_token = cookie.access_token.value;
    if (!access_token) {
      return exit(error, "UNAUTHORIZED");
    }
    const verify = await userModel.verifyToken(access_token);
    if (!verify) {
      return exit(error, "UNAUTHORIZED");
    }
    const userSearch = await userModel.db.findById(verify.id);
    const { ...userInfo } = { ...userSearch?.toObject() };
    return {
      user: {
        ...userInfo,
        id: userInfo._id?.toString(),
      },
    };
  })
  .as("plugin");

export default getUser;
