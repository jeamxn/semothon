import Elysia from "elysia";

import activityAuthorityService from "@back/guards/activityAuthorityService";
import { activityElysiaSchema } from "@back/models/activity";

const update = new Elysia()
  .use(activityAuthorityService())
  .post(
    "",
    async ({ activity }) => {
      return activity;
    },
    {
      response: {
        200: activityElysiaSchema,
      },
      detail: {
        tags: ["Activity"],
        summary: "활동(동아리) 정보 수정하기",
        description: "1개의 활동(동아리)의 정보를 수정합니다.",
      }
    },
  );

export default update;
