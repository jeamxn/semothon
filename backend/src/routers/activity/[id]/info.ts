import Elysia from "elysia";

import getActivity from "@back/guards/getActivity";
import { activityElysiaSchema } from "@back/models/activity";

const info = new Elysia().use(getActivity).get(
  "",
  async ({ activity }) => ({
    ...activity,
    _id: activity._id.toString(),
  }),
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

export default info;
