import Elysia from "elysia";

import getActivity from "@back/guards/getActivity";
import { activityElysiaSchema } from "@back/models/activity";

const update = new Elysia().use(getActivity).post(
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
      summary: "활동(동아리) 정보 가져오기",
      description: "1개의 활동(동아리)의 정보를 가져옵니다.",
    }
  },
);

export default update;
