import Elysia, { t } from "elysia";

import getActivity from "@back/guards/getActivity";
import { errorElysia } from "@back/utils/error";

const info = new Elysia().use(getActivity).get(
  "",
  async ({ activity }) => {
    return {
      ...activity
    };
  },
  {
    params: t.Object({
      id: t.String({
        description: "활동(동아리) ID",
      }),
    }),
    response: {
      ...errorElysia(["NO_ACTIVITY_ID", "NO_ACTIVITY"]),
    },
    detail: {
      tags: ["activity"],
      summary: "활동(동아리) 정보 가져오기",
      description: "1개의 활동(동아리)의 정보를 가져옵니다.",
    }
  },
);

export default info;
