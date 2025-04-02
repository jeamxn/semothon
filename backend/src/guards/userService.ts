import { Elysia } from "elysia";

import UserModel from "@back/models/user";
import exit, { errorElysia } from "@back/utils/error";

const userService = new Elysia({ name: "user/service" })
  .state({
    user: {} as Record<string, string>,
    session: {} as Record<number, string>,
  })
  .model({})
  .use(UserModel)
  .guard({
    response: {
      ...errorElysia(["UNAUTHORIZED"])
    }
  })
  .macro({
    isSignIn: (enabled: boolean) => {
      if (!enabled) return;
      return {
        beforeHandle: async ({ cookie, userModel, error }) => {
          const access_token = cookie.access_token.value;
          const verify = await userModel.verifyToken(access_token ?? "");
          if (!verify) {
            const refresh_token = cookie.refresh_token.value;
            if (!refresh_token) return exit(error, "UNAUTHORIZED");
            const verifyR = await userModel.verifyToken(refresh_token);
            if (!verifyR) return exit(error, "UNAUTHORIZED");
            const find = await userModel.db.findById(verifyR.id);
            if (!find) return exit(error, "UNAUTHORIZED");
            const refresh = await userModel.generateToken(find, "refresh");
            const access = await userModel.generateToken(find, "access");
            cookie.refresh_token.set({
              value: refresh,
              httpOnly: true,
              maxAge: 60 * 60 * 24 * 7,
              path: "/",
              sameSite: "none",
              secure: true,
            });
            cookie.access_token.set({
              value: access,
              httpOnly: true,
              maxAge: 60 * 15,
              path: "/",
              sameSite: "none",
              secure: true,
            });
          }
        },
      };
    },
  });

export default userService;
