import Elysia, { t } from "elysia";

import UserModel from "@back/models/user";
import exit, { errorElysia } from "@back/utils/error";

const check = new Elysia().use(UserModel).post(
  "check",
  async ({ body, userModel, error }) => {
    const { refresh_token } = body;
    if (!refresh_token) return exit(error, "NO_REFRESH_TOKEN");
    const verify = await userModel.verifyToken(refresh_token);
    if (!verify) return exit(error, "UNAUTHORIZED");
    return {
      success: true,
    };
  },
  {
    body: t.Object({
      refresh_token: t.String({
        description: "사용자의 refresh_token",
      }),
    }),
    response: {
      200: t.Object({
        success: t.Boolean(),
      }),
      ...errorElysia(["NO_REFRESH_TOKEN", "UNAUTHORIZED"]),
    },
    detail: {
      tags: ["Auth"],
      summary: "Refresh Token 확인",
      description: "NextJS의 Middleware에서 사용되는 API입니다. refresh_token을 통해 유효성을 검사합니다.",
    }
  },
);

export default check;
