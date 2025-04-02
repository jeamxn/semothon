import axios from "axios";
import Elysia, { t } from "elysia";

import UserModel from "@back/models/user";
import exit, { errorElysia } from "@back/utils/error";


const login = new Elysia().use(UserModel).post(
  "login",
  async ({ body, userModel, cookie, error }) => {
    const googleResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${body.token}`,
      },
    });
    if (googleResponse.status !== 200) {
      return exit(error, "INVALID_TOKEN");
    }
    const { email, picture, name } = googleResponse.data;

    const update = await userModel.db.findOneAndUpdate(
      { email },
      {
        picture,
        name,
      },
      {
        new: true,
        upsert: true,
      },
    );

    const refresh = await userModel.generateToken(update, "refresh");
    const access = await userModel.generateToken(update, "access");

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

    return {
      success: true,
    };
  },
  {
    body: t.Object({
      token: t.String({
        description: "구글 로그인에서 받은 토큰",
      }),
    }),
    response: {
      200: t.Object({
        success: t.Boolean({}),
      }),
      ...errorElysia(["USER_NOT_FOUND", "INVALID_TOKEN"]),
    },
    detail: {
      tags: ["Auth"],
      summary: "구글 로그인",
      description: "구글 로그인에서 받은 토큰을 통해 로그인합니다.",
    }
  },
);

export default login;
