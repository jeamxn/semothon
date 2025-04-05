import Elysia, { t } from "elysia";

import getActivityAndJoinedUser from "@back/guards/getActivityAndJoinedUser";
import { userElysiaSchemaWithPermission } from "@back/models/user";

const list = new Elysia().use(getActivityAndJoinedUser).get(
  "",
  async ({ joined_users }) => joined_users,
  {
    response: {
      200: t.Array(
        userElysiaSchemaWithPermission
      ),
    },
    detail: {
      tags: ["Activity"],
      summary: "활동(동아리) 부원 정보 가져오기",
      description: "활동(동아리)의 부원 정보를 가져옵니다.",
    }
  },
);

export default list;
