import Elysia, { t } from "elysia";

import getActivity from "@back/guards/getActivity";
import BoardInfoModel, { boardInfoElysiaSchema } from "@back/models/board_info";

const list = new Elysia().use(BoardInfoModel).use(getActivity).get(
  "list/activity/:activity_id",
  async ({ boardInfo, activity }) => {
    const find = await boardInfo.db.find({
      activity_id: activity._id,
    });
    if (!find || find.length === 0) {
      return [];
    }
    const boardInfoList = find.map((board) => {
      return {
        ...board.toObject(),
        _id: board._id.toString(),
        activity_id: board.activity_id.toString(),
      };
    });
    return boardInfoList as any;
  },
  {
    response: {
      200: t.Array(boardInfoElysiaSchema),
    },
    detail: {
      tags: ["Board"],
      summary: "모든 활동(동아리) 정보 가져오기",
      description: "모든 활동(동아리)의 정보를 가져옵니다.",
    }
  },
);

export default list;
