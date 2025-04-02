import Elysia from "elysia";

import { IUser } from "@back/models/user";
import exit, { errorElysia } from "@back/utils/error";

import userService from "./userService";

const getUser = new Elysia()
  .use(userService)
  .guard({
    isSignIn: true,
    response: {
      ...errorElysia(["UNAUTHORIZED"])
    }
  })
  .resolve(async ({ cookie, userModel, error }): Promise<{
    user: IUser;
  }> => {
    const access_token = cookie.access_token.value;
    if (!access_token) {
      return exit(error, "UNAUTHORIZED");
    }
    const verify = await userModel.verifyToken(access_token);
    if (!verify) {
      return exit(error, "UNAUTHORIZED");
    }
    const userSearch = await userModel.db.findById(verify.id);
    if (!userSearch) {
      return exit(error, "UNAUTHORIZED");
    }
    const userInfo: IUser = userSearch.toObject();
    return {
      user: userInfo,
    };
  })
  .as("plugin");

export default getUser;
