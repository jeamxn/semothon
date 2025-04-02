import Elysia, { t } from "elysia";

import { Me } from "@common/types/responses";

import getUser from "@back/guards/getUser";

const me = new Elysia().use(getUser).get(
  "me",
  async ({ user }): Promise<Me> => {
    return {
      id: user.id,
      email: user.email,
    };
  },
  {
    response: {
      200: t.Object({
        id: t.String(),
        email: t.String(),
      }),
    },
    detail: {
      tags: ["Auth"],
      summary: "내 정보 가져오기",
      description: "나의 정보를 가져옵니다.",
    }
  },
);

export default me;
