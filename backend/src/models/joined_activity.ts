import dayjs from "dayjs";
import Elysia, { t } from "elysia";
import mongoose, { ObjectId } from "mongoose";

import { IDocument } from "@common/types/db";

export const permissionList = [
  // 위로 갈수록 권한이 높음
  "president", // 동장
  "vice_president", // 부동장
  "member", // 동아리원
  "everyone", // 모든 사용자
  // 아래로 갈수록 권한이 낮음
] as const;
export type PermissionType = typeof permissionList[number];

export interface DJoinedActivity {
  activity_id: ObjectId;
  user_id: ObjectId;
  permission: PermissionType;
  joined_at: String;
}
export type IJoinedActivity = IDocument<DJoinedActivity>;

export const joinedActivityElysiaSchema = t.Object({
  activity_id: t.String({
    description: "활동(동아리) ID",
    examples: ["646f3a2b4c1d4e2f8c8b4567"],
  }),
  user_id: t.String({
    description: "사용자 ID",
    examples: ["646f3a2b4c1d4e2f8c8b4567"],
  }),
  permission: t.String({
    description: "활동(동아리) 권한",
    examples: permissionList,
  }),
  joined_at: t.String({
    description: "가입 날짜",
    examples: ["2023-10-01 12:00:00"],
  }),
});

const joinedActivitySchema = new mongoose.Schema({
  activity_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  permission: {
    type: String,
    enum: ["president", "vice_president", "member"],
    default: "member",
  },
  joined_at: {
    type: String,
    default: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  },
});
const JoinedActivityDB = mongoose.model<IJoinedActivity>("JoinedActivity", joinedActivitySchema);

const findByActivityIdAndUserId = async ({
  activity_id,
  user_id,
}: {
  activity_id: ObjectId;
  user_id: ObjectId;
}): Promise<IJoinedActivity[] | null> => {
  const joinedActivity = await JoinedActivityDB.find({
    activity_id,
    user_id,
  });
  return joinedActivity;
};

const JoinedActivityModel = new Elysia()
  .decorate("joinedActivityModel", {
    db: JoinedActivityDB,
    find: findByActivityIdAndUserId,
  });

export default JoinedActivityModel;
